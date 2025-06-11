import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../lib/utils'
import { useAccessibility } from '../context/AccessibilityContext'
import { playBeep } from '../lib/sound'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', onClick, ...props }, ref) => {
    const { features } = useAccessibility();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (features['Ativar feedback sonoro']) {
        playBeep(); // default click sound
      }
      if (onClick) onClick(e);
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-white hover:bg-primary/90': variant === 'primary',
            'bg-secondary text-white hover:bg-secondary/90': variant === 'secondary',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button } 