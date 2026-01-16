import exifr from "exifr";

export async function extractAcquisitionDate(buffer: Buffer) {
  try {
    const data = await exifr.parse(buffer, {
      pick: ["DateTimeOriginal", "CreateDate"],
    });

    const date = (data as { DateTimeOriginal?: Date; CreateDate?: Date } | null)
      ?.DateTimeOriginal ?? (data as { CreateDate?: Date } | null)?.CreateDate;

    return date ? new Date(date) : null;
  } catch {
    return null;
  }
}
