import React from 'react';
import clsx from 'clsx';

export type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'lead' | 'body' | 'small' | 'caption';

type TypographyOwnProps = {
  variant?: Variant;
  weight?: 'thin' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  lineClamp?: number;
  uppercase?: boolean;
  className?: string;
};

type AsProp<T extends React.ElementType> = {
  as?: T;
};

type PolymorphicTypographyProps<T extends React.ElementType> = TypographyOwnProps &
  AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof TypographyOwnProps | 'as'>;

const VARIANT_MAP: Record<Variant, string> = {
  h1: 'text-4xl md:text-5xl font-extrabold leading-tight',
  h2: 'text-3xl md:text-4xl font-bold leading-tight',
  h3: 'text-2xl md:text-3xl font-semibold leading-tight',
  h4: 'text-xl md:text-2xl font-semibold',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium',
  lead: 'text-lg md:text-xl',
  body: 'text-base',
  small: 'text-sm',
  caption: 'text-xs',
};

const WEIGHT_MAP: Record<NonNullable<TypographyOwnProps['weight']>, string> = {
  thin: 'font-thin',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

export function Typography<T extends React.ElementType = 'p'>({
  variant = 'body',
  as,
  className,
  weight,
  align = 'left',
  truncate = false,
  lineClamp,
  uppercase = false,
  children,
  ...rest
}: PolymorphicTypographyProps<T>) {
  const Component = as || 'p';

  const base = VARIANT_MAP[variant];
  const weightClass = weight ? WEIGHT_MAP[weight] : undefined;
  const alignClass =
    align === 'left'
      ? 'text-left'
      : align === 'center'
        ? 'text-center'
        : align === 'right'
          ? 'text-right'
          : 'text-justify';

  const lineClampClass = lineClamp && lineClamp > 0 ? `line-clamp-${lineClamp}` : undefined;

  const classes = clsx(
    base,
    weightClass,
    alignClass,
    uppercase && 'uppercase tracking-wide',
    truncate && 'truncate',
    lineClampClass,
    className,
  );

  return (
    <Component
      className={classes}
      {...rest}
    >
      {children}
    </Component>
  );
}
