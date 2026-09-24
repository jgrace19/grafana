import { type JSX } from 'react';

export function InjectGlobalCss({ cssText }: { cssText: string }): JSX.Element | null {
  if (!cssText) {
    return null;
  }
  return <style dangerouslySetInnerHTML={{ __html: cssText }} />;
}
