import { Plus, RefreshCcw } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Album } from "../types";
import { fetchAlbums, createAlbum } from "../services/albums";
import { Button } from "../components/ui/Button";
import { AlbumCard } from "../components/albums/AlbumCard";
import { Modal } from "../components/ui/Modal";
import {
  AlbumForm,
  AlbumFormValues,
} from "../components/albums/AlbumForm";

export function AlbumListPage() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: albums = [], isLoading } = useQuery<Album[]>({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
  });

  const createMutation = useMutation({
    mutationFn: (data: AlbumFormValues) => createAlbum(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      setOpen(false);
    },
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["albums"] });

  return (
    <div className="page-board">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Meus álbuns de fotos</h2>
          <p className="tagline" style={{ marginTop: 4 }}>
            Organize e acesse todos os seus álbuns em um só lugar.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button variant="ghost" onClick={refresh} icon={<RefreshCcw size={16} />}>
            Atualizar
          </Button>
          <Button
            variant="primary"
            onClick={() => setOpen(true)}
            icon={<Plus size={16} />}
          >
            Criar novo álbum
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="empty-state">Carregando álbuns...</div>
      ) : albums.length === 0 ? (
        <div className="empty-state glass-panel card">
          Nenhum álbum criado ainda. Clique em &quot;Criar novo álbum&quot; para começar.
        </div>
      ) : (
        <div className="grid album-grid">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Criar novo álbum"
        footer={
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            type="button"
          >
            Cancelar
          </Button>
        }
      >
        <AlbumForm
          submitting={createMutation.isPending}
          onSubmit={async (values) => {
            await createMutation.mutateAsync(values);
          }}
        />
      </Modal>
    </div>
  );
}
