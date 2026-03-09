import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const variants = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-200 active:scale-95",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200",
  ghost: "hover:bg-accent hover:text-accent-foreground transition-colors",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizes = {
  default: "h-11 px-6 py-2 rounded-xl text-sm font-medium",
  sm: "h-9 rounded-lg px-3 text-xs",
  lg: "h-12 rounded-2xl px-8 text-base",
  icon: "h-10 w-10 rounded-full",
};

export default function Button({
  variant = "default",
  size = "default",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
