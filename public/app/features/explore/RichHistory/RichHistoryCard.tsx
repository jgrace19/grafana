import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import * as React from 'react';
import { connect, type ConnectedProps } from 'react-redux';

import { type DataSourceApi } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { config, reportInteraction, getAppEvents } from '@grafana/runtime';
import { type DataQuery } from '@grafana/schema';
import { TextArea, Button, IconButton } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { createSuccessNotification } from 'app/core/copy/appNotification';
import { notifyApp } from 'app/core/reducers/appNotification';
import { copyStringToClipboard } from 'app/core/utils/explore';
import { createUrlFromRichHistory, createQueryText } from 'app/core/utils/richHistory';
import { createAndCopyShortLink } from 'app/core/utils/shortLinks';
import { changeDatasource } from 'app/features/explore/state/datasource';
import { starHistoryItem, commentHistoryItem, deleteHistoryItem } from 'app/features/explore/state/history';
import { setQueries } from 'app/features/explore/state/query';
import { dispatch } from 'app/store/store';
import { ShowConfirmModalEvent } from 'app/types/events';
import { type RichHistoryQuery } from 'app/types/explore';
import icnDatasourceSvg from 'img/icn-datasource.svg';

import ExploreRunQueryButton from '../ExploreRunQueryButton';

import { RichHistoryAddToLibrary } from './RichHistoryAddToLibrary';

import './RichHistoryCard.css';

const mapDispatchToProps = {
  changeDatasource,
  deleteHistoryItem,
  commentHistoryItem,
  starHistoryItem,
  setQueries,
};

const connector = connect(undefined, mapDispatchToProps);

interface OwnProps<T extends DataQuery = DataQuery> {
  datasourceInstances?: DataSourceApi[];
  queryHistoryItem: RichHistoryQuery<T>;
}

export type Props<T extends DataQuery = DataQuery> = ConnectedProps<typeof connector> & OwnProps<T>;

