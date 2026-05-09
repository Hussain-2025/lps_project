import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FormMessage } from "../components/forms";
import {
  admissionFormSchema,
  submitAdmission,
  type AdmissionFormValues,
} from "../features/admissions/api";
import { getApiError } from "../lib/api/errors";

export function AdmissionPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
      academicYear: "2026-2027",
      address: "",
      classApplied: "",
      dob: "",
      email: "",
      parentName: "",
      phone: "",
      studentName: "",
    },
  });

  async function onSubmit(values: AdmissionFormValues) {
    setMessage(null);
    setErrorMessage(null);

    try {
      await submitAdmission(values);
      form.reset({
        academicYear: "2026-2027",
        address: "",
        classApplied: "",
        dob: "",
        email: "",
        parentName: "",
        phone: "",
        studentName: "",
      });
      setMessage("Admission enquiry submitted successfully.");
    } catch (error) {
      setErrorMessage(getApiError(error).message);
    }
  }

  return (
    <section className="section">
      <div className="container form-layout">
        <div className="page-intro">
          <p className="eyebrow">Online Admission</p>
          <h1>Begin the admission enquiry process</h1>
          <p className="lead">
            This form is connected to the backend admissions API and supports an optional passport photo upload.
          </p>
        </div>
        <form className="card surface-card form-card" onSubmit={form.handleSubmit(onSubmit)}>
          <Field error={form.formState.errors.studentName?.message} label="Student name">
            <input {...form.register("studentName")} />
          </Field>
          <Field error={form.formState.errors.dob?.message} label="Date of birth">
            <input type="date" {...form.register("dob")} />
          </Field>
          <Field error={form.formState.errors.classApplied?.message} label="Class applying for">
            <input {...form.register("classApplied")} />
          </Field>
          <Field error={form.formState.errors.parentName?.message} label="Parent name">
            <input {...form.register("parentName")} />
          </Field>
          <Field error={form.formState.errors.email?.message} label="Email">
            <input type="email" {...form.register("email")} />
          </Field>
          <Field error={form.formState.errors.phone?.message} label="Phone">
            <input {...form.register("phone")} />
          </Field>
          <Field error={form.formState.errors.address?.message} label="Address">
            <textarea rows={4} {...form.register("address")} />
          </Field>
          <Field error={form.formState.errors.academicYear?.message} label="Academic year">
            <input {...form.register("academicYear")} />
          </Field>
          <Field label="Passport photo (optional)">
            <input
              accept="image/*"
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                form.setValue("photo", file);
              }}
            />
          </Field>
          {message ? <FormMessage type="success">{message}</FormMessage> : null}
          {errorMessage ? <FormMessage type="error">{errorMessage}</FormMessage> : null}
          <button className="button button-primary" disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Submitting..." : "Submit Admission Enquiry"}
          </button>
        </form>
      </div>
    </section>
  );
}
