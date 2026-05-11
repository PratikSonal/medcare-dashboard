import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string | number;
}

export function SearchInput({ value, onChange, placeholder = 'Search...', width }: SearchInputProps) {
  return (
    <div style={{ position: 'relative', ...(width ? { width } : { flex: 1 }) }}>
      <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '10px 36px 10px 38px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', transition: 'border-color 200ms ease' }}
        onFocus={e => (e.target.style.borderColor = 'var(--accent-blue)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border-primary)')}
      />
      {value && (
        <button onClick={() => onChange('')}
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: '2px' }}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
