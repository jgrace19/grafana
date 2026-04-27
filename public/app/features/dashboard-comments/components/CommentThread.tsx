import { css } from '@emotion/css';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Button, Icon, TextArea, useStyles2, Stack, Avatar, IconButton, Tooltip } from '@grafana/ui';

import { CommentDTO, useCreateCommentMutation, useResolveCommentMutation, useDeleteCommentMutation } from '../api/dashboardCommentsApi';

interface CommentThreadProps {
  comment: CommentDTO;
  dashboardUid: string;
  currentUserId: number;
  onClose?: () => void;
}

export function CommentThread({ comment, dashboardUid, currentUserId, onClose }: CommentThreadProps) {
  const styles = useStyles2(getStyles);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [resolveComment, { isLoading: isResolving }] = useResolveCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const handleReply = async () => {
    if (!replyContent.trim()) {
      return;
    }

    try {
      await createComment({
        dashboardUid,
        parentId: comment.id,
        content: replyContent,
        panelId: comment.panelId,
      }).unwrap();
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      console.error('Failed to create reply:', error);
    }
  };

  const handleResolve = async () => {
    try {
      await resolveComment({
        dashboardUid,
        commentId: comment.id,
        resolved: !comment.resolved,
      }).unwrap();
    } catch (error) {
      console.error('Failed to resolve comment:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment({
        dashboardUid,
        commentId: comment.id,
      }).unwrap();
      onClose?.();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Avatar src={getGravatarUrl(comment.userEmail)} alt={comment.userName || comment.userLogin} />
          <div>
            <span className={styles.userName}>{comment.userName || comment.userLogin}</span>
            <span className={styles.timestamp}>
              {formatDistanceToNow(new Date(comment.created), { addSuffix: true })}
            </span>
          </div>
        </Stack>
        <Stack direction="row" gap={0.5}>
          {comment.resolved && (
            <span className={styles.resolvedBadge}>
              <Icon name="check" size="sm" /> Resolved
            </span>
          )}
          {onClose && (
            <IconButton name="times" aria-label="Close" onClick={onClose} size="sm" />
          )}
        </Stack>
      </div>

      <div className={styles.content}>{comment.content}</div>

      <div className={styles.actions}>
        <Stack direction="row" gap={1}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
            icon="comment-alt"
          >
            Reply
          </Button>
          <Tooltip content={comment.resolved ? 'Unresolve thread' : 'Resolve thread'}>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResolve}
              disabled={isResolving}
              icon={comment.resolved ? 'times-circle' : 'check-circle'}
            >
              {comment.resolved ? 'Unresolve' : 'Resolve'}
            </Button>
          </Tooltip>
          {comment.userId === currentUserId && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              icon="trash-alt"
            >
              Delete
            </Button>
          )}
        </Stack>
      </div>

      {isReplying && (
        <div className={styles.replyForm}>
          <TextArea
            value={replyContent}
            onChange={(e) => setReplyContent(e.currentTarget.value)}
            placeholder="Write a reply..."
            rows={3}
          />
          <Stack direction="row" gap={1} justifyContent="flex-end">
            <Button variant="secondary" size="sm" onClick={() => setIsReplying(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleReply}
              disabled={isCreating || !replyContent.trim()}
            >
              {isCreating ? 'Posting...' : 'Post Reply'}
            </Button>
          </Stack>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          <Button
            variant="secondary"
            fill="text"
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
            icon={showReplies ? 'angle-down' : 'angle-right'}
          >
            {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </Button>
          {showReplies && (
            <div className={styles.repliesList}>
              {comment.replies.map((reply) => (
                <CommentReply
                  key={reply.id}
                  reply={reply}
                  dashboardUid={dashboardUid}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CommentReplyProps {
  reply: CommentDTO;
  dashboardUid: string;
  currentUserId: number;
}

function CommentReply({ reply, dashboardUid, currentUserId }: CommentReplyProps) {
  const styles = useStyles2(getStyles);
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    try {
      await deleteComment({
        dashboardUid,
        commentId: reply.id,
      }).unwrap();
    } catch (error) {
      console.error('Failed to delete reply:', error);
    }
  };

  return (
    <div className={styles.reply}>
      <Stack direction="row" alignItems="flex-start" gap={1}>
        <Avatar src={getGravatarUrl(reply.userEmail)} alt={reply.userName || reply.userLogin} />
        <div className={styles.replyContent}>
          <div className={styles.replyHeader}>
            <span className={styles.userName}>{reply.userName || reply.userLogin}</span>
            <span className={styles.timestamp}>
              {formatDistanceToNow(new Date(reply.created), { addSuffix: true })}
            </span>
          </div>
          <div>{reply.content}</div>
          {reply.userId === currentUserId && (
            <Button
              variant="destructive"
              fill="text"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              icon="trash-alt"
            >
              Delete
            </Button>
          )}
        </div>
      </Stack>
    </div>
  );
}

function getGravatarUrl(email: string): string {
  const hash = email ? md5(email.toLowerCase().trim()) : '';
  return `https://www.gravatar.com/avatar/${hash}?d=mm`;
}

function md5(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.shape.radius.default,
    padding: theme.spacing(2),
    maxWidth: '400px',
  }),
  header: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
  }),
  userName: css({
    fontWeight: theme.typography.fontWeightMedium,
    marginRight: theme.spacing(1),
  }),
  timestamp: css({
    color: theme.colors.text.secondary,
    fontSize: theme.typography.bodySmall.fontSize,
  }),
  content: css({
    marginBottom: theme.spacing(1.5),
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  }),
  actions: css({
    borderTop: `1px solid ${theme.colors.border.weak}`,
    paddingTop: theme.spacing(1),
  }),
  resolvedBadge: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: theme.colors.success.text,
    fontSize: theme.typography.bodySmall.fontSize,
    padding: `${theme.spacing(0.25)} ${theme.spacing(0.5)}`,
    backgroundColor: theme.colors.success.transparent,
    borderRadius: theme.shape.radius.default,
  }),
  replyForm: css({
    marginTop: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  }),
  replies: css({
    marginTop: theme.spacing(1.5),
    borderTop: `1px solid ${theme.colors.border.weak}`,
    paddingTop: theme.spacing(1),
  }),
  repliesList: css({
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  }),
  reply: css({
    paddingLeft: theme.spacing(2),
    borderLeft: `2px solid ${theme.colors.border.weak}`,
  }),
  replyContent: css({
    flex: 1,
  }),
  replyHeader: css({
    marginBottom: theme.spacing(0.5),
  }),
});
