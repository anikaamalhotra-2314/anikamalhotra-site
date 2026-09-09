"use client";

type ProjectTileProps = {
  id: string;
  onOpen: (id: string) => void;
  className?: string;
  children: React.ReactNode;
};

const baseClass =
  "cursor-pointer rounded-lg transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 p-2";

export default function ProjectTile({
  id,
  onOpen,
  className = "",
  children,
}: ProjectTileProps) {
  return (
    <div
      id={id}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      onClick={() => onOpen(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(id);
        }
      }}
      className={`${baseClass} ${className}`}
    >
      {children}  
    </div>
  );
}
