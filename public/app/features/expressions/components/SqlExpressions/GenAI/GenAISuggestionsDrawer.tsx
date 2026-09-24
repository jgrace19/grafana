import * as stylex from '@stylexjs/stylex';

import { renderMarkdown } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { CodeEditor, Drawer, Stack, Button, Card, Text, ClipboardButton } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { parseSuggestion } from './utils';

interface AISuggestionsDrawerProps {
  isOpen: boolean;
  onApplySuggestion: (suggestion: string) => void;
  onClose: () => void;
  suggestions: string[];
}

export const GenAISuggestionsDrawer = ({
  isOpen,
  onApplySuggestion,
  onClose,
  suggestions,
}: AISuggestionsDrawerProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Drawer
      onClose={onClose}
      size="lg"
      title={<Trans i18nKey="sql-expressions.sql-suggestion-history">SQL Suggestion History</Trans>}
    >
      <div {...stylex.props(styles.content)} data-testid="suggestions-drawer">
        <Stack direction="column" gap={3}>
          <div {...stylex.props(styles.timelineContainer)}>
            {/* Vertical timeline line */}
            <div {...stylex.props(styles.timelineLine)} />

            <div {...stylex.props(styles.suggestionsList)}>
              {suggestions.map((suggestion, index) => {
                const parsedSuggestion = parseSuggestion(suggestion);
                const isLatest = index === 0;

                return (
                  <div key={index} {...stylex.props(styles.timelineItem)}>
                    {/* Timeline node */}
                    <div
                      {...stylex.props(
                        styles.timelineNode,
                        isLatest ? styles.timelineNodeActive : styles.timelineNodeInactive
                      )}
                    />
                    <Card
                      noMargin
                      key={index}
                      className={isLatest ? stylex.props(styles.latestSuggestion).className : ''}
                    >
                      <div {...stylex.props(styles.suggestionContent)}>
                        {parsedSuggestion.map(({ type, content, language }, partIndex) => (
                          <div key={partIndex} {...stylex.props(styles.suggestionPart)}>
                            {type === 'code' ? (
                              <div {...stylex.props(styles.codeBlock)}>
                                <div {...stylex.props(styles.codeHeader)}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Text variant="bodySmall" weight="bold">
                                      <Trans
                                        i18nKey="sql-expressions.code-label"
                                        values={{ language: language?.toUpperCase() || 'CODE' }}
                                      >
                                        {'{{ language }}'}
                                      </Trans>
                                    </Text>
                                    <Stack direction="row" gap={1}>
                                      <ClipboardButton
                                        size="sm"
                                        icon="copy"
                                        variant="secondary"
                                        getText={() => content}
                                      >
                                        <Trans i18nKey="sql-expressions.copy">Copy</Trans>
                                      </ClipboardButton>
                                      <Button
                                        size="sm"
                                        variant="primary"
                                        icon="ai-sparkle"
                                        onClick={() => onApplySuggestion(content)}
                                      >
                                        <Trans i18nKey="sql-expressions.apply">Apply</Trans>
                                      </Button>
                                    </Stack>
                                  </Stack>
                                </div>
                                <CodeEditor
                                  value={content}
                                  language={language === 'sql' || language === 'mysql' ? 'mysql' : 'sql'}
                                  width="100%"
                                  height={Math.max(80, Math.min(300, (content.split('\n').length + 1) * 20))}
                                  readOnly={true}
                                  showMiniMap={false}
                                  showLineNumbers={true}
                                  monacoOptions={{
                                    lineNumbers: 'on',
                                    folding: false,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    renderLineHighlight: 'none',
                                    wordWrap: 'on',
                                    readOnly: true,
                                    contextmenu: false,
                                    padding: { top: 8, bottom: 8 },
                                    automaticLayout: true,
                                    fontSize: 13,
                                    lineHeight: 20,
                                  }}
                                />
                              </div>
                            ) : (
                              <div
                                className="markdown-html"
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </Stack>
      </div>
    </Drawer>
  );
};

const styles = stylex.create({
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  timelineContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    flex: '1',
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 4.5)`, // Space for timeline line and nodes
  },
  timelineLine: {
    position: 'absolute',
    // Offset the 2px width of the timeline line
    left: `calc(${spacing['--gf-spacing-x1']} + 2px)`,
    top: spacing['--gf-spacing-x1'],
    bottom: 0,
    width: '2px',
    backgroundColor: colors['--gf-colors-border-strong'],
    zIndex: 1,
  },
  suggestionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x2'],
    position: 'relative',
  },
  timelineItem: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing['--gf-spacing-x2'],
  },
  timelineNode: {
    position: 'absolute',
    left: `calc(${spacing['--gf-spacing-grid-size']} * -4.5)`, // Position on the timeline line
    top: spacing['--gf-spacing-x1'], // Align with card content
    width: spacing['--gf-spacing-x3'],
    height: spacing['--gf-spacing-x3'],
    borderRadius: shape['--gf-shape-radius-pill'],
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-primary-main'],
    backgroundColor: colors['--gf-colors-background-primary'],
    zIndex: 2,
    flexShrink: 0,
  },
  timelineNodeActive: {
    backgroundColor: colors['--gf-colors-primary-main'], // Filled circle for current/latest
    boxShadow: `0 0 0 4px ${colors['--gf-colors-background-primary']}`, // White ring around filled circle
  },
  timelineNodeInactive: {
    backgroundColor: colors['--gf-colors-background-primary'], // Empty circle for others
    boxShadow: `0 0 0 4px ${colors['--gf-colors-background-primary']}`, // White ring around filled circle
  },
  latestSuggestion: {
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-primary-main'],
    position: 'relative',
    '::before': {
      content: '"Latest"',
      position: 'absolute',
      top: `calc(${spacing['--gf-spacing-grid-size']} * -0.5)`,
      right: spacing['--gf-spacing-x1'],
      backgroundColor: colors['--gf-colors-primary-main'],
      color: colors['--gf-colors-primary-contrast-text'],
      paddingTop: spacing['--gf-spacing-x0-25'],
      paddingRight: spacing['--gf-spacing-x1'],
      paddingBottom: spacing['--gf-spacing-x0-25'],
      paddingLeft: spacing['--gf-spacing-x1'],
      borderRadius: shape['--gf-shape-radius-default'],
      fontSize: typography['--gf-typography-body-small-font-size'],
      fontWeight: typography['--gf-typography-font-weight-medium'],
    },
  },
  suggestionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1-5'],
    width: '100%',
    overflowX: 'auto',
  },
  suggestionPart: {
    display: 'block',
    width: '100%',
  },
  codeBlock: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    borderRadius: shape['--gf-shape-radius-default'],
    overflow: 'hidden',
    marginBottom: spacing['--gf-spacing-x1'],
    width: '100%',
    minWidth: '600px',
  },
  codeHeader: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
});
