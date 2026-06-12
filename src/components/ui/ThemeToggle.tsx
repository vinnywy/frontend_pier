import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../theme/useTheme'
import { IconButton } from './IconButton'

/** Light/dark switch. The brand pinks turn neon in dark mode (see index.css). */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <IconButton
      label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      <span className="relative block h-6 w-6">
        <Sun
          className={cnTransition(isDark, false)}
          strokeWidth={2}
          aria-hidden="true"
        />
        <Moon
          className={cnTransition(isDark, true)}
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>
    </IconButton>
  )
}

/** Cross-fade + rotate between the two glyphs. */
function cnTransition(isDark: boolean, isMoon: boolean) {
  const visible = isMoon ? isDark : !isDark
  return [
    'absolute inset-0 h-6 w-6 transition-all duration-300',
    visible ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0',
  ].join(' ')
}
