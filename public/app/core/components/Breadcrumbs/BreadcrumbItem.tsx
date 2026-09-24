import { mergeStylexClassName } from '@grafana/ui/unstable';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { Components } from '@grafana/e2e-selectors';
import { reportInteraction } from '@grafana/runtime';
import { Icon } from '@grafana/ui';

import { breadcrumbItemStyles } from './BreadcrumbItem.stylex';

import { type Breadcrumb } from './types';

type Props = Breadcrumb & {
  isCurrent: boolean;
  index: number;
  flexGrow: number;
};

export function BreadcrumbItem({ href, isCurrent, text, index, flexGrow }: Props) {

  const onBreadcrumbClick = () => {
    reportInteraction('grafana_breadcrumb_clicked', { url: href });
  };

  return (
    <li {...stylex.props(breadcrumbItemStyles.breadcrumbWrapper)} style={{ flexGrow }}>
      {isCurrent ? (
        <span
          data-testid={Components.Breadcrumbs.breadcrumb(text)}
          {...stylex.props(breadcrumbItemStyles.breadcrumb)}
          aria-current="page"
          title={text}
        >
          {text}
        </span>
      ) : (
        <>
          <a
            onClick={onBreadcrumbClick}
            data-testid={Components.Breadcrumbs.breadcrumb(text)}
            {...mergeStylexClassName(stylex.props(breadcrumbItemStyles.breadcrumb, breadcrumbItemStyles.breadcrumbLink), undefined)}
            title={text}
            href={href}
          >
            {text}
          </a>
          <div {...stylex.props(breadcrumbItemStyles.separator)} aria-hidden={true}>
            <Icon name="angle-right" />
          </div>
        </>
      )}
    </li>
  );
}

