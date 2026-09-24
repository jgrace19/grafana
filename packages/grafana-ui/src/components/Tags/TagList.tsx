import * as stylex from '@stylexjs/stylex';
import { forwardRef, memo } from 'react';

import { t } from '@grafana/i18n';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { type IconName } from '../../types/icon';
import { type SkeletonComponent, attachSkeleton } from '../../utils/skeleton';

import { type OnTagClick, Tag } from './Tag';

export interface Props {
  /** Maximum number of the tags to display */
  displayMax?: number;
  /** Names of the tags to display */
  tags: string[];
  /** Callback when the tag is clicked */
  onClick?: OnTagClick;
  /** Custom styles for the wrapper component */
  className?: string;
  /** aria-label for the `i`-th Tag component */
  getAriaLabel?: (name: string, i: number) => string;
  //** Should return an index of a color defined in the TAG_COLORS array */
  getColorIndex?: (name: string, i: number) => number;
  /** Icon to show next to tag label */
  icon?: IconName;
  /** @internal first-party StyleX overrides for the wrapper, applied last */
  xstyle?: stylex.StyleXStyles;
}

const TagListComponent = memo(
  forwardRef<HTMLUListElement, Props>(
    ({ displayMax, tags, icon, onClick, className, getAriaLabel, getColorIndex, xstyle }, ref) => {
      const isTruncated = Boolean(displayMax && displayMax > 0);
      const numTags = tags.length;
      const tagsToDisplay = displayMax ? tags.slice(0, displayMax) : tags;
      return (
        <ul
          {...mergeStylexProps(stylex.props(styles.wrapper, isTruncated && styles.wrapperTruncated, xstyle), {
            className,
          })}
          aria-label={t('grafana-ui.tags.list-label', 'Tags')}
          ref={ref}
        >
          {tagsToDisplay.map((tag, i) => (
            <li {...stylex.props(styles.li)} key={tag}>
              <Tag
                name={tag}
                icon={icon}
                onClick={onClick}
                aria-label={getAriaLabel?.(tag, i)}
                data-tag-id={i}
                colorIndex={getColorIndex?.(tag, i)}
              />
            </li>
          ))}
          {displayMax && displayMax > 0 && numTags - displayMax > 0 && (
            <li {...stylex.props(styles.li)}>
              <span {...stylex.props(styles.moreTagsLabel)}>
                {'+ '}
                {numTags - displayMax}
              </span>
            </li>
          )}
        </ul>
      );
    }
  )
);
TagListComponent.displayName = 'TagList';

const TagListSkeleton: SkeletonComponent = ({ rootProps }) => {
  return (
    <div {...stylex.props(styles.skeleton)} {...rootProps}>
      <Tag.Skeleton />
      <Tag.Skeleton />
    </div>
  );
};

/**
 * List of tags with predefined margins and positioning.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-taglist--docs
 */
export const TagList = attachSkeleton(TagListComponent, TagListSkeleton);

const styles = stylex.create({
  skeleton: {
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
  },
  wrapper: {
    position: 'relative',
    alignItems: 'unset',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: '6px',
  },
  wrapperTruncated: {
    alignItems: 'center',
    flexShrink: 0,
  },
  moreTagsLabel: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-size-sm'],
  },
  li: {
    listStyle: 'none',
  },
});
