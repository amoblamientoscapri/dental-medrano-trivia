import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { width: 160, height: 54 },
  md: { width: 240, height: 80 },
  lg: { width: 320, height: 107 },
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  const { width, height } = sizes[size];
  return (
    <Image
      src="/dental-medrano-logo.png"
      alt="Dental Medrano - World Class Dental Solutions"
      width={width}
      height={height}
      priority
      className={className}
    />
  );
}
