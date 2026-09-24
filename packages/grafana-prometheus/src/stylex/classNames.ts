import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';

type StyleXStyles = stylex.StyleXStyles;

/** Map static stylex.create keys to className strings (for legacy className-only APIs). */
export function stylexClassNames<T extends Record<string, StyleXStyles>>(styles: T): { [K in keyof T]: string } {
  const out = {} as { [K in keyof T]: string };
  for (const key of Object.keys(styles) as Array<keyof T>) {
    out[key] = stylex.props(styles[key]).className ?? '';
  }
  return out;
}

/** Merge multiple stylex class strings (replaces emotion `cx`). */
export function stylexClassNamesCx(...classNames: Array<string | false | null | undefined>): string {
  return clsx(classNames);
}
