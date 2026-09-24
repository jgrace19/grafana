
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { generationHistoryCarouselStyles } from './GenerationHistoryCarousel.stylex';
import { Text, useStyles2 } from '@grafana/ui';

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
      <div {...stylex.props(generationHistoryCarouselStyles.contentWrapper)}>
        <Text element="p" color="secondary">
          {history[index - 1]}
        </Text>
      </div>
      <MinimalisticPagination
        currentPage={index}
        numberOfPages={historySize}
        onNavigate={onNavigate}
        hideWhenSinglePage={false}
        {...stylex.props(generationHistoryCarouselStyles.paginationWrapper)}
      />
    </>
  );
};

