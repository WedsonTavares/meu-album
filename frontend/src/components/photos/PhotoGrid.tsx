import { Eye, Trash2 } from "lucide-react";
import { Photo } from "../../types";
import { assetUrl, formatBytes, formatDate } from "../../utils/format";
import { Button } from "../ui/Button";

interface Props {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
}

export function PhotoGrid({ photos, onSelect, onDelete }: Props) {
  if (photos.length === 0) {
    return <div className="empty-state">Nenhuma foto aqui ainda.</div>;
  }

  return (
    <div className="grid album-grid">
      {photos.map((photo) => (
        <div key={photo.id} className="glass-panel card" style={{ gap: 12 }}>
          <div
            style={{
              height: 140,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            <img
              src={assetUrl(photo.filePath)}
              alt={photo.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="badge">{formatBytes(photo.sizeBytes)}</div>
            {photo.predominantColor && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  className="color-dot"
                  style={{ background: photo.predominantColor }}
                />
                <span className="muted" style={{ fontSize: 13 }}>
                  {photo.predominantColor}
                </span>
              </div>
            )}
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{photo.title}</div>
          <p className="muted" style={{ margin: 0 }}>
            {photo.description || "Sem descrição"}
          </p>
          <div className="muted" style={{ fontSize: 13 }}>
            {formatDate(photo.acquisitionDate)}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button
              variant="ghost"
              onClick={() => onSelect(photo)}
              icon={<Eye size={16} />}
            >
              Abrir
            </Button>
            <Button
              variant="danger"
              onClick={() => onDelete(photo)}
              icon={<Trash2 size={16} />}
            >
              Excluir
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
