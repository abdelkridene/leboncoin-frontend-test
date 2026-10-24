import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/helpers/cn'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export const Button = ({ variant = 'primary', type = 'button', className, ...props }: ButtonProps) => (
  <button type={type} className={cn(styles.button, styles[variant], className)} {...props} />
)
