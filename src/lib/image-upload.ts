import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES } from "./constants";

export class UploadError extends Error {}

export async function saveUploadedFile(file: File): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new UploadError(`Неподдържан тип файл: ${file.type}`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError(`Файлът надвишава максималния размер от 5 МБ`);
  }
  const ext = file.name.split(".").pop() ?? "jpg";
  const name = `${randomUUID()}.${ext}`;
  const dest = path.join(process.cwd(), "public", "uploads", name);
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(dest, buf);
  return `/uploads/${name}`;
}
