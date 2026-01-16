import { Eye, Trash2 } from "lucide-react";
import { Photo } from "../../types";
import { assetUrl, formatBytes, formatDate } from "../../utils/format";
import { Button } from "../ui/Button";

interface Props {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
}

export function PhotoTable({ photos, onSelect, onDelete }: Props) {
  if (photos.length === 0) {
    return <div className="empty-state">Nenhuma foto aqui ainda.</div>;
  }

  return (
    <div className="glass-panel card table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Tamanho</th>
            <th>Data de aquisição</th>
            <th>Cor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {photos.map((photo) => (
            <tr key={photo.id}>
              <td style={{ width: 70 }}>
                <img
                  src={assetUrl(photo.filePath)}
                  alt={photo.title}
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                  }}
                />
              </td>
              <td>{photo.title}</td>
              <td>{formatBytes(photo.sizeBytes)}</td>
              <td>{formatDate(photo.acquisitionDate)}</td>
              <td>
                {photo.predominantColor ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      className="color-dot"
                      style={{ background: photo.predominantColor }}
                    />
                    <span className="muted">{photo.predominantColor}</span>
                  </span>
                ) : (
                  <span className="muted">-</span>
                )}
              </td>
              <td style={{ display: "flex", gap: 8 }}>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
