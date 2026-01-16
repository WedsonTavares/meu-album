import { Folder, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { Album } from "../../types";
import { assetUrl } from "../../utils/format";

export function AlbumCard({ album }: { album: Album }) {
  const cover = album.photos?.[0];
  const photoCount = album._count?.photos ?? album.photos?.length ?? 0;

  return (
    <Link
      to={`/albums/${album.id}`}
      className="glass-panel card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minHeight: 200,
        borderRadius: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Folder size={16} className="muted" />
        <span className="muted">Álbum #{album.id}</span>
      </div>
      <div style={{ fontSize: 19, fontWeight: 700 }}>{album.title}</div>
      <p className="muted" style={{ flex: 1, margin: 0 }}>
        {album.description}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div className="badge">
          <Image size={16} />
          {photoCount} fotos
        </div>
        {cover ? (
          <div
            style={{
              width: 80,
              height: 50,
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            <img
              src={assetUrl(cover.filePath)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt={cover.title}
            />
          </div>
        ) : (
          <div className="pill">Sem capa ainda</div>
        )}
      </div>
    </Link>
  );
}
