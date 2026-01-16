import { Album, Photo } from "../types";
import api from "./api";

export const fetchAlbums = async () => {
  const res = await api.get<Album[]>("/albums");
  return res.data;
};

export const fetchAlbum = async (id: number) => {
  const res = await api.get<Album>(`/albums/${id}`);
  return res.data;
};

export const createAlbum = async (payload: {
  title: string;
  description: string;
}) => {
  const res = await api.post<Album>("/albums", payload);
  return res.data;
};

export const updateAlbum = async (
  id: number,
  payload: { title: string; description: string },
) => {
  const res = await api.put<Album>(`/albums/${id}`, payload);
  return res.data;
};

export const deleteAlbum = async (id: number) => {
  await api.delete(`/albums/${id}`);
};

export const uploadPhotos = async (
  albumId: number,
  payload: {
    files: FileList | File[];
    title?: string;
    description?: string;
    acquisitionDate?: string;
    predominantColor?: string;
  },
) => {
  const formData = new FormData();
  const filesArray = Array.from(payload.files);

  filesArray.forEach((file) => formData.append("files", file));
  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.acquisitionDate)
    formData.append("acquisitionDate", payload.acquisitionDate);
  if (payload.predominantColor)
    formData.append("predominantColor", payload.predominantColor);

  const res = await api.post<Photo[]>(`/albums/${albumId}/photos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const deletePhoto = async (id: number) => {
  await api.delete(`/photos/${id}`);
};
