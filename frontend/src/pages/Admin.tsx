import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DOMPurify from "dompurify";

import { Field, FormMessage } from "../components/forms";
import {
  admissionStatusSchema,
  useAdmission,
  useAdmissions,
  useUpdateAdmissionStatus,
  type AdmissionStatusValues,
} from "../features/admissions/api";
import {
  albumFormSchema,
  mediaUploadSchema,
  useAlbum,
  useAlbums,
  useCreateAlbum,
  useDeleteMedia,
  useUploadMedia,
  type AlbumFormValues,
  type MediaUploadValues,
} from "../features/gallery/api";
import {
  noticeFormSchema,
  useCreateNotice,
  useDeleteNotice,
  useNotices,
  useUpdateNotice,
  type NoticeFormValues,
} from "../features/notices/api";
import { client } from "../lib/api/client";
import { getApiError } from "../lib/api/errors";
import type { Role } from "../lib/types";
import { useAuth } from "../auth/AuthProvider";

export function AdminDashboardPage() {
  const { user } = useAuth();
  const admissions = useAdmissions({ page: 1 });
  const notices = useNotices({ page: 1, includeUnpublished: true });
  const albums = useAlbums();

  return (
    <div className="admin-section">
      <div className="admin-hero">
        <p className="eyebrow">Admin Dashboard</p>
        <h1>Welcome back, {user?.name}</h1>
        <p className="lead">
          This workspace is wired to the current backend for admissions, notices, and gallery publishing.
        </p>
      </div>
      <div className="stats-grid">
        <article className="card surface-card">
          <strong>{admissions.data?.pagination.total ?? 0}</strong>
          <span>Admission records</span>
        </article>
        <article className="card surface-card">
          <strong>{notices.data?.pagination.total ?? 0}</strong>
          <span>Notice records</span>
        </article>
        <article className="card surface-card">
          <strong>{albums.data?.length ?? 0}</strong>
          <span>Published albums</span>
        </article>
      </div>
    </div>
  );
}

