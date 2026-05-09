import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { client } from "../../lib/api/client";
import type { Album, MediaItem, SuccessResponse } from "../../lib/types";

export const albumFormSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().optional(),
  eventDate: z.string().min(1),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
});

export const mediaUploadSchema = z.object({
  albumId: z.string().regex(/^[a-f0-9]{24}$/i),
  type: z.enum(["photo", "video"]),
  caption: z.string().optional(),
  file: z
    .custom<File | undefined>((value) => value === undefined || value instanceof File)
    .refine((value): value is File => value instanceof File, {
      message: "Please choose a file",
    }),
});

export type AlbumFormValues = z.infer<typeof albumFormSchema>;
export type MediaUploadValues = z.infer<typeof mediaUploadSchema>;

export function useAlbums() {
  return useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const response = await client.get<SuccessResponse<Album[]>>("/gallery/albums");
      return response.data.data;
    },
  });
}

export function useAlbum(albumId: string | null) {
  return useQuery({
    queryKey: ["album", albumId],
    enabled: Boolean(albumId),
    queryFn: async () => {
      const response = await client.get<SuccessResponse<{ album: Album; media: MediaItem[] }>>(
        `/gallery/albums/${albumId}`,
      );
      return response.data.data;
    },
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: AlbumFormValues) => {
      const response = await client.post<SuccessResponse<Album>>("/gallery/albums", {
        ...values,
        coverImageUrl: values.coverImageUrl || undefined,
      });
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: MediaUploadValues) => {
      const formData = new FormData();
      formData.append("albumId", values.albumId);
      formData.append("type", values.type);
      if (values.caption) {
        formData.append("caption", values.caption);
      }
      formData.append("file", values.file);

      const response = await client.post<SuccessResponse<MediaItem>>("/gallery/media", formData);
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.delete<SuccessResponse<MediaItem>>(`/gallery/media/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });
}
