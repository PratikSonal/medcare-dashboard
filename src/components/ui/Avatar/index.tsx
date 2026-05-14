import type { AvatarProps } from "./types";

export const Avatar = ({ initials, size = 36, radius }: AvatarProps): React.ReactElement => {
  const r = radius ?? (size <= 32 ? "50%" : `${Math.round(size * 0.3)}px`);
  return (
    <div
      className="flex items-center justify-center shrink-0 font-bold text-white bg-gradient-primary"
      style={{
        width: size,
        height: size,
        borderRadius: r,
        fontSize: Math.floor(size * 0.31),
      }}
    >
      {initials}
    </div>
  );
};
