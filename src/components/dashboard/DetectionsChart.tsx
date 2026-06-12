import { useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartRange, DeteccaoBucket } from '../../lib/api/types'
import { useTheme } from '../../theme/useTheme'
import { Card } from '../ui/Card'
import { Segmented } from '../ui/Segmented'

const RANGE_OPTIONS = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'semana', label: 'Semana' },
] as const satisfies ReadonlyArray<{ value: ChartRange; label: string }>

interface DetectionsChartProps {
  data: DeteccaoBucket[]
  range: ChartRange
  onRangeChange: (range: ChartRange) => void
  loading?: boolean
}

/** Detections-over-time bar chart. Mocked data; theme-aware neon styling. */
export function DetectionsChart({
  data,
  range,
  onRangeChange,
  loading,
}: DetectionsChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // The most recent bucket is emphasised; on hover the hovered bar takes over.
  const peakIndex = data.length - 1
  const colors = {
    barStrong: isDark ? '#ff2e7e' : '#ff80a1',
    barSoft: isDark ? '#3a2030' : '#ffd5e0',
    axis: isDark ? '#9ca3af' : '#9aa3af',
    grid: isDark ? '#232834' : '#eef0f3',
  }

  return (
    <Card className="flex h-full flex-col gap-8 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-medium text-text">Detecções</h2>
        <Segmented
          aria-label="Período do gráfico"
          options={RANGE_OPTIONS}
          value={range}
          onChange={onRangeChange}
        />
      </div>

      <div className="h-64 w-full">
        {loading ? (
          <div className="h-full w-full animate-pulse rounded-lg bg-surface-muted" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <defs>
                <linearGradient id="barActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.barStrong} stopOpacity={1} />
                  <stop offset="100%" stopColor={colors.barStrong} stopOpacity={0.65} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.axis, fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.axis, fontSize: 12 }}
                width={40}
              />
              <Tooltip
                cursor={{ fill: isDark ? '#ffffff0d' : '#0000000a' }}
                content={<ChartTooltip />}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                className="chart-glow"
              >
                {data.map((entry, index) => {
                  const emphasised =
                    activeIndex === null
                      ? index === peakIndex
                      : index === activeIndex
                  return (
                    <Cell
                      key={entry.label}
                      fill={emphasised ? 'url(#barActive)' : colors.barSoft}
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}

/** Minimal shape of the props Recharts passes to a custom tooltip `content`. */
interface ChartTooltipProps {
  active?: boolean
  label?: string | number
  payload?: Array<{ value?: number }>
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="text-lg font-semibold text-primary">
        {payload[0].value} detecções
      </p>
    </div>
  )
}
