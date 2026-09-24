
import { emptySearchResultStyleProps } from './EmptySearchResult.stylex'

import type { JSX } from 'react';



export interface Props {
  children: JSX.Element | string;
}

/**
 * @deprecated Use `<EmptyState variant="not-found" />` instead.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-deprecated-emptysearchresult--docs
 */
const EmptySearchResult = ({ children }: Props) => {
  return <div {...emptySearchResultStyleProps('container')}>{children}</div>;
};

;
export { EmptySearchResult };
