import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { width: 200, height: 67 },
  md: { width: 300, height: 100 },
  lg: { width: 400, height: 134 },
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
