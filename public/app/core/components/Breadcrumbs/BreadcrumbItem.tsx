import * as stylex from '@stylexjs/stylex';

import { Components } from '@grafana/e2e-selectors';
import { reportInteraction } from '@grafana/runtime';
import { Icon } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
    <li {...stylex.props(styles.breadcrumbWrapper)} style={{ flexGrow }}>
      {isCurrent ? (
        <span
          data-testid={Components.Breadcrumbs.breadcrumb(text)}
          {...stylex.props(styles.breadcrumb)}
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
            {...stylex.props(styles.breadcrumb, styles.breadcrumbLink)}
            title={text}
            href={href}
          >
            {text}
          </a>
          <div {...stylex.props(styles.separator)} aria-hidden={true}>
            <Icon name="angle-right" />
          </div>
        </>
      )}
    </li>
  );
}

const styles = stylex.create({
  breadcrumb: {
    display: 'block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: colors['--gf-colors-text-secondary'],
  },

  breadcrumbLink: {
    color: colors['--gf-colors-text-primary'],

    textDecoration: {
      default: null,
      ':hover': 'underline',
    },
  },

  breadcrumbWrapper: {
    alignItems: 'center',
    color: colors['--gf-colors-text-primary'],

    // on small screens hide any breadcrumbs that aren't the second to last child (the parent)
    // unless there's only one breadcrumb, in which case we show it
    display: {
      default: 'flex',
      [bp.smDown]: { default: 'none', ':nth-last-child(2)': 'flex', ':last-child': 'flex' },
    },
    flex: '1',
    gap: spacing['--gf-spacing-x0-5'],
    minWidth: { default: 0, [bp.smDown]: { default: 0, ':nth-last-child(2)': '40px' } },
    maxWidth: 'max-content',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },

  separator: {
    color: colors['--gf-colors-text-secondary'],
  },
});
