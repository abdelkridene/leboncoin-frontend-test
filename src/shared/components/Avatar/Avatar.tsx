import { cn } from '@/shared/helpers/cn'
import styles from './Avatar.module.css'

const COLOR_COUNT = 5

const getInitial = (name: string) => name.trim().charAt(0).toLocaleUpperCase('fr-FR') || '?'

const getColorIndex = (name: string) =>
  (Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0) % COLOR_COUNT) + 1

interface AvatarProps {
  name: string
}

export const Avatar = ({ name }: AvatarProps) => (
  <span aria-hidden="true" className={cn(styles.avatar, styles[`color${getColorIndex(name)}`])}>
    {getInitial(name)}
  </span>
)
