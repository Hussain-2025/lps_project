import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FormMessage } from "../components/forms";
import {
  contactFormSchema,
  submitContact,
  type ContactFormValues,
} from "../features/contact/api";
import { getApiError } from "../lib/api/errors";

export function ContactPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      message: "",
      name: "",
      phone: "",
      subject: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setMessage(null);
    setErrorMessage(null);

    try {
      await submitContact(values);
      form.reset();
      setMessage("Your message has been sent.");
    } catch (error) {
      setErrorMessage(getApiError(error).message);
    }
  }

  return (
    <section className="section">
      <div className="container form-layout">
        <div className="page-intro">
          <p className="eyebrow">Contact Us</p>
          <h1>Reach the school office</h1>
          <p className="lead">
            Send an enquiry, request information, or connect with the school administration.
          </p>
        </div>
        <form className="card surface-card form-card" onSubmit={form.handleSubmit(onSubmit)}>
          <Field error={form.formState.errors.name?.message} label="Name">
            <input {...form.register("name")} />
          </Field>
          <Field error={form.formState.errors.email?.message} label="Email">
            <input type="email" {...form.register("email")} />
          </Field>
          <Field error={form.formState.errors.phone?.message} label="Phone">
            <input {...form.register("phone")} />
          </Field>
          <Field error={form.formState.errors.subject?.message} label="Subject">
            <input {...form.register("subject")} />
          </Field>
          <Field error={form.formState.errors.message?.message} label="Message">
            <textarea rows={6} {...form.register("message")} />
          </Field>
          {message ? <FormMessage type="success">{message}</FormMessage> : null}
          {errorMessage ? <FormMessage type="error">{errorMessage}</FormMessage> : null}
          <button className="button button-primary" disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
