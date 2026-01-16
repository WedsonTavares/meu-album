import fs from "fs/promises";
import path from "path";
import { prisma } from "../prisma";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { extractPredominantColor } from "../utils/color";
import { extractAcquisitionDate } from "../utils/exif";
import { HttpError } from "../utils/httpError";
import { resolveUploadPath } from "../config/upload";

const getUserId = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw new HttpError(401, "Não autorizado");
  }
  return req.user.id;
};

export const addPhotos = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getUserId(req);
  const albumId = Number(req.params.albumId);

  const album = await prisma.album.findFirst({ where: { id: albumId, userId } });
  if (!album) {
    throw new HttpError(404, "Álbum não encontrado");
  }

  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    throw new HttpError(400, "Envie ao menos uma foto");
  }

  const results = [];
  for (const file of files) {
    const buffer = await fs.readFile(file.path);

    const acquisitionInput = req.body.acquisitionDate
      ? new Date(req.body.acquisitionDate)
      : null;
    const acquisitionFromExif = await extractAcquisitionDate(buffer);
    const acquisitionDate =
      acquisitionInput && !isNaN(acquisitionInput.getTime())
        ? acquisitionInput
        : acquisitionFromExif || new Date();

    const predominantColor =
      (req.body.predominantColor as string | undefined) ||
      (await extractPredominantColor(file.path));

    const title =
      (req.body.title as string | undefined) || path.parse(file.originalname).name;
    const description = (req.body.description as string | undefined) || null;

    const created = await prisma.photo.create({
      data: {
        title,
        description,
        fileName: file.filename,
        filePath: path.posix.join("/uploads", file.filename),
        sizeBytes: file.size,
        acquisitionDate,
        predominantColor,
        albumId,
      },
    });

    results.push(created);
  }

  res.status(201).json(results);
});

export const deletePhoto = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = getUserId(req);
    const photoId = Number(req.params.id);

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { album: { select: { userId: true } } },
    });

    if (!photo || photo.album.userId !== userId) {
      throw new HttpError(404, "Foto não encontrada");
    }

    await prisma.photo.delete({ where: { id: photoId } });

    const fullPath = resolveUploadPath(photo.fileName);
    fs.unlink(fullPath).catch(() => null);

    res.status(204).send();
  },
);
