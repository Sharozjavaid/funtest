import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ src, alt, size = "md" }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  if (!src) {
    return (
      <div
        className={`${sizes[size]} rounded-full bg-paw-pink flex items-center justify-center text-white font-heading font-bold`}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size === "lg" ? 80 : size === "md" ? 48 : 32}
      height={size === "lg" ? 80 : size === "md" ? 48 : 32}
      className={`${sizes[size]} rounded-full object-cover`}
    />
  );
}
