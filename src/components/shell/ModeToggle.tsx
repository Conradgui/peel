'use client'

interface Props {
  value: boolean
  onChange: (v: boolean) => void
}

export function ModeToggle({ value, onChange }: Props) {
  return (
    <div className="mode-toggle-wrapper">
      <span className={`mode-toggle-label ${!value ? 'active' : ''}`}>
        Normal
      </span>
      <div
        className={`toggle-switch ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
        title="Normal ↔ Pomodoro"
        role="switch"
        aria-checked={value}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onChange(!value) }}
      />
      <span className={`mode-toggle-label ${value ? 'active' : ''}`}>
        Pomodoro
      </span>
    </div>
  )
}
