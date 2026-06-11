import { css } from '@emotion/css';
import { useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Drawer, useStyles2, Stack, Button, FilterInput, RadioButtonGroup, Spinner } from '@grafana/ui';

import { useGetCommentsQuery } from '../api/dashboardCommentsApi';

import { CommentEditor } from './CommentEditor';
import { CommentThread } from './CommentThread';

interface CommentsSidebarProps {
  dashboardUid: string;
  currentUserId: number;
  isOpen: boolean;
  onClose: () => void;
}

type FilterStatus = 'all' | 'open' | 'resolved';

const filterOptions = [
  { label: 'All', value: 'all' as FilterStatus },
  { label: 'Open', value: 'open' as FilterStatus },
  { label: 'Resolved', value: 'resolved' as FilterStatus },
];

export function CommentsSidebar({ dashboardUid, currentUserId, isOpen, onClose }: CommentsSidebarProps) {
  const styles = useStyles2(getStyles);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewComment, setShowNewComment] = useState(false);

  const resolvedFilter = filterStatus === 'all' ? undefined : filterStatus === 'resolved';

  const { data: comments, isLoading, error } = useGetCommentsQuery(
    {
      dashboardUid,
      resolved: resolvedFilter,
      includeReplies: true,
      limit: 100,
    },
    { skip: !isOpen }
  );

  const filteredComments = comments?.filter((comment) => {
    if (!searchQuery) {
      return true;
    }
    const query = searchQuery.toLowerCase();
    return (
      comment.content.toLowerCase().includes(query) ||
      comment.userName?.toLowerCase().includes(query) ||
      comment.userLogin.toLowerCase().includes(query)
    );
  });

  if (!isOpen) {
    return null;
  }

  return (
    <Drawer title="Comments" onClose={onClose} size="md">
      <div className={styles.container}>
        <div className={styles.header}>
          <Stack direction="column" gap={1}>
            <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between">
              <RadioButtonGroup
                options={filterOptions}
                value={filterStatus}
                onChange={setFilterStatus}
                size="sm"
              />
              <Button
                variant="primary"
                size="sm"
                icon="plus"
                onClick={() => setShowNewComment(!showNewComment)}
              >
                New
              </Button>
            </Stack>
            <FilterInput
              placeholder="Search comments..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </Stack>
        </div>

        {showNewComment && (
          <div className={styles.newComment}>
            <CommentEditor
              dashboardUid={dashboardUid}
              onSuccess={() => setShowNewComment(false)}
              onCancel={() => setShowNewComment(false)}
            />
          </div>
        )}

        <div className={styles.content}>
          {isLoading && (
            <div className={styles.loading}>
              <Spinner />
              <span>Loading comments...</span>
            </div>
          )}

          {error != null && (
            <div className={styles.error}>
              Failed to load comments. Please try again.
            </div>
          )}

          {!isLoading && !error && filteredComments?.length === 0 && (
            <div className={styles.empty}>
              {searchQuery ? 'No comments match your search.' : 'No comments yet. Be the first to add one!'}
            </div>
          )}

          {filteredComments?.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              dashboardUid={dashboardUid}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </div>
    </Drawer>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  }),
  header: css({
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.colors.border.weak}`,
  }),
  newComment: css({
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.colors.border.weak}`,
  }),
  content: css({
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  }),
  loading: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(4),
    color: theme.colors.text.secondary,
  }),
  error: css({
    padding: theme.spacing(2),
    color: theme.colors.error.text,
    backgroundColor: theme.colors.error.transparent,
    borderRadius: theme.shape.radius.default,
    textAlign: 'center',
  }),
  empty: css({
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.colors.text.secondary,
  }),
});
