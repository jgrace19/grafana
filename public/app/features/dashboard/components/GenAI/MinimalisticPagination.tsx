import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { IconButton } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';

export interface MinimalisticPaginationProps {
  currentPage: number;
  numberOfPages: number;
  onNavigate: (toPage: number) => void;
  hideWhenSinglePage?: boolean;
  className?: string;
  /** StyleX overrides for the wrapper, applied after its own styles */
  xstyle?: StyleXStyles;
}

export const MinimalisticPagination = ({
  currentPage,
  numberOfPages,
  onNavigate,
  hideWhenSinglePage,
  className,
  xstyle,
}: MinimalisticPaginationProps) => {
  if (hideWhenSinglePage && numberOfPages <= 1) {
    return null;
  }

  return (
    <div {...mergeStylexProps(stylex.props(styles.wrapper, xstyle), { className })}>
      <IconButton
        name="angle-left"
        size="md"
        tooltip={t('dashboard.minimalistic-pagination.tooltip-previous', 'Previous')}
        onClick={() => onNavigate(currentPage - 1)}
        disabled={currentPage === 1}
      />
      <Trans i18nKey="dashboard.minimalistic-pagination.page-count">
        {{ currentPage }} of {{ numberOfPages }}
      </Trans>
      <IconButton
        name="angle-right"
        size="md"
        tooltip={t('dashboard.minimalistic-pagination.tooltip-next', 'Next')}
        onClick={() => onNavigate(currentPage + 1)}
        disabled={currentPage === numberOfPages}
      />
    </div>
  );
};

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    userSelect: 'none',
  },
});
