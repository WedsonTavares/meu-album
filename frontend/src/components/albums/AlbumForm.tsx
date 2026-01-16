import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

const albumSchema = z.object({
  title: z.string().min(3, "Título precisa ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(5, "Descreva o álbum em pelo menos 5 caracteres"),
});

export type AlbumFormValues = z.infer<typeof albumSchema>;

interface Props {
  defaultValues?: Partial<AlbumFormValues>;
  onSubmit: (values: AlbumFormValues) => Promise<void> | void;
  submitting?: boolean;
}

export function AlbumForm({ defaultValues, onSubmit, submitting }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues,
  });

  return (
    <form
      className="stack"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <Input
        label="Título"
        placeholder="Ex: Aniversário 2025"
        error={errors.title?.message}
        required
        {...register("title")}
      />
      <Textarea
        label="Descrição"
        placeholder="Conte rapidamente o contexto do álbum"
        error={errors.description?.message}
        required
        rows={3}
        {...register("description")}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
