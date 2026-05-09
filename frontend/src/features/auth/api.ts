import { z } from "zod";

import { client } from "../../lib/api/client";
import type { AuthUser, SuccessResponse } from "../../lib/types";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export async function loginRequest(values: LoginFormValues) {
  const response = await client.post<SuccessResponse<{ user: AuthUser; accessToken: string }>>(
    "/auth/login",
    values,
  );

  return response.data.data;
}
