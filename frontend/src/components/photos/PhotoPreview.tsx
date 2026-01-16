import React from "react";
import { Photo } from "../../types";
import { assetUrl, formatBytes, formatDate } from "../../utils/format";
import { Modal } from "../ui/Modal";

interface Props {
  photo?: Photo | null;
  onClose: () => void;
}

export function PhotoPreview({ photo, onClose }: Props) {
  if (!photo) return null;

  return (
    <Modal open={Boolean(photo)} onClose={onClose} title={photo.title}>
      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
          <img
            src={assetUrl(photo.filePath)}
            alt={photo.title}
            style={{ width: "100%", maxHeight: 380, objectFit: "cover" }}
          />
        </div>
        <div className="muted">{photo.description || "Sem descrição"}</div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Info label="Data" value={formatDate(photo.acquisitionDate)} />
          <Info label="Tamanho" value={formatBytes(photo.sizeBytes)} />
          <Info
            label="Cor predominante"
            value={
              photo.predominantColor ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    className="color-dot"
                    style={{ background: photo.predominantColor }}
                  />
                  {photo.predominantColor}
                </div>
              ) : (
                "Não identificado"
              )
            }
          />
        </div>
      </div>
    </Modal>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="glass-panel card">
      <div className="muted" style={{ marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}
