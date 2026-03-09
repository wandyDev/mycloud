import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export default function Card({
  children,
  className,
  title,
  description,
}: CardProps) {
  return (
    <div
      className={clsx("glass rounded-3xl p-8 flex flex-col gap-6", className)}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight gradient-text">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
