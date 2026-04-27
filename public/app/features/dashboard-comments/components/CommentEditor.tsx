import { css } from '@emotion/css';
import { useState, useCallback } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Button, TextArea, useStyles2, Stack } from '@grafana/ui';

import { useCreateCommentMutation } from '../api/dashboardCommentsApi';

interface CommentEditorProps {
  dashboardUid: string;
  panelId?: number;
  annotationId?: number;
  timeFrom?: number;
  timeTo?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CommentEditor({
  dashboardUid,
  panelId,
  annotationId,
  timeFrom,
  timeTo,
  onSuccess,
  onCancel,
}: CommentEditorProps) {
  const styles = useStyles2(getStyles);
  const [content, setContent] = useState('');
  const [createComment, { isLoading }] = useCreateCommentMutation();

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      return;
    }

    try {
      await createComment({
        dashboardUid,
        panelId,
        annotationId,
        content: content.trim(),
        timeFrom,
        timeTo,
      }).unwrap();
      setContent('');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  }, [content, createComment, dashboardUid, panelId, annotationId, timeFrom, timeTo, onSuccess]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className={styles.container}>
      <TextArea
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a comment... (Cmd/Ctrl + Enter to submit)"
        rows={3}
        className={styles.textarea}
      />
      <Stack direction="row" gap={1} justifyContent="flex-end">
        {onCancel && (
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? 'Posting...' : 'Post Comment'}
        </Button>
      </Stack>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.shape.radius.default,
  }),
  textarea: css({
    resize: 'vertical',
    minHeight: '60px',
  }),
});