export function ManageAdmissionsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const admissions = useAdmissions({ page: 1 });
  const admission = useAdmission(selectedId);
  const updateStatus = useUpdateAdmissionStatus();
  const form = useForm<AdmissionStatusValues>({
    resolver: zodResolver(admissionStatusSchema),
    defaultValues: {
      status: "under_review",
      notes: "",
    },
  });

  async function exportAdmissions() {
    setErrorMessage(null);
    try {
      const response = await client.get<Blob>("/admissions/export", {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "admissions.csv";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage(getApiError(error).message);
    }
  }

  async function onSubmit(values: AdmissionStatusValues) {
    if (!selectedId) {
      return;
    }
    setErrorMessage(null);
    try {
      await updateStatus.mutateAsync({ id: selectedId, values });
    } catch (error) {
      setErrorMessage(getApiError(error).message);
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h1>Manage Admissions</h1>
        <button className="button button-secondary" onClick={() => void exportAdmissions()} type="button">
          Export CSV
        </button>
      </div>
      <div className="admin-grid">
        <div className="card surface-card stack">
          {admissions.data?.data.map((item) => (
            <button
              className={`list-row ${selectedId === item._id ? "active" : ""}`}
              key={item._id}
              onClick={() => {
                setSelectedId(item._id);
                form.reset({
                  notes: item.notes || "",
                  status: item.status,
                });
              }}
              type="button"
            >
              <strong>{item.studentName}</strong>
              <span>{item.status}</span>
            </button>
          ))}
        </div>
        <div className="card surface-card form-card">
          {admission.data ? (
            <>
              <h2>{admission.data.studentName}</h2>
              <p>{admission.data.parentName}</p>
              <p>{admission.data.classApplied}</p>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Field error={form.formState.errors.status?.message} label="Status">
                  <select {...form.register("status")}>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="admitted">Admitted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </Field>
                <Field error={form.formState.errors.notes?.message} label="Notes">
                  <textarea rows={5} {...form.register("notes")} />
                </Field>
                {errorMessage ? <FormMessage type="error">{errorMessage}</FormMessage> : null}
                <button className="button button-primary" type="submit">
                  Update Status
                </button>
              </form>
            </>
          ) : (
            <p>Select an admission record to manage it.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const defaultNoticeForm: NoticeFormValues = {
  title: "",
  body: "",
  attachmentUrl: "",
  audience: { kind: "all" },
  tags: "",
  isPublished: false,
};

export function ManageNoticesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const notices = useNotices({ page: 1, includeUnpublished: true });
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice();
  const deleteNotice = useDeleteNotice();
  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: defaultNoticeForm,
  });
  const watchedBody = form.watch("body");
  const audienceKind = form.watch("audience.kind");

  const previewHtml = useMemo(() => DOMPurify.sanitize(watchedBody || ""), [watchedBody]);

  function setAudienceKind(kind: "all" | "role" | "class") {
    if (kind === "all") {
      form.setValue("audience", { kind: "all" });
      return;
    }

    if (kind === "role") {
      form.setValue("audience", { kind: "role", value: "student" });
      return;
    }

    form.setValue("audience", { kind: "class", value: "" });
  }

  function setAudienceRole(value: Role) {
    form.setValue("audience", { kind: "role", value });
  }

  function setAudienceClass(value: string) {
    form.setValue("audience", { kind: "class", value });
  }

  async function onSubmit(values: NoticeFormValues) {
    setErrorMessage(null);
    try {
      if (selectedId) {
        await updateNotice.mutateAsync({ id: selectedId, values });
      } else {
        await createNotice.mutateAsync(values);
      }
      form.reset(defaultNoticeForm);
      setSelectedId(null);
    } catch (error) {
      setErrorMessage(getApiError(error).message);
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h1>Manage Notices</h1>
        <button
          className="button button-secondary"
          onClick={() => {
            setSelectedId(null);
            form.reset(defaultNoticeForm);
          }}
          type="button"
        >
          New Notice
        </button>
      </div>
      <div className="admin-grid">
        <div className="card surface-card stack">
          {notices.data?.data.map((notice) => (
            <button
              className={`list-row ${selectedId === notice._id ? "active" : ""}`}
              key={notice._id}
              onClick={() => {
                setSelectedId(notice._id);
                form.reset({
                  title: notice.title,
                  body: notice.body,
                  attachmentUrl: notice.attachmentUrl || "",
                  audience: notice.audience,
                  tags: notice.tags.join(", "),
                  isPublished: notice.isPublished,
                });
              }}
              type="button"
            >
              <strong>{notice.title}</strong>
              <span>{notice.isPublished ? "Published" : "Draft"}</span>
            </button>
          ))}
        </div>
        <div className="card surface-card form-card">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Field error={form.formState.errors.title?.message} label="Title">
              <input {...form.register("title")} />
            </Field>
            <Field error={form.formState.errors.body?.message} label="Body HTML">
              <textarea rows={8} {...form.register("body")} />
            </Field>
            <Field label="Attachment URL">
              <input {...form.register("attachmentUrl")} />
            </Field>
            <Field label="Audience">
              <select
                value={audienceKind}
                onChange={(event) => {
                  setAudienceKind(event.target.value as "all" | "role" | "class");
                }}
              >
                <option value="all">All</option>
                <option value="role">Role</option>
                <option value="class">Class</option>
              </select>
            </Field>
            {audienceKind === "role" ? (
              <Field label="Role">
                <select
                  value={form.watch("audience.kind") === "role" ? form.watch("audience.value") : ""}
                  onChange={(event) => {
                    setAudienceRole(event.target.value as Role);
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="super_admin">Super admin</option>
                </select>
              </Field>
            ) : null}
            {audienceKind === "class" ? (
              <Field label="Class ID">
                <input
                  value={form.watch("audience.kind") === "class" ? form.watch("audience.value") : ""}
                  onChange={(event) => {
                    setAudienceClass(event.target.value);
                  }}
                />
              </Field>
            ) : null}
            <Field label="Tags (comma separated)">
              <input {...form.register("tags")} />
            </Field>
            <label className="checkbox-row">
              <input type="checkbox" {...form.register("isPublished")} />
              <span>Publish immediately</span>
            </label>
            {errorMessage ? <FormMessage type="error">{errorMessage}</FormMessage> : null}
            <div className="button-row">
              <button className="button button-primary" type="submit">
                {selectedId ? "Update Notice" : "Create Notice"}
              </button>
              {selectedId ? (
                <button
                  className="button button-ghost"
                  onClick={() => {
                    void deleteNotice.mutateAsync(selectedId).then(() => {
                      setSelectedId(null);
                      form.reset(defaultNoticeForm);
                    });
                  }}
                  type="button"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </form>
          <div className="preview-panel">
            <h3>Preview</h3>
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
      </div>
    </div>
  );
}

const defaultAlbumForm: AlbumFormValues = {
  title: "",
  description: "",
  eventDate: "",
  coverImageUrl: "",
  isPublished: true,
};

export function ManageGalleryPage() {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const albums = useAlbums();
  const albumDetail = useAlbum(selectedAlbumId);
  const createAlbum = useCreateAlbum();
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();
  const albumForm = useForm<AlbumFormValues>({
    resolver: zodResolver(albumFormSchema),
    defaultValues: defaultAlbumForm,
  });
  const mediaForm = useForm<MediaUploadValues>({
    resolver: zodResolver(mediaUploadSchema),
    defaultValues: {
      albumId: "",
      caption: "",
      type: "photo",
      file: undefined,
    },
  });

  async function onCreateAlbum(values: AlbumFormValues) {
    setErrorMessage(null);
    try {
      const album = await createAlbum.mutateAsync(values);
      setSelectedAlbumId(album._id);
      mediaForm.setValue("albumId", album._id);
      albumForm.reset(defaultAlbumForm);
    } catch (error) {
      setErrorMessage(getApiError(error).message);
    }
  }

  async function onUploadMedia(values: MediaUploadValues) {
    setErrorMessage(null);
    try {
      await uploadMedia.mutateAsync(values);
      mediaForm.reset({
        albumId: values.albumId,
        caption: "",
        type: "photo",
        file: undefined,
      });
    } catch (error) {
      setErrorMessage(getApiError(error).message);
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h1>Manage Gallery</h1>
        <p>Published albums are visible through the current backend listing endpoint.</p>
      </div>
      <div className="admin-grid">
        <div className="card surface-card stack">
          <h2>Create Album</h2>
          <form onSubmit={albumForm.handleSubmit(onCreateAlbum)}>
            <Field error={albumForm.formState.errors.title?.message} label="Title">
              <input {...albumForm.register("title")} />
            </Field>
            <Field label="Description">
              <textarea rows={4} {...albumForm.register("description")} />
            </Field>
            <Field error={albumForm.formState.errors.eventDate?.message} label="Event date">
              <input type="date" {...albumForm.register("eventDate")} />
            </Field>
            <label className="checkbox-row">
              <input type="checkbox" {...albumForm.register("isPublished")} />
              <span>Publish album</span>
            </label>
            <button className="button button-primary" type="submit">
              Create Album
            </button>
          </form>
          <div className="stack">
            {albums.data?.map((album) => (
              <button
                className={`list-row ${selectedAlbumId === album._id ? "active" : ""}`}
                key={album._id}
                onClick={() => {
                  setSelectedAlbumId(album._id);
                  mediaForm.setValue("albumId", album._id);
                }}
                type="button"
              >
                <strong>{album.title}</strong>
                <span>{new Date(album.eventDate).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="card surface-card stack">
          <h2>Upload Media</h2>
          <form onSubmit={mediaForm.handleSubmit(onUploadMedia)}>
            <Field error={mediaForm.formState.errors.albumId?.message} label="Album ID">
              <input {...mediaForm.register("albumId")} />
            </Field>
            <Field label="Media type">
              <select {...mediaForm.register("type")}>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </Field>
            <Field label="Caption">
              <input {...mediaForm.register("caption")} />
            </Field>
            <Field label="File">
              <input
                type="file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    mediaForm.setValue("file", file);
                  }
                }}
              />
            </Field>
            {errorMessage ? <FormMessage type="error">{errorMessage}</FormMessage> : null}
            <button className="button button-primary" type="submit">
              Upload Media
            </button>
          </form>
          <div className="stack">
            {albumDetail.data?.media.map((item) => (
              <div className="list-row" key={item._id}>
                <div>
                  <strong>{item.caption || item.type}</strong>
                  <span>{item.type}</span>
                </div>
                <button
                  className="button button-ghost"
                  onClick={() => {
                    void deleteMedia.mutateAsync(item._id);
                  }}
                  type="button"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
