import type { ReactNode } from 'react'
import { Typography } from '@hcsneden/design-library'

interface SectionProps {
  id: string
  index: string
  title: string
  intro?: string
  children: ReactNode
}

export const Section = ({ id, index, title, intro, children }: SectionProps) => (
  <section id={id} className="section">
    <div className="shell">
      <div className="section-head">
        <span className="eyebrow">{index}</span>
        <Typography variant="h2">{title}</Typography>
        <span className="rule" />
      </div>
      {intro && (
        <Typography variant="body" className="measure mb-2xl">
          {intro}
        </Typography>
      )}
      {children}
    </div>
  </section>
)
