import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';

import { BreadcrumbItem } from './BreadcrumbItem';
import { type Breadcrumb } from './types';

export interface Props {
  breadcrumbs: Breadcrumb[];
  className?: string;
}

export function Breadcrumbs({ breadcrumbs, className }: Props) {
  return (
    <nav aria-label={t('navigation.breadcrumbs.aria-label', 'Breadcrumbs')} className={className}>
      <ol {...stylex.props(styles.breadcrumbs)}>
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItem
            {...breadcrumb}
            isCurrent={index === breadcrumbs.length - 1}
            key={index}
            index={index}
            flexGrow={getFlexGrow(index, breadcrumbs.length)}
          />
        ))}
      </ol>
    </nav>
  );
}

function getFlexGrow(index: number, length: number) {
  if (length < 5 && index > 0 && index < length - 2) {
    return 4;
  }

  if (length > 6 && index > 1 && index < length - 3) {
    return 4;
  }

  return 10;
}

const styles = stylex.create({
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
});
