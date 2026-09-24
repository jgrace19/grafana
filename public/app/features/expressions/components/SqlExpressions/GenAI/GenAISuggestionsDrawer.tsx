
import { Trans } from '@grafana/i18n';
import { CodeEditor, Drawer, Stack, Button, Card, Text, ClipboardButton } from '@grafana/ui';

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
  const styles = (getStyles);

  if (!isOpen) {
    return null;
  }

  return (
    <Drawer
      onClose={onClose}
      size="lg"
      title={<Trans i18nKey="sql-expressions.sql-suggestion-history">SQL Suggestion History</Trans>}
    >
      <div {...stylex.props(genAISuggestionsDrawerStyles.content)} data-testid="suggestions-drawer">
        <Stack direction="column" gap={3}>
          <div {...stylex.props(genAISuggestionsDrawerStyles.timelineContainer)}>
            {/* Vertical timeline line */}
            <div {...stylex.props(genAISuggestionsDrawerStyles.timelineLine)} />

            <div {...stylex.props(genAISuggestionsDrawerStyles.suggestionsList)}>
              {suggestions.map((suggestion, index) => {
                const parsedSuggestion = parseSuggestion(suggestion);
                const isLatest = index === 0;

                return (
                  <div key={index} {...stylex.props(genAISuggestionsDrawerStyles.timelineItem)}>
                    {/* Timeline node */}
                    <div
                      className={`${styles.timelineNode} ${isLatest ? styles.timelineNodeActive : styles.timelineNodeInactive}`}
                    />
                    <Card noMargin key={index} {...mergeStylexClassName(isLatest  ? stylex.props(genAISuggestionsDrawerStyles.latestSuggestion) : {}, undefined)}>
                      <div {...stylex.props(genAISuggestionsDrawerStyles.suggestionContent)}>
                        {parsedSuggestion.map(({ type, content, language }, partIndex) => (
                          <div key={partIndex} {...stylex.props(genAISuggestionsDrawerStyles.suggestionPart)}>
                            {type === 'code' ? (
                              <div {...stylex.props(genAISuggestionsDrawerStyles.codeBlock)}>
                                <div {...stylex.props(genAISuggestionsDrawerStyles.codeHeader)}>
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

