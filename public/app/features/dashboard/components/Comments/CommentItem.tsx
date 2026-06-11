import { css } from '@emotion/css';
import { useMemo } from 'react';

import { type GrafanaTheme2, renderMarkdown } from '@grafana/data';
import { Button, Stack, Text, useStyles2 } from '@grafana/ui';

import { type DashboardCommentDTO } from '../../api/commentsApi';

export interface Props {
  comment: DashboardCommentDTO;
  replies: DashboardCommentDTO[];
  onReply: (parentId: number) => void;
  onDelete: (id: number) => void;
  canDelete: (comment: DashboardCommentDTO) => boolean;
  depth?: number;
}

export function CommentItem(props: Props) {
  const { comment, replies, onReply, onDelete, canDelete, depth = 0 } = props;
  const styles = useStyles2(getStyles);

  const html = useMemo(() => renderMarkdown(comment.content), [comment.content]);
  const showReply = depth === 0;

  return (
    <div className={styles.row} style={{ marginLeft: depth * 16 }}>
      <Stack direction="column" gap={0.5}>
        <Text variant="bodySmall" color="secondary">
          User {comment.userId} · {new Date(comment.created).toLocaleString()}
        </Text>
        <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} />
        <Stack gap={1}>
          {showReply && (
            <Button fill="text" size="sm" onClick={() => onReply(comment.id)}>
              Reply
            </Button>
          )}
          {canDelete(comment) && (
            <Button fill="text" size="sm" variant="destructive" onClick={() => onDelete(comment.id)}>
              Delete
            </Button>
          )}
        </Stack>
        {replies.map((r) => (
          <CommentItem
            key={r.id}
            comment={r}
            replies={[]}
            onReply={onReply}
            onDelete={onDelete}
            canDelete={canDelete}
            depth={depth + 1}
          />
        ))}
      </Stack>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  row: css({
    paddingBottom: theme.spacing(2),
  }),
  body: css({
    '& p': { margin: 0 },
  }),
});
