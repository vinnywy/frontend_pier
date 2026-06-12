import { useState } from 'react'
import { CarFront } from 'lucide-react'
import { imageUrl } from '../../lib/api/client'
import { cn } from '../../lib/cn'

interface VehicleImageProps {
  path: string
  alt: string
  /** Override the default size (e.g. larger on the alerts cards). */
  className?: string
}

/** Detection snapshot with a graceful fallback when the image can't load. */
export function VehicleImage({ path, alt, className }: VehicleImageProps) {
  const [failed, setFailed] = useState(false)
  const src = imageUrl(path)
  const base = cn('shrink-0 rounded-lg', className ?? 'h-[130px] w-[173px]')

  if (!src || failed) {
    return (
      <div
        className={cn(
          base,
          'flex items-center justify-center bg-surface-muted text-text-muted',
        )}
      >
        <CarFront className="h-10 w-10" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn(base, 'object-cover')}
    />
  )
}
