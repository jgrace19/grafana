import * as stylex from '@stylexjs/stylex';

import { sanitizeUrl } from '@grafana/data/internal';
import { t } from '@grafana/i18n';
import { Icon, Tooltip } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const BARE_LINK_REGEX = /https?:\/\/[^\s<>()]+/gi;
const TRAILING_PUNCTUATION_REGEX = /[),.;!?]+$/;
const SAFE_PROTOCOL_REGEX = /^https?:\/\//i;

interface VariableDescriptionTooltipProps {
  description: string;
  placement: 'top' | 'bottom';
}

export function VariableDescriptionTooltip({ description, placement }: VariableDescriptionTooltipProps) {
  return (
    <Tooltip
      content={
        <div {...stylex.props(styles.tooltipContent)}>
          {renderDescriptionWithLinks(description, stylex.props(styles.link).className ?? '')}
        </div>
      }
      placement={placement}
      interactive
    >
      <Icon
        name="info-circle"
        size="sm"
        xstyle={styles.icon}
        aria-label={t('dashboard.variable.description-tooltip', 'Variable description')}
      />
    </Tooltip>
  );
}

function renderDescriptionWithLinks(description: string, linkClassName: string) {
  const elements: Array<string | JSX.Element> = [];
  let nextKey = 0;
  let cursor = 0;

  MARKDOWN_LINK_REGEX.lastIndex = 0;

  for (const match of description.matchAll(MARKDOWN_LINK_REGEX)) {
    const matchStart = match.index ?? 0;

    if (matchStart > cursor) {
      appendTextWithBareLinks(elements, description.slice(cursor, matchStart), linkClassName, () => nextKey++);
    }

    const label = match[1];
    const url = match[2];
    elements.push(renderExternalLinkOrText(label, url, linkClassName, nextKey++));
    cursor = matchStart + match[0].length;
  }

  if (cursor < description.length) {
    appendTextWithBareLinks(elements, description.slice(cursor), linkClassName, () => nextKey++);
  }

  return elements;
}

function appendTextWithBareLinks(
  elements: Array<string | JSX.Element>,
  text: string,
  linkClassName: string,
  getNextKey: () => number
) {
  BARE_LINK_REGEX.lastIndex = 0;
  let cursor = 0;

  for (const match of text.matchAll(BARE_LINK_REGEX)) {
    const matchStart = match.index ?? 0;
    if (matchStart > cursor) {
      elements.push(text.slice(cursor, matchStart));
    }

    const rawMatch = match[0];
    const trimmedUrl = rawMatch.replace(TRAILING_PUNCTUATION_REGEX, '');
    const trailingText = rawMatch.slice(trimmedUrl.length);

    elements.push(renderExternalLinkOrText(trimmedUrl, trimmedUrl, linkClassName, getNextKey()));

    if (trailingText) {
      elements.push(trailingText);
    }

    cursor = matchStart + rawMatch.length;
  }

  if (cursor < text.length) {
    elements.push(text.slice(cursor));
  }
}

function renderExternalLinkOrText(
  label: string,
  url: string,
  linkClassName: string,
  key: number
): string | JSX.Element {
  const safeUrl = getSafeExternalUrl(url);

  if (!safeUrl) {
    return label;
  }

  return (
    <a key={key} href={safeUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
      {label}
    </a>
  );
}

function getSafeExternalUrl(url: string): string | undefined {
  const trimmedUrl = url.trim();

  if (!SAFE_PROTOCOL_REGEX.test(trimmedUrl)) {
    return undefined;
  }

  const sanitizedUrl = sanitizeUrl(trimmedUrl);

  if (sanitizedUrl === '' || sanitizedUrl === 'about:blank') {
    return undefined;
  }

  return sanitizedUrl;
}

const styles = stylex.create({
  icon: {
    color: colors['--gf-colors-text-secondary'],
  },
  tooltipContent: {
    maxWidth: `calc(${spacing['--gf-spacing-grid-size']} * 40)`,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  link: {
    color: colors['--gf-colors-primary-text'],
    textDecoration: 'underline',
  },
});
