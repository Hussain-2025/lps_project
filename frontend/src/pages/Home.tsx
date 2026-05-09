import { Link } from "react-router-dom";

import { useAlbums } from "../features/gallery/api";
import { useNotices } from "../features/notices/api";

export function HomePage() {
  const notices = useNotices({ page: 1, includeUnpublished: false });
  const albums = useAlbums();
  const hasData = (notices.data?.data?.length ?? 0) > 0 || (albums.data?.length ?? 0) > 0;

  return (
    <div>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Est. 1966 · CBSE Affiliated</p>
            <h1>School life, admissions, and updates in one modern academic portal.</h1>
            <p className="lead">
              RPM Lovely Public Senior Secondary School now has a cleaner digital front door
              for families, students, and the wider school community.
            </p>
            <div className="button-row">
              <Link className="button button-primary" to="/admission">
                Apply Now
              </Link>
              <Link className="button button-secondary" to="/contact">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hero-crest-panel">
            <img alt="School crest" src="/lpsnlp-logo.svg" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stats-grid">
          <article className="card surface-card">
            <strong>1966</strong>
            <span>Year established</span>
          </article>
          <article className="card surface-card">
            <strong>CBSE</strong>
            <span>Academic affiliation</span>
          </article>
          <article className="card surface-card">
            <strong>Responsive</strong>
            <span>Admissions and community info</span>
          </article>
        </div>
      </section>

      {hasData || notices.isLoading || albums.isLoading ? (
        <section className="section">
          <div className="container two-column">
            <div>
              <h2>Latest notices</h2>
              <div className="stack">
                {notices.isLoading && <p>Loading notices...</p>}
                {notices.isError && <p style={{ color: "#999" }}>Unable to load notices</p>}
                {notices.data?.data?.slice(0, 3).map((notice) => (
                  <Link className="card notice-card" key={notice._id} to={`/notices/${notice._id}`}>
                    <strong>{notice.title}</strong>
                    <span>{notice.tags.join(", ") || "General notice"}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2>Featured gallery</h2>
              <div className="gallery-preview-grid">
                {albums.isLoading && <p>Loading gallery...</p>}
                {albums.isError && <p style={{ color: "#999" }}>Unable to load gallery</p>}
                {albums.data?.slice(0, 4).map((album) => (
                  <Link className="gallery-tile" key={album._id} to={`/gallery/${album._id}`}>
                    {album.coverImageUrl ? (
                      <img alt={album.title} src={album.coverImageUrl} />
                    ) : (
                      <div className="gallery-placeholder">{album.title}</div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
