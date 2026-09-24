import { type Args, type Decorator } from '@storybook/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

interface Props {
  width?: number;
  height?: number;
  showBoundaries: boolean;
}

const StoryContainer = ({ width, height, showBoundaries, children }: React.PropsWithChildren<Props>) => {
  const finalWidth = width ? `${width}px` : '100%';
  const finalHeight = height !== 0 ? `${height}px` : 'auto';
  return (
    <div {...stylex.props(styles.size(finalWidth, finalHeight), showBoundaries && styles.boundaries)}>{children}</div>
  );
};

export const withStoryContainer: Decorator<Args> = (story, { args }) => {
  return (
    <StoryContainer width={args.containerWidth} height={args.containerHeight} showBoundaries={args.showBoundaries}>
      {story()}
    </StoryContainer>
  );
};

const checkColor = '#f0f0f0';

const styles = stylex.create({
  size: (width: string, height: string) => ({
    width,
    height,
  }),
  boundaries: {
    backgroundColor: 'white',
    backgroundSize: '30px 30px',
    backgroundPosition: '0 0, 15px 15px',
    backgroundImage: `linear-gradient(45deg, ${checkColor} 25%, transparent 25%, transparent 75%, ${checkColor} 75%, ${checkColor}), linear-gradient(45deg, ${checkColor} 25%, transparent 25%, transparent 75%, ${checkColor} 75%, ${checkColor})`,
  },
});
