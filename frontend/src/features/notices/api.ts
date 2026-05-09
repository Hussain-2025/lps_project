import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { client } from "../../lib/api/client";
import type { Notice, PaginatedResponse, SuccessResponse } from "../../lib/types";

export const noticeFormSchema = z.object({
  title: z.string().trim().min(3),
  body: z.string().trim().min(3),
  attachmentUrl: z.string().url().optional().or(z.literal("")),
  audience: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("all") }),
    z.object({
      kind: z.literal("role"),
      value: z.enum(["super_admin", "admin", "teacher", "student", "parent"]),
    }),
    z.object({
      kind: z.literal("class"),
      value: z.string().regex(/^[a-f0-9]{24}$/i, "Enter a valid class id"),
    }),
  ]),
  tags: z.string().default(""),
  isPublished: z.boolean().default(false),
});

export type NoticeFormValues = z.infer<typeof noticeFormSchema>;

function toPayload(values: NoticeFormValues) {
  return {
    title: values.title,
    body: values.body,
    attachmentUrl: values.attachmentUrl || undefined,
    audience: values.audience,
    tags: values.tags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    isPublished: values.isPublished,
  };
}

export function useNotices(params: { page?: number; tag?: string; search?: string; includeUnpublished?: boolean }) {
  return useQuery({
    queryKey: ["notices", params],
    queryFn: async () => {
      const response = await client.get<PaginatedResponse<Notice>>("/notices", {
        params,
      });
      return response.data;
    },
  });
}

export function useNotice(id: string | null) {
  return useQuery({
    queryKey: ["notice", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await client.get<SuccessResponse<Notice>>(`/notices/${id}`);
      return response.data.data;
    },
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: NoticeFormValues) => {
      const response = await client.post<SuccessResponse<Notice>>("/notices", toPayload(values));
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
}

export function useUpdateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: NoticeFormValues }) => {
      const response = await client.patch<SuccessResponse<Notice>>(
        `/notices/${id}`,
        toPayload(values),
      );
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.delete<SuccessResponse<Notice>>(`/notices/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
}
