import * as stylex from '@stylexjs/stylex';
import Skeleton from 'react-loading-skeleton';

import { useTheme2 } from '@grafana/ui';
import { inputBorderStyles, inputStyles } from '@grafana/ui/internal';

// This component is used as a fallback for codesplitting, so aim to keep
// the bundle size of it as small as possible :)
export function FolderPickerSkeleton() {
  const theme = useTheme2();

  return (
    <div {...stylex.props(inputStyles.wrapper)}>
      <div {...stylex.props(inputStyles.inputWrapper)}>
        <button
          type="button"
          {...stylex.props(inputStyles.input, inputBorderStyles[theme.isDark ? 'dark' : 'light'], styles.fakeInput)}
          aria-disabled
        >
          <Skeleton width={100} />
        </button>
      </div>
    </div>
  );
}

const styles = stylex.create({
  fakeInput: {
    textAlign: 'left',
  },
});
