import { prisma } from "../prisma";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";
import { z } from "zod";

const albumSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

const getUserId = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw new HttpError(401, "Não autorizado");
  }
  return req.user.id;
};

export const listAlbums = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getUserId(req);
  const albums = await prisma.album.findMany({
    where: { userId },
    include: {
      _count: { select: { photos: true } },
      photos: { take: 1, orderBy: { createdAt: "desc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  res.json(albums);
});

export const getAlbum = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getUserId(req);
  const id = Number(req.params.id);

  const album = await prisma.album.findFirst({
    where: { id, userId },
    include: { photos: { orderBy: { createdAt: "desc" } } },
  });

  if (!album) {
    throw new HttpError(404, "Álbum não encontrado");
  }

  res.json(album);
});

export const createAlbum = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = getUserId(req);
    const { title, description } = albumSchema.parse(req.body);

    const album = await prisma.album.create({
      data: { title, description, userId },
    });

    res.status(201).json(album);
  },
);

export const updateAlbum = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = getUserId(req);
    const { title, description } = albumSchema.parse(req.body);
    const id = Number(req.params.id);

    const existing = await prisma.album.findFirst({ where: { id, userId } });
    if (!existing) {
      throw new HttpError(404, "Álbum não encontrado");
    }

    const updated = await prisma.album.update({
      where: { id },
      data: { title, description },
    });

    res.json(updated);
  },
);

export const deleteAlbum = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = getUserId(req);
    const id = Number(req.params.id);

    const album = await prisma.album.findFirst({
      where: { id, userId },
      include: { _count: { select: { photos: true } } },
    });

    if (!album) {
      throw new HttpError(404, "Álbum não encontrado");
    }

    if (album._count.photos > 0) {
      throw new HttpError(
        400,
        "Não é possível excluir um álbum que contém fotos",
      );
    }

    await prisma.album.delete({ where: { id } });
    res.status(204).send();
  },
);
