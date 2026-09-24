import * as stylex from '@stylexjs/stylex';
import { newsStyles } from './News.stylex';

import { useId } from 'react';
import Skeleton from 'react-loading-skeleton';

import { type DataFrameView, type GrafanaTheme2, textUtil, dateTimeFormat } from '@grafana/data';
import { TextLink } from '@grafana/ui';
import { attachSkeleton, type SkeletonComponent } from '@grafana/ui/unstable';

import { type NewsItem } from '../types';

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
    <article aria-labelledby={titleId} className={mergeStylexClassName(stylex.props(newsStyles.item), clsx( useWideLayout && styles.itemWide)}>
      {showImage && newsItem.ogImage && (
        <a
          tabIndex={-1}
          href={textUtil.sanitizeUrl(newsItem.link)}
          target="_blank"
          rel="noopener noreferrer"
          className={mergeStylexClassName(stylex.props(newsStyles.socialImage), clsx( useWideLayout && styles.socialImageWide)}
          aria-hidden
        >
          <img src={newsItem.ogImage} alt={newsItem.title} />
        </a>
      )}
      <div {...stylex.props(newsStyles.body)}>
        <time {...stylex.props(newsStyles.date)} dateTime={dateTimeFormat(newsItem.date, { format: 'MMM DD' })}>
          {dateTimeFormat(newsItem.date, { format: 'MMM DD' })}{' '}
        </time>

        <h1 {...stylex.props(newsStyles.title)} id={titleId}>
          <TextLink href={textUtil.sanitizeUrl(newsItem.link)} external inline={false}>
            {newsItem.title}
          </TextLink>
        </h1>
        <div {...stylex.props(newsStyles.content)} dangerouslySetInnerHTML={{ __html: textUtil.sanitize(newsItem.content) }} />
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
    <div className={mergeStylexClassName(stylex.props(newsStyles.item), clsx( useWideLayout && styles.itemWide)} {...rootProps}>
      {showImage && (
        <Skeleton
          containerClassName={mergeStylexClassName(stylex.props(newsStyles.socialImage), clsx( useWideLayout && styles.socialImageWide)}
          width={useWideLayout ? '250px' : '100%'}
          height={useWideLayout ? '150px' : width * 0.5}
        />
      )}
      <div {...stylex.props(newsStyles.body)}>
        <Skeleton containerClassName={stylex.props(newsStyles.date).className ?? undefined} width={60} />
        <Skeleton containerClassName={stylex.props(newsStyles.title).className ?? undefined} width={250} />
        <Skeleton containerClassName={stylex.props(newsStyles.content).className ?? undefined} width="100%" count={6} />
      </div>
    </div>
  );
};

export const News = attachSkeleton(NewsComponent, NewsSkeleton);

