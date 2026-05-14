import Link from 'next/link';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
};

const variants = {
  primary: 'bg-brand-blue text-white hover:bg-brand-navy',
  secondary: 'bg-brand-navy text-white hover:bg-brand-blue',
  ghost: 'bg-transparent text-brand-navy hover:bg-white',
  outline: 'border border-slate-300 bg-white text-brand-navy hover:border-brand-blue',
};

export function Button({ className, variant = 'primary', href, children, ...props }: ButtonProps) {
  const styles = cn(
    'inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
