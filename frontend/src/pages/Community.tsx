import DOMPurify from "dompurify";
import { Link, useParams } from "react-router-dom";

import { useNotice, useNotices } from "../features/notices/api";

export function CommunityPage() {
  const notices = useNotices({ page: 1, includeUnpublished: false });

  return (
    <section className="section">
      <div className="container narrow-stack">
        <div className="page-intro">
          <p className="eyebrow">Community & Notices</p>
          <h1>Circulars, announcements, and school communication</h1>
          <p className="lead">
            Public notices are pulled directly from the backend and presented in a cleaner, school-friendly reading format.
          </p>
        </div>
        <div className="stack">
          {notices.data?.data.map((notice) => (
            <Link className="card notice-card reading-card" key={notice._id} to={`/notices/${notice._id}`}>
              <strong>{notice.title}</strong>
              <span>{notice.tags.join(", ") || "General notice"}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NoticeDetailPage() {
  const { id = null } = useParams();
  const notice = useNotice(id);

  if (!notice.data) {
    return (
      <section className="section">
        <div className="container">
          <div className="card surface-card">Loading notice...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container narrow-stack">
        <div className="page-intro">
          <p className="eyebrow">School Notice</p>
          <h1>{notice.data.title}</h1>
          <p className="lead">{notice.data.tags.join(", ") || "General circular"}</p>
        </div>
        <article className="card surface-card reading-card">
          <div
            className="notice-html"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(notice.data.body),
            }}
          />
          {notice.data.attachmentUrl ? (
            <a
              className="button button-secondary"
              href={notice.data.attachmentUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open Attachment
            </a>
          ) : null}
        </article>
      </div>
    </section>
  );
}
