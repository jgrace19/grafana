import { useMemo, useState } from 'react';

import { config } from '@grafana/runtime';
import { contextSrv } from 'app/core/services/context_srv';
import { Button, Drawer, Stack, TextArea } from '@grafana/ui';

import { type DashboardCommentDTO, useCreateCommentMutation, useDeleteCommentMutation } from '../../api/commentsApi';

import { CommentItem } from './CommentItem';

export interface Props {
  dashboardUid: string;
  panelId: number;
  isOpen: boolean;
  onClose: () => void;
  comments: DashboardCommentDTO[];
}

export function CommentDrawer({ dashboardUid, panelId, isOpen, onClose, comments }: Props) {
  const [newText, setNewText] = useState('');
  const [replyParentId, setReplyParentId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const panelComments = useMemo(
    () => comments.filter((c) => c.panelId === panelId),
    [comments, panelId]
  );

  const { roots, repliesByParent } = useMemo(() => {
    const roots: DashboardCommentDTO[] = [];
    const repliesByParent = new Map<number, DashboardCommentDTO[]>();
    for (const c of panelComments) {
      if (c.parentId == null) {
        roots.push(c);
      } else {
        const list = repliesByParent.get(c.parentId) ?? [];
        list.push(c);
        repliesByParent.set(c.parentId, list);
      }
    }
    roots.sort((a, b) => a.created - b.created);
    for (const [, list] of repliesByParent) {
      list.sort((a, b) => a.created - b.created);
    }
    return { roots, repliesByParent };
  }, [panelComments]);

  const canDelete = (c: DashboardCommentDTO) => c.userId === contextSrv.user.id;

  const submitTop = async () => {
    const text = newText.trim();
    if (!text || !config.featureToggles.dashboardComments) {
      return;
    }
    await createComment({
      dashboardUid,
      panelId,
      content: text,
    }).unwrap();
    setNewText('');
  };

  const submitReply = async () => {
    const text = replyText.trim();
    if (!text || replyParentId == null) {
      return;
    }
    await createComment({
      dashboardUid,
      panelId,
      content: text,
      parentId: replyParentId,
    }).unwrap();
    setReplyText('');
    setReplyParentId(null);
  };

  const onDelete = async (id: number) => {
    await deleteComment({ dashboardUid, id }).unwrap();
  };

  if (!config.featureToggles.dashboardComments || !isOpen) {
    return null;
  }

  return (
    <Drawer title="Panel comments" subtitle={`Panel ${panelId}`} onClose={onClose} size="lg">
      <Stack direction="column" gap={2}>
        <Stack direction="column" gap={1}>
          <TextArea
            rows={3}
            value={newText}
            onChange={(e) => setNewText(e.currentTarget.value)}
            placeholder="Write a comment (Markdown supported)"
          />
          <Button onClick={submitTop} disabled={isCreating || !newText.trim()}>
            Comment
          </Button>
        </Stack>

        {replyParentId != null && (
          <Stack direction="column" gap={1}>
            <TextArea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.currentTarget.value)}
              placeholder="Reply..."
            />
            <Stack gap={1}>
              <Button onClick={submitReply} disabled={isCreating || !replyText.trim()}>
                Send reply
              </Button>
              <Button fill="outline" variant="secondary" onClick={() => setReplyParentId(null)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}

        {roots.length === 0 && <span>No comments yet.</span>}

        {roots.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            replies={repliesByParent.get(c.id) ?? []}
            onReply={(id) => setReplyParentId(id)}
            onDelete={onDelete}
            canDelete={canDelete}
          />
        ))}
      </Stack>
    </Drawer>
  );
}
