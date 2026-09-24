
import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { paginationStyleProps } from './Pagination.stylex'

import { useMemo, type JSX } from 'react';

import { t } from '@grafana/i18n';

import { Button, type ButtonVariant } from '../Button/Button';
import { Icon } from '../Icon/Icon';

export interface Props {
  /** The current page index being shown. */
  currentPage: number;
  /** Number of total pages. */
  numberOfPages: number;
  /** Callback function for fetching the selected page.  */
  onNavigate: (toPage: number) => void;
  /** When set to true and the pagination result is only one page it will not render the pagination at all. */
  hideWhenSinglePage?: boolean;
  /** Small version only shows the current page and the navigation buttons. */
  showSmallVersion?: boolean;
  className?: string;
  /** If we are using cursor based pagination, disable next page button when we have no cursor */
  hasNextPage?: boolean;
}

/**
 * Component used for rendering a page selector below paginated content.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/navigation-pagination--docs
 */
export const Pagination = ({
  currentPage,
  numberOfPages,
  onNavigate,
  hideWhenSinglePage,
  showSmallVersion,
  className,
  hasNextPage,
}: Props) => {
  const pageLengthToCondense = showSmallVersion ? 1 : 8;

  const pageButtons = useMemo(() => {
    const pages = [...new Array(numberOfPages).keys()];

    const condensePages = numberOfPages > pageLengthToCondense;
    const getListItem = (page: number, variant: 'primary' | 'secondary') => (
      <li key={page} {...paginationStyleProps('item')}>
        <Button size="sm" variant={variant} onClick={() => onNavigate(page)}>
          {page}
        </Button>
      </li>
    );

    return pages.reduce<JSX.Element[]>((pagesToRender, pageIndex) => {
      const page = pageIndex + 1;
      const variant: ButtonVariant = page === currentPage ? 'primary' : 'secondary';

      // The indexes at which to start and stop condensing pages
      const lowerBoundIndex = pageLengthToCondense;
      const upperBoundIndex = numberOfPages - pageLengthToCondense + 1;
      // When the indexes overlap one another this number is negative
      const differenceOfBounds = upperBoundIndex - lowerBoundIndex;

      const isFirstOrLastPage = page === 1 || page === numberOfPages;
      // This handles when the lowerBoundIndex < currentPage < upperBoundIndex
      const currentPageIsBetweenBounds =
        differenceOfBounds > -1 && currentPage >= lowerBoundIndex && currentPage <= upperBoundIndex;

      // Show ellipsis after that many pages
      const ellipsisOffset = showSmallVersion ? 1 : 3;

      // The offset to show more pages when currentPageIsBetweenBounds
      const pageOffset = showSmallVersion ? 0 : 2;

      if (condensePages) {
        if (
          isFirstOrLastPage ||
          (currentPage < lowerBoundIndex && page < lowerBoundIndex) ||
          (differenceOfBounds >= 0 && currentPage > upperBoundIndex && page > upperBoundIndex) ||
          (differenceOfBounds < 0 && currentPage >= lowerBoundIndex && page > upperBoundIndex) ||
          (currentPageIsBetweenBounds && page >= currentPage - pageOffset && page <= currentPage + pageOffset)
        ) {
          // Renders a button for the page
          pagesToRender.push(getListItem(page, variant));
        } else if (
          (page === lowerBoundIndex && currentPage < lowerBoundIndex) ||
          (page === upperBoundIndex && currentPage > upperBoundIndex) ||
          (currentPageIsBetweenBounds &&
            (page === currentPage - ellipsisOffset || page === currentPage + ellipsisOffset))
        ) {
          // Renders and ellipsis to represent condensed pages
          pagesToRender.push(
            <li key={page} {...paginationStyleProps('item')}>
              <Icon {...paginationStyleProps('ellipsis')} name="ellipsis-v" data-testid="pagination-ellipsis-icon" />
            </li>
          );
        }
      } else {
        pagesToRender.push(getListItem(page, variant));
      }
      return pagesToRender;
    }, []);
  }, [currentPage, numberOfPages, onNavigate, pageLengthToCondense, showSmallVersion, paginationStyleProps('ellipsis'), paginationStyleProps('item')]);

  if (hideWhenSinglePage && numberOfPages <= 1) {
    return null;
  }

  const previousPageLabel = t('grafana-ui.pagination.previous-page', 'previous page');
  const nextPageLabel = t('grafana-ui.pagination.next-page', 'next page');

  return (
    <div {...mergeStylexClassName(paginationStyleProps('container'), className)} role="navigation">
      <ol>
        <li {...paginationStyleProps('item')}>
          <Button
            aria-label={previousPageLabel}
            size="sm"
            variant="secondary"
            onClick={() => onNavigate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Icon name="angle-left" />
          </Button>
        </li>
        {pageButtons}
        {pageButtons.length === 0 && <li {...paginationStyleProps('item')}>{currentPage}</li>}
        <li {...paginationStyleProps('item')}>
          <Button
            aria-label={nextPageLabel}
            size="sm"
            variant="secondary"
            onClick={() => onNavigate(currentPage + 1)}
            disabled={hasNextPage === false || currentPage === numberOfPages}
          >
            <Icon name="angle-right" />
          </Button>
        </li>
      </ol>
    </div>
  );
};

;
