interface AvatarProps {
  initials: string;
  size?: number;
  radius?: string | number;
}

export function Avatar({ initials, size = 36, radius }: AvatarProps) {
  const r = radius ?? (size <= 32 ? '50%' : `${Math.round(size * 0.3)}px`);
  return (
    <div style={{
      width: size, height: size, borderRadius: r, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.floor(size * 0.31), fontWeight: 700, color: 'white',
      background: 'var(--gradient-primary)',
    }}>
      {initials}
    </div>
  );
}
