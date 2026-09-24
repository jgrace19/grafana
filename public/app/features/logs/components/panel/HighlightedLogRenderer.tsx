import * as stylex from '@stylexjs/stylex';
import { type Token } from 'prismjs';
import { memo } from 'react';

import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, components, typography } from '@grafana/ui/stylex/tokens.stylex';

import { logLineVars } from './logLine.stylex';

interface Props {
  tokens: Array<string | Token>;
  /** Colors the tokens of the built-in log grammar. Custom Prism grammars are colored by the global Prism theme. */
  colorTokens?: boolean;
}

export const HighlightedLogRenderer = memo(({ tokens, colorTokens = false }: Props) => {
  return (
    <>
      {tokens.map((token, i) => (
        <LogToken token={token} colorTokens={colorTokens} key={i} />
      ))}
    </>
  );
});
HighlightedLogRenderer.displayName = 'HighlightedLogRenderer';

const LogToken = memo(({ token, colorTokens }: { token: Token | string; colorTokens: boolean }) => {
  if (typeof token === 'string') {
    return token;
  }
  const tokenProps = mergeStylexProps(stylex.props(colorTokens && getTokenStyle(token.type)), {
    className: `token ${token.type}`,
  });
  if (Array.isArray(token.content)) {
    return (
      <span {...tokenProps}>
        {token.content.map((subToken, i) => (
          <LogToken key={i} token={subToken} colorTokens={colorTokens} />
        ))}
      </span>
    );
  }
  return (
    <span {...tokenProps}>
      {typeof token.content === 'string' ? token.content : <LogToken token={token.content} colorTokens={colorTokens} />}
    </span>
  );
});
LogToken.displayName = 'LogToken';

function getTokenStyle(type: string) {
  switch (type) {
    case 'log-token-string':
      return tokenStyles.string;
    case 'log-token-duration':
    case 'log-token-size':
    case 'log-token-uuid':
      return tokenStyles.value;
    case 'log-token-key':
      return tokenStyles.key;
    case 'log-token-json-key':
      return tokenStyles.jsonKey;
    case 'log-token-label':
      return tokenStyles.label;
    case 'log-token-method':
      return tokenStyles.method;
    case 'log-search-match':
      return tokenStyles.searchMatch;
    default:
      return null;
  }
}

const tokenStyles = stylex.create({
  string: {
    color: logLineVars.bodyColor,
  },
  value: {
    color: colors['--gf-colors-success-text'],
  },
  key: {
    color: colors['--gf-colors-text-secondary'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },
  jsonKey: {
    color: colors['--gf-colors-text-secondary'],
    opacity: 0.9,
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },
  label: {
    color: colors['--gf-colors-text-secondary'],
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
  method: {
    color: colors['--gf-colors-info-shade'],
  },
  searchMatch: {
    color: components['--gf-components-text-highlight-text'],
    backgroundColor: components['--gf-components-text-highlight-background'],
  },
});
