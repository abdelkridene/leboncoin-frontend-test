import { cn } from '@/shared/helpers/cn'
import styles from './Skeleton.module.css'

interface SkeletonProps {
  className?: string
  shape?: 'line' | 'circle' | 'block'
}

export const Skeleton = ({ className, shape = 'line' }: SkeletonProps) => (
  <span aria-hidden="true" className={cn(styles.skeleton, styles[shape], className)} />
)
