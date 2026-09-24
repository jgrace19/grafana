import * as stylex from '@stylexjs/stylex';

import { Text } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { MinimalisticPagination } from './MinimalisticPagination';

export interface GenerationHistoryCarouselProps {
  history: string[];
  index: number;
  onNavigate: (index: number) => void;
}

export const GenerationHistoryCarousel = ({ history, index, onNavigate }: GenerationHistoryCarouselProps) => {
  const historySize = history.length;

  return (
    <>
      <div {...stylex.props(styles.contentWrapper)}>
        <Text element="p" color="secondary">
          {history[index - 1]}
        </Text>
      </div>
      <MinimalisticPagination
        currentPage={index}
        numberOfPages={historySize}
        onNavigate={onNavigate}
        hideWhenSinglePage={false}
        xstyle={styles.paginationWrapper}
      />
    </>
  );
};

const styles = stylex.create({
  paginationWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  contentWrapper: {
    display: 'flex',
    flexBasis: '100%',
    flexGrow: 3,
    whiteSpace: 'pre-wrap',
    maxHeight: 110,
    overflowY: 'scroll',
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    padding: spacing['--gf-spacing-x1'],
    minHeight: 60,
  },
});
