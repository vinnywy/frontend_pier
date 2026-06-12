import type { LucideIcon } from 'lucide-react'
import { PageHeader } from './PageHeader'
import { Card } from '../ui/Card'

interface PlaceholderPageProps {
  title: string
  icon: LucideIcon
  description: string
}

/** Stand-in for routes that exist in the nav but aren't built yet. */
export function PlaceholderPage({
  title,
  icon: Icon,
  description,
}: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} />
      <Card className="flex flex-col items-center justify-center gap-4 p-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-primary">
          <Icon className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <p className="max-w-md text-text-muted">{description}</p>
      </Card>
    </>
  )
}
