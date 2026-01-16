export interface User {
  id: number;
  email: string;
  name?: string | null;
}

export interface Photo {
  id: number;
  title: string;
  description?: string | null;
  fileName: string;
  filePath: string;
  sizeBytes: number;
  acquisitionDate: string;
  predominantColor?: string | null;
  albumId: number;
  createdAt: string;
}

export interface Album {
  id: number;
  title: string;
  description: string;
  userId?: number;
  createdAt: string;
  updatedAt: string;
  photos?: Photo[];
  _count?: { photos: number };
}

export type ViewMode = "grid" | "table";
