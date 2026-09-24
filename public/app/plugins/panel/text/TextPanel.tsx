import * as stylex from '@stylexjs/stylex';
import DangerouslySetHtmlContent from 'dangerously-set-html-content';
import { useState } from 'react';
import { useDebounce } from 'react-use';

import { type PanelProps, renderTextPanelMarkdown, textUtil, type InterpolateFunction } from '@grafana/data';
import { CodeEditor, ScrollContainer } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import config from 'app/core/config';

import { defaultCodeOptions, type Options, TextMode } from './panelcfg.gen';
import './TextPanel.css';

export interface Props extends PanelProps<Options> {}

export function TextPanel(props: Props) {
  const [processed, setProcessed] = useState<Options>({
    mode: props.options.mode,
    content: processContent(props.options, props.replaceVariables, config.disableSanitizeHtml),
  });

  useDebounce(
    () => {
      const { options, replaceVariables } = props;
      const content = processContent(options, replaceVariables, config.disableSanitizeHtml);
      if (content !== processed.content || options.mode !== processed.mode) {
        setProcessed({
          mode: options.mode,
          content,
        });
      }
    },
    100,
    [props]
  );

  if (processed.mode === TextMode.Code) {
    const code = props.options.code ?? defaultCodeOptions;
    return (
      <CodeEditor
        key={`${code.showLineNumbers}/${code.showMiniMap}`} // will reinit-on change
        value={processed.content}
        language={code.language ?? defaultCodeOptions.language!}
        width={props.width}
        height={props.height}
        containerStyles="gf-text-panel-code-editor"
        showMiniMap={code.showMiniMap}
        showLineNumbers={code.showLineNumbers}
        readOnly={true} // future
      />
    );
  }

  return (
    <div {...stylex.props(styles.containStrict)}>
      <ScrollContainer minHeight="100%">
        <DangerouslySetHtmlContent
          allowRerender
          html={processed.content}
          className={mergeStylexProps(stylex.props(styles.markdownHtml), { className: 'markdown-html' }).className}
          data-testid="TextPanel-converted-content"
        />
      </ScrollContainer>
    </div>
  );
}

function processContent(options: Options, interpolate: InterpolateFunction, disableSanitizeHtml: boolean): string {
  let { mode, content } = options;

  // Variables must be interpolated before content is converted to markdown so using variables
  // in URLs work properly
  content = interpolate(content, {}, options.code?.language === 'json' ? 'json' : 'html');

  if (!content) {
    return ' ';
  }

  switch (mode) {
    case TextMode.Code:
      break; // nothing
    case TextMode.HTML:
      if (!disableSanitizeHtml) {
        content = textUtil.sanitizeTextPanelContent(content);
      }
      break;
    case TextMode.Markdown:
    default:
      // default to markdown
      content = renderTextPanelMarkdown(content, {
        noSanitize: disableSanitizeHtml,
      });
  }

  return content;
}

const styles = stylex.create({
  containStrict: {
    contain: 'strict',
    height: '100%',
    display: 'flex',
  },
  markdownHtml: {
    height: '100%',
  },
});
