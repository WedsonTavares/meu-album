import { LayoutGrid, Rows3 } from "lucide-react";
import { ViewMode } from "../types";

interface Props {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div className="switcher">
      <button
        className={value === "grid" ? "active" : ""}
        onClick={() => onChange("grid")}
        type="button"
      >
        <LayoutGrid size={16} /> Miniaturas
      </button>
      <button
        className={value === "table" ? "active" : ""}
        onClick={() => onChange("table")}
        type="button"
      >
        <Rows3 size={16} /> Tabela
      </button>
    </div>
  );
}
