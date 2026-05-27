'use client'

interface Props {
  value: 'now' | 'today' | 'reflection'
  onChange: (v: 'now' | 'today' | 'reflection') => void
}

const tabs = [
  { key: 'now' as const, label: 'Now' },
  { key: 'today' as const, label: 'Today' },
  { key: 'reflection' as const, label: 'Reflection' },
]

export function NavSegmented({ value, onChange }: Props) {
  return (
    <nav className="nav-segmented" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={value === tab.key}
          className={value === tab.key ? 'active' : ''}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
