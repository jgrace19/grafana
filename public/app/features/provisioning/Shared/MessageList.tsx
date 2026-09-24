import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { messageListStyles } from './MessageList.stylex';
import { useState } from 'react';

import { Trans } from '@grafana/i18n';
import { Box, Text } from '@grafana/ui';

interface MessageListProps {
  messages: string[];
  variant?: 'body' | 'bodySmall';
}

export function MessageList({ messages, variant }: MessageListProps) {
  const [showFull, setShowFull] = useState(false);
  const hasMultipleMessages = messages.length > 1;

  const handleExpand = () => {
    setShowFull(true);
  };

  const handleCollapse = () => {
    setShowFull(false);
  };

  const displayMessages = showFull ? messages : messages.slice(0, 1);

  return (
    <>
      <div {...mergeStylexClassName(stylex.props(messageListStyles.messageListWrapper, { ...(showFull  ? stylex.props(messageListStyles.messageListWrapperExpanded) : {}) }), undefined)}>
        <ul {...stylex.props(messageListStyles.messageList)}>
          {displayMessages.map((msg, index) => (
            <li key={index}>
              {variant ? <Text variant={variant}>{msg}</Text> : msg}
              {!showFull && hasMultipleMessages && index === 0 && (
                <>
                  {' '}
                  <span aria-hidden="true">… </span>
                  <span className="sr-only">
                    <Trans i18nKey="provisioning.message.truncated">Message truncated</Trans>
                  </span>
                  <button
                    type="button"
                    {...mergeStylexClassName(stylex.props(messageListStyles.showMore, messageListStyles.showMoreInline), undefined)}
                    onClick={handleExpand}
                    aria-expanded={false}
                  >
                    <Trans i18nKey="provisioning.message.show-more">show more</Trans>
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {showFull && hasMultipleMessages && (
        <Box paddingLeft={3} paddingTop={0.5}>
          <button type="button" {...stylex.props(messageListStyles.showMore)} onClick={handleCollapse} aria-expanded={true}>
            <Trans i18nKey="provisioning.message.show-less">show less</Trans>
          </button>
        </Box>
      )}
    </>
  );
}

