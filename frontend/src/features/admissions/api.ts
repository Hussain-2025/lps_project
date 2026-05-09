import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { client } from "../../lib/api/client";
import type { Admission, PaginatedResponse, SuccessResponse } from "../../lib/types";

export const admissionFormSchema = z.object({
  studentName: z.string().trim().min(2),
  dob: z.string().min(1),
  classApplied: z.string().trim().min(1),
  parentName: z.string().trim().min(2),
  email: z.string().email(),
  phone: z.string().trim().min(7),
  address: z.string().trim().min(10),
  academicYear: z.string().trim().min(4),
  photo: z.custom<File | null | undefined>((value) => value == null || value instanceof File),
});

export const admissionStatusSchema = z.object({
  status: z.enum(["submitted", "under_review", "shortlisted", "admitted", "rejected"]),
  notes: z.string().optional(),
});

export type AdmissionFormValues = z.infer<typeof admissionFormSchema>;
export type AdmissionStatusValues = z.infer<typeof admissionStatusSchema>;

export async function submitAdmission(values: AdmissionFormValues) {
  const formData = new FormData();
  formData.append("studentName", values.studentName);
  formData.append("dob", values.dob);
  formData.append("classApplied", values.classApplied);
  formData.append("parentName", values.parentName);
  formData.append("email", values.email);
  formData.append("phone", values.phone);
  formData.append("address", values.address);
  formData.append("academicYear", values.academicYear);
  if (values.photo) {
    formData.append("photo", values.photo);
  }

  const response = await client.post<SuccessResponse<Admission>>("/admissions", formData);
  return response.data.data;
}

export function useAdmissions(params: { page?: number; status?: string; academicYear?: string }) {
  return useQuery({
    queryKey: ["admissions", params],
    queryFn: async () => {
      const response = await client.get<PaginatedResponse<Admission>>("/admissions", {
        params,
      });
      return response.data;
    },
  });
}

export function useAdmission(id: string | null) {
  return useQuery({
    queryKey: ["admission", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await client.get<SuccessResponse<Admission>>(`/admissions/${id}`);
      return response.data.data;
    },
  });
}

export function useUpdateAdmissionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: AdmissionStatusValues }) => {
      const response = await client.patch<SuccessResponse<Admission>>(
        `/admissions/${id}/status`,
        values,
      );
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admissions"] });
    },
  });
}
