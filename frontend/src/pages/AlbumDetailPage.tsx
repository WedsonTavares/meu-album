import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Edit3,
  ImagePlus,
  Trash2,
  Wand2,
} from "lucide-react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Album, Photo, ViewMode } from "../types";
import {
  deleteAlbum,
  deletePhoto,
  fetchAlbum,
  updateAlbum,
  uploadPhotos,
} from "../services/albums";
import { Button } from "../components/ui/Button";
import { ViewToggle } from "../components/ViewToggle";
import { PhotoGrid } from "../components/photos/PhotoGrid";
import { PhotoTable } from "../components/photos/PhotoTable";
import { Modal } from "../components/ui/Modal";
import { PhotoPreview } from "../components/photos/PhotoPreview";
import {
  AlbumForm,
  AlbumFormValues,
} from "../components/albums/AlbumForm";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";

const uploadSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  acquisitionDate: z.string().optional(),
  predominantColor: z.string().optional(),
  files: z
    .any()
    .refine(
      (files) => files instanceof FileList && files.length > 0,
      "Envie ao menos um arquivo",
    ),
});

type UploadValues = z.infer<typeof uploadSchema>;

export function AlbumDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const albumId = Number(params.id);
  const queryClient = useQueryClient();
  const [view, setView] = useState<ViewMode>("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const {
    data: album,
    isLoading,
    error,
  } = useQuery<Album>({
    queryKey: ["album", albumId],
    queryFn: () => fetchAlbum(albumId),
    enabled: Boolean(albumId),
  });

  const updateMutation = useMutation({
    mutationFn: (values: AlbumFormValues) => updateAlbum(albumId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album", albumId] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      setShowEdit(false);
    },
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: () => deleteAlbum(albumId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      navigate("/");
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: number) => deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album", albumId] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (payload: UploadValues) =>
      uploadPhotos(albumId, {
        files: payload.files,
        title: payload.title,
        description: payload.description,
        acquisitionDate: payload.acquisitionDate,
        predominantColor: payload.predominantColor,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album", albumId] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      setShowUpload(false);
    },
  });

  const uploadForm = useForm<UploadValues>({
    resolver: zodResolver(uploadSchema),
  });

  if (!albumId) {
    return <div className="empty-state">Álbum inválido.</div>;
  }

  const handleDeleteAlbum = () => {
    if (
      window.confirm(
        "Deseja remover este álbum? Só é possível quando não há fotos dentro dele.",
      )
    ) {
      deleteAlbumMutation.mutate();
    }
  };

  const handleDeletePhoto = (photo: Photo) => {
    if (window.confirm(`Excluir a foto "${photo.title}"?`)) {
      deletePhotoMutation.mutate(photo.id);
    }
  };

  if (isLoading) {
    return <div className="empty-state">Carregando álbum...</div>;
  }

  if (error) {
    return <div className="empty-state">Não foi possível carregar o álbum.</div>;
  }

  if (!album) {
    return <div className="empty-state">Álbum não encontrado.</div>;
  }

  const photoCount = album.photos?.length ?? 0;

  return (
    <div className="page-board">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link to="/">
            <Button variant="ghost" icon={<ArrowLeft size={16} />}>
              Voltar
            </Button>
          </Link>
          <div className="badge">{photoCount} fotos</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button
            variant="ghost"
            onClick={() => setShowEdit(true)}
            icon={<Edit3 size={16} />}
          >
            Editar álbum
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowUpload(true)}
            icon={<ImagePlus size={16} />}
          >
            Adicionar fotos
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAlbum}
            disabled={photoCount > 0}
            icon={<Trash2 size={16} />}
          >
            Excluir álbum
          </Button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>{album.title}</h2>
          <p className="tagline" style={{ marginTop: 4 }}>
            {album.description}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="badge">
            <Wand2 size={16} /> Visualizar como
          </div>
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      {view === "grid" ? (
        <PhotoGrid
          photos={album.photos || []}
          onSelect={setSelectedPhoto}
          onDelete={handleDeletePhoto}
        />
      ) : (
        <PhotoTable
          photos={album.photos || []}
          onSelect={setSelectedPhoto}
          onDelete={handleDeletePhoto}
        />
      )}

      <PhotoPreview photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />

      <Modal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        title="Adicionar novas fotos"
        footer={
          <Button
            variant="primary"
            onClick={uploadForm.handleSubmit((values) => uploadMutation.mutate(values))}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Enviando..." : "Enviar"}
          </Button>
        }
      >
        <form
          className="stack"
          onSubmit={uploadForm.handleSubmit((values) => uploadMutation.mutate(values))}
        >
          <Input
            label="Título"
            placeholder="Opcional - usa o nome do arquivo por padrão"
            {...uploadForm.register("title")}
          />
          <Textarea
            label="Descrição"
            placeholder="Contextualize a imagem"
            {...uploadForm.register("description")}
          />
          <Input
            label="Data/Hora de aquisição"
            type="datetime-local"
            {...uploadForm.register("acquisitionDate")}
          />
          <Input
            label="Cor predominante"
            type="text"
            placeholder="#00ffc2 (opcional - detectamos automaticamente)"
            {...uploadForm.register("predominantColor")}
          />
          <div className="input-field">
            <label>Arquivos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="input"
              {...uploadForm.register("files")}
            />
            {uploadForm.formState.errors.files && (
              <span className="error">
                {uploadForm.formState.errors.files.message as string}
              </span>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Editar álbum"
      >
        <AlbumForm
          defaultValues={{
            title: album.title,
            description: album.description,
          }}
          submitting={updateMutation.isPending}
          onSubmit={async (values) => {
            await updateMutation.mutateAsync(values);
          }}
        />
      </Modal>
    </div>
  );
}
