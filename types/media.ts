import { Media } from "@prisma/client";

export type PendingMedia = {
    id: string;
    file: File;
    url: string;
    caption: string;
    date?: string;
    folderPath: string;
    status: "pending" | "uploading" | "error";
}

export type CreateMediaDTO = {
    public_id: string;
    url: string;
    caption: string;
    type: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    date?: Date | null;
    folderPath: string
    createdAt: Date;
}

export type UpdateMediaDTO = {
    caption?: string;
    date?: Date;
}

export type SavedMedia = Media & {
    status: 'saved'
}