export function RichHistoryCard(props: Props) {
  const { queryHistoryItem, commentHistoryItem, starHistoryItem, deleteHistoryItem, datasourceInstances } = props;

  const [activeUpdateComment, setActiveUpdateComment] = useState(false);
  const [comment, setComment] = useState<string | undefined>(queryHistoryItem.comment);

  const cardRootDatasource = datasourceInstances
    ? datasourceInstances.find((di) => di.uid === queryHistoryItem.datasourceUid)
    : undefined;

  const onCopyQuery = async () => {
    const datasources = [...queryHistoryItem.queries.map((query) => query.datasource?.type || 'unknown')];
    reportInteraction('grafana_explore_query_history_copy_query', {
      datasources,
      mixed: Boolean(cardRootDatasource?.meta.mixed),
    });

    const queriesText = queryHistoryItem.queries
      .map((query) => {
        let queryDS = datasourceInstances?.find((di) => di.uid === queryHistoryItem.datasourceUid);
        if (queryDS?.meta.mixed) {
          queryDS = datasourceInstances?.find((di) => di.uid === query.datasource?.uid);
        }
        return createQueryText(query, queryDS);
      })
      .join('\n');

    copyStringToClipboard(queriesText);
    dispatch(
      notifyApp(
        createSuccessNotification(t('explore.rich-history-notification.query-copied', 'Query copied to clipboard'))
      )
    );
  };

  const onCreateShortLink = async () => {
    const link = createUrlFromRichHistory(queryHistoryItem);
    await createAndCopyShortLink(link);
  };

  const onDeleteQuery = () => {
    const performDelete = (queryId: string) => {
      deleteHistoryItem(queryId);
      dispatch(
        notifyApp(createSuccessNotification(t('explore.rich-history-notification.query-deleted', 'Query deleted')))
      );
      reportInteraction('grafana_explore_query_history_deleted', {
        queryHistoryEnabled: config.queryHistoryEnabled,
      });
    };

    // For starred queries, we want confirmation. For non-starred, we don't.
    if (queryHistoryItem.starred) {
      getAppEvents().publish(
        new ShowConfirmModalEvent({
          title: t('explore.rich-history-card.delete-query-confirmation-title', 'Delete'),
          text: t(
            'explore.rich-history-card.delete-starred-query-confirmation-text',
            'Are you sure you want to permanently delete your starred query?'
          ),
          yesText: t('explore.rich-history-card.confirm-delete', 'Delete'),
          onConfirm: () => performDelete(queryHistoryItem.id),
        })
      );
    } else {
      performDelete(queryHistoryItem.id);
    }
  };

  const onStarQuery = () => {
    starHistoryItem(queryHistoryItem.id, !queryHistoryItem.starred);
    reportInteraction('grafana_explore_query_history_starred', {
      queryHistoryEnabled: config.queryHistoryEnabled,
      newValue: !queryHistoryItem.starred,
    });
  };

  const toggleActiveUpdateComment = () => setActiveUpdateComment(!activeUpdateComment);

  const onUpdateComment = () => {
    commentHistoryItem(queryHistoryItem.id, comment);
    setActiveUpdateComment(false);
    reportInteraction('grafana_explore_query_history_commented', {
      queryHistoryEnabled: config.queryHistoryEnabled,
    });
  };

  const onCancelUpdateComment = () => {
    setActiveUpdateComment(false);
    setComment(queryHistoryItem.comment);
  };

  const onKeyDown = (keyEvent: React.KeyboardEvent) => {
    if (keyEvent.key === 'Enter' && (keyEvent.shiftKey || keyEvent.ctrlKey)) {
      onUpdateComment();
    }

    if (keyEvent.key === 'Escape') {
      onCancelUpdateComment();
    }
  };

  const updateComment = (
    <div
      {...stylex.props(styles.updateCommentContainer)}
      aria-label={
        comment
          ? t('explore.rich-history-card.update-comment-form', 'Update comment form')
          : t('explore.rich-history-card.add-comment-form', 'Add comment form')
      }
    >
      <TextArea
        onKeyDown={onKeyDown}
        value={comment}
        placeholder={
          comment
            ? undefined
            : t('explore.rich-history-card.optional-description', 'An optional description of what the query does.')
        }
        onChange={(e) => setComment(e.currentTarget.value)}
        className={stylex.props(styles.textArea).className}
      />
      <div>
        <Button onClick={onUpdateComment} className={stylex.props(styles.commentButton).className}>
          <Trans i18nKey="explore.rich-history-card.save-comment">Save comment</Trans>
        </Button>
        <Button
          variant="secondary"
          onClick={onCancelUpdateComment}
          className={stylex.props(styles.commentButton).className}
        >
          <Trans i18nKey="explore.rich-history-card.cancel">Cancel</Trans>
        </Button>
      </div>
    </div>
  );

  const queryActionButtons = (
    <div {...mergeStylexProps(stylex.props(styles.queryActionButtons), { className: 'gf-explore-rich-history-actions' })}>
      <IconButton
        name="comment-alt"
        onClick={toggleActiveUpdateComment}
        tooltip={
          queryHistoryItem.comment?.length > 0
            ? t('explore.rich-history-card.edit-comment-tooltip', 'Edit comment')
            : t('explore.rich-history-card.add-comment-tooltip', 'Add comment')
        }
      />
      <IconButton
        name="copy"
        onClick={onCopyQuery}
        tooltip={t('explore.rich-history-card.copy-query-tooltip', 'Copy query to clipboard')}
      />
      {cardRootDatasource && (
        <IconButton
            name="share-alt"
          onClick={onCreateShortLink}
          tooltip={
            <Trans i18nKey="explore.rich-history-card.copy-shortened-link-tooltip">
              Copy shortened link to clipboard
            </Trans>
          }
        />
      )}
      <IconButton
        name="trash-alt"
        title={t('explore.rich-history-card.delete-query-title', 'Delete query')}
        tooltip={t('explore.rich-history-card.delete-query-tooltip', 'Delete query')}
        onClick={onDeleteQuery}
      />
      <IconButton
        name={queryHistoryItem.starred ? 'favorite' : 'star'}
        iconType={queryHistoryItem.starred ? 'mono' : 'default'}
        onClick={onStarQuery}
        tooltip={
          queryHistoryItem.starred
            ? t('explore.rich-history-card.unstar-query-tooltip', 'Unstar query')
            : t('explore.rich-history-card.star-query-tooltip', 'Star query')
        }
      />
    </div>
  );

  return (
    <div {...stylex.props(styles.queryCard)}>
      <div {...stylex.props(styles.cardRow)}>
        <DatasourceInfo dsApi={cardRootDatasource} size="sm" />

        {queryActionButtons}
      </div>
      <div {...stylex.props(styles.cardRow)}>
        <div {...stylex.props(styles.queryContainer)}>
          {queryHistoryItem?.queries.map((q, i) => {
            const queryDs = datasourceInstances?.find((ds) => ds.uid === q.datasource?.uid);
            return (
              <Query
                query={{ query: q, datasource: queryDs }}
                key={`${q}-${i}`}
                showDsInfo={cardRootDatasource?.meta.mixed}
              />
            );
          })}
          {!activeUpdateComment && queryHistoryItem.comment && (
            <div
              aria-label={t('explore.rich-history-card.query-comment-label', 'Query comment')}
              {...stylex.props(styles.comment)}
            >
              {queryHistoryItem.comment}
            </div>
          )}
          {activeUpdateComment && updateComment}
        </div>
        {!activeUpdateComment && <RichHistoryAddToLibrary query={queryHistoryItem?.queries[0]} />}
        {!activeUpdateComment && (
          <div {...mergeStylexProps(stylex.props(styles.runButton), { className: 'gf-explore-rich-history-run' })}>
            <ExploreRunQueryButton queries={queryHistoryItem.queries} rootDatasourceUid={cardRootDatasource?.uid} />
          </div>
        )}
      </div>
    </div>
  );
}

