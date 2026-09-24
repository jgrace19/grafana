import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { Trans } from '@grafana/i18n';
import { Box, Text } from '@grafana/ui';
import { durations, easings, motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
      <div {...stylex.props(styles.messageListWrapper, showFull && styles.messageListWrapperExpanded)}>
        <ul {...stylex.props(styles.messageList)}>
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
                    {...stylex.props(styles.showMore, styles.showMoreInline)}
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
          <button type="button" {...stylex.props(styles.showMore)} onClick={handleCollapse} aria-expanded={true}>
            <Trans i18nKey="provisioning.message.show-less">show less</Trans>
          </button>
        </Box>
      )}
    </>
  );
}

const styles = stylex.create({
  messageListWrapper: {
    overflow: 'hidden',
    maxHeight: '200px',
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'max-height' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.standard },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
  },
  messageListWrapperExpanded: {
    maxHeight: '9999px',
  },
  messageList: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingLeft: spacing['--gf-spacing-x3'],
    listStyle: 'disc',
  },
  showMore: {
    backgroundColor: 'transparent',
    borderStyle: 'none',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    textDecoration: 'underline',
    cursor: 'pointer',
    color: colors['--gf-colors-text-primary'],
  },
  showMoreInline: {
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
});
