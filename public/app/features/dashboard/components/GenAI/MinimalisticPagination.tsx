import clsx from 'clsx';

import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { minimalisticPaginationStyles } from './MinimalisticPagination.stylex';
import { Trans, t } from '@grafana/i18n';
import { IconButton, useStyles2 } from '@grafana/ui';

export interface MinimalisticPaginationProps {
  currentPage: number;
  numberOfPages: number;
  onNavigate: (toPage: number) => void;
  hideWhenSinglePage?: boolean;
  className?: string;
}

export const MinimalisticPagination = ({
  currentPage,
  numberOfPages,
  onNavigate,
  hideWhenSinglePage,
  className,
}: MinimalisticPaginationProps) => {

  if (hideWhenSinglePage && numberOfPages <= 1) {
    return null;
  }

  return (
    <div {...mergeStylexClassName(stylex.props(minimalisticPaginationStyles.wrapper, , className), undefined)}>
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

