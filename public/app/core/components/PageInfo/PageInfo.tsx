import * as stylex from '@stylexjs/stylex';
import { Fragment } from 'react';

import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type PageInfoItem } from '../Page/types';

export interface Props {
  info: PageInfoItem[];
}

export function PageInfo({ info }: Props) {
  return (
    <div {...stylex.props(styles.container)}>
      {info.map((infoItem, index) => (
        <Fragment key={index}>
          <div {...stylex.props(styles.infoItem)}>
            <div {...stylex.props(styles.label)}>{infoItem.label}</div>
            {infoItem.value}
          </div>
          {index + 1 < info.length && <div data-testid="page-info-separator" {...stylex.props(styles.separator)} />}
        </Fragment>
      ))}
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: spacing['--gf-spacing-x1-5'],
    overflow: 'auto',
  },

  infoItem: {
    fontFamily: typography['--gf-typography-body-small-font-family'],
    fontWeight: typography['--gf-typography-body-small-font-weight'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    letterSpacing: typography['--gf-typography-body-small-letter-spacing'],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x0-5'],
  },

  label: {
    color: colors['--gf-colors-text-secondary'],
  },

  separator: {
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colors['--gf-colors-border-weak'],
  },
});
