/** Labelled attribute list for the Detecção / Resposta Pier columns. */
export function AttributeColumn({
  title,
  rows,
}: {
  title: string
  rows: ReadonlyArray<readonly [string, string]>
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-amber-500">{title}</h3>
      <dl className="flex flex-col gap-1 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-1">
            <dt className="shrink-0 font-medium text-primary">{label}:</dt>
            <dd className="truncate text-text-muted">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
