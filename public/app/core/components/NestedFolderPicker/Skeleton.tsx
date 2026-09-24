import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import Skeleton from 'react-loading-skeleton';

import { getInputStyles, useTheme2 } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { folderPickerSkeletonStyles } from './Skeleton.stylex';

// This component is used as a fallback for codesplitting, so aim to keep
// the bundle size of it as small as possible :)
export function FolderPickerSkeleton() {
  const theme = useTheme2();
  const baseStyles = getInputStyles({ theme });

  return (
    <div {...mergeStylexClassName(stylex.props(folderPickerSkeletonStyles.wrapper), baseStyles.wrapper)}>
      <div {...mergeStylexClassName(stylex.props(folderPickerSkeletonStyles.inputWrapper), baseStyles.inputWrapper)}>
        <button
          type="button"
          {...mergeStylexClassName(stylex.props(folderPickerSkeletonStyles.fakeInput), baseStyles.input)}
          aria-disabled
        >
          <Skeleton width={100} />
        </button>
      </div>
    </div>
  );
}