interface QueryProps {
  query: {
    query: DataQuery;
    datasource?: DataSourceApi;
  };
  /** Show datasource info (icon+name) alongside the query text */
  showDsInfo?: boolean;
}

const Query = ({ query, showDsInfo = false }: QueryProps) => {
  return (
    <div {...stylex.props(styles.queryRow)}>
      {showDsInfo && (
        <div {...stylex.props(styles.dsInfoContainer)}>
          <DatasourceInfo dsApi={query.datasource} size="md" />
          {': '}
        </div>
      )}
      <span
        aria-label={t('explore.rich-history-card.query-text-label', 'Query text')}
        {...stylex.props(styles.queryText)}
      >
        {createQueryText(query.query, query.datasource)}
      </span>
    </div>
  );
};

function DatasourceInfo({ dsApi, size }: { dsApi?: DataSourceApi; size: 'sm' | 'md' }) {
  return (
    <div {...stylex.props(styles.dsInfo, size === 'sm' && styles.dsInfoSmall)}>
      <img
        {...stylex.props(styles.dsInfoImage)}
        src={dsApi?.meta.info.logos.small || icnDatasourceSvg}
        alt={dsApi?.type || t('explore.rich-history-card.datasource-not-exist', 'Data source does not exist anymore')}
        aria-label={t('explore.rich-history-card.datasource-icon-label', 'Data source icon')}
      />
      <div aria-label={t('explore.rich-history-card.datasource-name-label', 'Data source name')}>
        {dsApi?.name || t('explore.rich-history-card.datasource-not-exist', 'Data source does not exist anymore')}
      </div>
    </div>
  );
}

export default connector(RichHistoryCard);

/* Hard-coded value so all buttons and icons on right side of card are aligned */
const rightColumnWidth = '240px';
const rightColumnContentWidth = '170px';

const styles = stylex.create({
  queryCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    marginTop: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: 0,
    marginRight: 0,
    /* If datasource was removed, card will have inactive color */
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
  cardRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: { default: spacing['--gf-spacing-x1'], ':first-of-type': spacing['--gf-spacing-x0-5'] },
    paddingBottom: { default: spacing['--gf-spacing-x1'], ':first-of-type': spacing['--gf-spacing-x0-5'] },
    paddingLeft: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    borderBottomWidth: { default: null, ':first-of-type': '1px' },
    borderBottomStyle: { default: 'none', ':first-of-type': 'solid' },
    borderBottomColor: { default: null, ':first-of-type': colors['--gf-colors-border-weak'] },
  },
  queryActionButtons: {
    maxWidth: rightColumnContentWidth,
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: typography['--gf-typography-size-base'],
  },
  queryContainer: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    width: `calc(100% - ${rightColumnWidth})`,
  },
  updateCommentContainer: {
    width: `calc(100% + ${rightColumnWidth})`,
    marginTop: spacing['--gf-spacing-x1'],
  },
  comment: {
    overflowWrap: 'break-word',
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-regular'],
    marginTop: spacing['--gf-spacing-x0-5'],
  },
  // `.commentButtonRow > *`
  commentButton: {
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1'],
  },
  textArea: {
    width: '100%',
  },
  runButton: {
    maxWidth: rightColumnContentWidth,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  queryRow: {
    borderTopWidth: '1px',
    borderTopStyle: { default: 'solid', ':first-child': 'none' },
    borderTopColor: colors['--gf-colors-border-weak'],
    display: 'flex',
    flexDirection: 'row',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: 0,
    paddingRight: 0,
    gap: spacing['--gf-spacing-x0-5'],
  },
  dsInfoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  queryText: {
    wordBreak: 'break-all',
  },
  dsInfo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: typography['--gf-typography-body-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    whiteSpace: 'nowrap',
  },
  dsInfoSmall: {
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  // `.cardRow img`: every data source icon sits in a card row.
  dsInfoImage: {
    height: typography['--gf-typography-font-size'],
    maxWidth: typography['--gf-typography-font-size'],
    marginRight: spacing['--gf-spacing-x1'],
  },
});
