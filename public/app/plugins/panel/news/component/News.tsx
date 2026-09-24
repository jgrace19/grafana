import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';
import Skeleton from 'react-loading-skeleton';

import { type DataFrameView, textUtil, dateTimeFormat } from '@grafana/data';
import { TextLink } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { attachSkeleton, type SkeletonComponent } from '@grafana/ui/unstable';

import { type NewsItem } from '../types';

import './News.css';

interface NewsItemProps {
  width: number;
  showImage?: boolean;
  index: number;
  data: DataFrameView<NewsItem>;
}

function NewsComponent({ width, showImage, data, index }: NewsItemProps) {
  const titleId = useId();
  const useWideLayout = width > 600;
  const newsItem = data.get(index);

  return (
    <article aria-labelledby={titleId} {...stylex.props(styles.item, useWideLayout && styles.itemWide)}>
      {showImage && newsItem.ogImage && (
        <a
          tabIndex={-1}
          href={textUtil.sanitizeUrl(newsItem.link)}
          target="_blank"
          rel="noopener noreferrer"
          {...stylex.props(styles.socialImage, useWideLayout && styles.socialImageWide)}
          aria-hidden
        >
          <img
            src={newsItem.ogImage}
            alt={newsItem.title}
            {...stylex.props(styles.socialImageImg, useWideLayout && styles.socialImageWideImg)}
          />
        </a>
      )}
      <div {...stylex.props(styles.body)}>
        <time {...stylex.props(styles.date)} dateTime={dateTimeFormat(newsItem.date, { format: 'MMM DD' })}>
          {dateTimeFormat(newsItem.date, { format: 'MMM DD' })}{' '}
        </time>

        <h1 {...stylex.props(styles.title)} id={titleId}>
          <TextLink href={textUtil.sanitizeUrl(newsItem.link)} external inline={false}>
            {newsItem.title}
          </TextLink>
        </h1>
        <div className="gf-news-content" dangerouslySetInnerHTML={{ __html: textUtil.sanitize(newsItem.content) }} />
      </div>
    </article>
  );
}

const NewsSkeleton: SkeletonComponent<Pick<NewsItemProps, 'width' | 'showImage'>> = ({
  width,
  showImage,
  rootProps,
}) => {
  const useWideLayout = width > 600;

  return (
    <div {...stylex.props(styles.item, useWideLayout && styles.itemWide)} {...rootProps}>
      {showImage && (
        <Skeleton
          containerClassName={stylex.props(styles.socialImage, useWideLayout && styles.socialImageWide).className}
          width={useWideLayout ? '250px' : '100%'}
          height={useWideLayout ? '150px' : width * 0.5}
        />
      )}
      <div {...stylex.props(styles.body)}>
        <Skeleton containerClassName={stylex.props(styles.date).className} width={60} />
        <Skeleton containerClassName={stylex.props(styles.title).className} width={250} />
        <Skeleton containerClassName="gf-news-content" width="100%" count={6} />
      </div>
    </div>
  );
};

export const News = attachSkeleton(NewsComponent, NewsSkeleton);

const styles = stylex.create({
  item: {
    display: 'flex',
    padding: spacing['--gf-spacing-x1'],
    position: 'relative',
    marginBottom: spacing['--gf-spacing-x0-5'],
    marginRight: spacing['--gf-spacing-x1'],
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    backgroundColor: colors['--gf-colors-background-primary'],
    flexDirection: 'column',
    flexShrink: 0,
  },
  itemWide: {
    flexDirection: 'row',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  socialImage: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing['--gf-spacing-x1'],
  },
  socialImageImg: {
    width: '100%',
    borderTopLeftRadius: shape['--gf-shape-radius-default'],
    borderTopRightRadius: shape['--gf-shape-radius-default'],
    borderBottomRightRadius: 'unset',
    borderBottomLeftRadius: 'unset',
  },
  socialImageWide: {
    marginRight: spacing['--gf-spacing-x2'],
    marginBottom: 0,
  },
  socialImageWideImg: {
    width: '250px',
    borderTopLeftRadius: shape['--gf-shape-radius-default'],
    borderTopRightRadius: shape['--gf-shape-radius-default'],
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
  },
  title: {
    fontFamily: typography['--gf-typography-h3-font-family'],
    fontWeight: typography['--gf-typography-h3-font-weight'],
    lineHeight: typography['--gf-typography-h3-line-height'],
    letterSpacing: typography['--gf-typography-h3-letter-spacing'],
    fontSize: '16px',
    marginBottom: spacing['--gf-spacing-x0-5'],
  },
  date: {
    marginBottom: spacing['--gf-spacing-x0-5'],
    fontWeight: 500,
    borderTopLeftRadius: 'unset',
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: 'unset',
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
    color: colors['--gf-colors-text-secondary'],
  },
});
