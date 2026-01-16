import sharp from "sharp";

export async function extractPredominantColor(filePath: string) {
  try {
    const { data } = await sharp(filePath)
      .resize(1, 1, { fit: "cover" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const [r, g, b] = data;
    return rgbToHex(r, g, b);
  } catch {
    return null;
  }
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((value) => {
        const hex = value.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      })
      .join("")
  );
}
