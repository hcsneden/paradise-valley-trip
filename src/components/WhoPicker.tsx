import { members } from '../data/trip'

interface WhoPickerProps {
  value: string
  onChange: (name: string) => void
  label: string
}

export const WhoPicker = ({ value, onChange, label }: WhoPickerProps) => (
  <select
    className="who-picker"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    aria-label={label}
  >
    {members.map((member) => (
      <option key={member.name} value={member.name}>
        {label} {member.name}
      </option>
    ))}
  </select>
)
