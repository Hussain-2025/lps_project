import { Link, useParams } from "react-router-dom";

import { useAlbum, useAlbums } from "../features/gallery/api";

export function GalleryPage() {
  const albums = useAlbums();

  return (
    <section className="section">
      <div className="container narrow-stack">
        <div className="page-intro">
          <p className="eyebrow">School Gallery</p>
          <h1>Photos, albums, and event snapshots</h1>
          <p className="lead">
            Explore school moments organised through published albums from the backend gallery system.
          </p>
        </div>
        <div className="album-grid">
          {albums.data?.map((album) => (
            <Link className="card album-card" key={album._id} to={`/gallery/${album._id}`}>
              {album.coverImageUrl ? (
                <img alt={album.title} src={album.coverImageUrl} />
              ) : (
                <div className="gallery-placeholder">{album.title}</div>
              )}
              <div>
                <strong>{album.title}</strong>
                <p>{album.description || "School event album"}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GalleryAlbumPage() {
  const { albumId = null } = useParams();
  const album = useAlbum(albumId);

  if (!album.data) {
    return (
      <section className="section">
        <div className="container">
          <div className="card surface-card">Loading album...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container narrow-stack">
        <div className="page-intro">
          <p className="eyebrow">Album</p>
          <h1>{album.data.album.title}</h1>
          <p className="lead">{album.data.album.description || "Published school gallery album"}</p>
        </div>
        <div className="album-grid">
          {album.data.media.map((item) => (
            <article className="card media-card" key={item._id}>
              {item.type === "photo" ? (
                <img alt={item.caption || album.data.album.title} src={item.url} />
              ) : (
                <video controls src={item.url} />
              )}
              {item.caption ? <p>{item.caption}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
