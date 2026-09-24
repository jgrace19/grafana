import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { tokenizeStyles } from './Tokenize.stylex';
import * as React from 'react';

import { Badge } from '@grafana/ui';

import { PopupCard } from './HoverCard';
import { builtinFunctions as FUNCTIONS, keywords as KEYWORDS } from './receivers/editor/language';

const VARIABLES = ['$', '.', '"'];

interface TokenizerProps {
  input: string;
  delimiter?: [string, string];
}

function Tokenize({ input, delimiter = ['{{', '}}'] }: TokenizerProps) {

  const [open, close] = delimiter;

  /**
   * This RegExp uses 2 named capture groups, text that comes before the token and the token itself
   *
   *  <before> open  <token>  close
   *  ───────── ── ─────────── ──
   *  Some text {{ $labels.foo }}
   */
  const regex = new RegExp(`(?<before>.*?)(${open}(?<token>.*?)${close}|$)`, 'gm');
  const lines = input.split('\n');

  const output: React.ReactElement[] = [];

  lines.forEach((line, lineIndex) => {
    const matches = Array.from(line.matchAll(regex));

    matches.forEach((match, matchIndex) => {
      const before = match.groups?.before;
      const token = match.groups?.token?.trim();

      if (before) {
        output.push(<span key={`${lineIndex}-${matchIndex}-before`}>{before}</span>);
      }

      if (token) {
        const type = tokenType(token);
        const description = type === TokenType.Variable ? token : '';
        const tokenContent = `${open} ${token} ${close}`;

        output.push(
          <Token
            key={`${lineIndex}-${matchIndex}-token`}
            content={tokenContent}
            type={type}
            description={description}
          />
        );
      }
    });

    output.push(<br key={`${lineIndex}-newline`} />);
  });

  return <span {...stylex.props(tokenizeStyles.wrapper)}>{output}</span>;
}

enum TokenType {
  Variable = 'variable',
  Function = 'function',
  Keyword = 'keyword',
  Unknown = 'unknown',
}

interface TokenProps {
  content: string;
  type?: TokenType;
  description?: string;
}

function Token({ content, description, type }: TokenProps) {

  const disableCard = Boolean(type) === false;

  return (
    <PopupCard
      placement="top-start"
      disabled={disableCard}
      content={
        <div {...stylex.props(tokenizeStyles.hoverTokenItem)}>
          <Badge tabIndex={0} text={<>{type}</>} color={'blue'} /> {description && <code>{description}</code>}
        </div>
      }
    >
      <span>
        <Badge tabIndex={0} {...stylex.props(tokenizeStyles.token)} text={content} color={'blue'} />
      </span>
    </PopupCard>
  );
}

function isVariable(input: string) {
  return VARIABLES.some((character) => input.startsWith(character));
}

function isKeyword(input: string) {
  return KEYWORDS.some((keyword) => input.startsWith(keyword));
}

function isFunction(input: string) {
  return FUNCTIONS.some((functionName) => input.startsWith(functionName));
}

function tokenType(input: string) {
  let tokenType;
  if (isVariable(input)) {
    tokenType = TokenType.Variable;
  } else if (isKeyword(input)) {
    tokenType = TokenType.Keyword;
  } else if (isFunction(input)) {
    tokenType = TokenType.Function;
  } else {
    tokenType = TokenType.Unknown;
  }

  return tokenType;
}


export { Tokenize, Token };
