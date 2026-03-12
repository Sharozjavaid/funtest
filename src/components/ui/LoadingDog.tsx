"use client";

export function LoadingDog({
  message = "Fetching the good stuff...",
  size = "md",
}: {
  message?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-32",
    md: "w-48",
    lg: "w-64",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`${sizeClasses[size]} rounded-2xl`}
      >
        <source src="/mascot-walking.mp4" type="video/mp4" />
      </video>
      <p className="font-heading text-bark-light text-sm animate-pulse">
        {message}
      </p>
    </div>
  );
}
