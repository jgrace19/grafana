import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { mathStyles } from './Math.stylex';
import { type ChangeEvent } from 'react';
import * as React from 'react';

import { Trans, t } from '@grafana/i18n';
import { Icon, InlineField, InlineLabel, TextArea, Toggletip, Stack, TextLink } from '@grafana/ui';

import { type ExpressionQuery } from '../types';

interface Props {
  labelWidth: number | 'auto';
  query: ExpressionQuery;
  onChange: (query: ExpressionQuery) => void;
  onRunQuery: () => void;
}

const mathPlaceholder =
  'Math operations on one or more queries. You reference the query by ${refId} ie. $A, $B, $C etc\n' +
  'The sum of two scalar values: $A + $B > 10';

export const Math = ({ labelWidth, onChange, query, onRunQuery }: Props) => {
  const onExpressionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...query, expression: event.target.value });
  };

  const executeQuery = () => {
    if (query.expression) {
      onRunQuery();
    }
  };

  return (
    <Stack>
      <InlineField
        label={
          <InlineLabel width="auto">
            <Toggletip
              fitContent
              content={
                <div {...stylex.props(mathStyles.documentationContainer)}>
                  <div>
                    <Trans
                      i18nKey="expressions.math.run-math-operations"
                      values={{
                        refExample: '${refId}',
                        ref1: '$A',
                        ref2: '$B',
                        ref3: '$C',
                        example: '$A + $B',
                      }}
                    >
                      Run math operations on one or more queries. You reference the query by {'{{refExample}}'} ie.{' '}
                      {'{{ref1}}'}, {'{{ref2}}'}, {'{{ref3}}'}
                      etc.
                      <br />
                      Example: <code>{'{{example}}'}</code>
                    </Trans>
                  </div>
                  <header {...stylex.props(mathStyles.documentationHeader)}>
                    <Trans i18nKey="expressions.math.available-math-functions">Available math functions</Trans>
                  </header>
                  <div {...stylex.props(mathStyles.documentationFunctions)}>
                    <DocumentedFunction
                      name="abs"
                      description={t(
                        'expression.math.description-abs',
                        'Returns the absolute value of its argument which can be a number or a series'
                      )}
                    />
                    <DocumentedFunction
                      name="is_inf"
                      description={t(
                        'expression.math.description-is-inf',
                        "Returns 1 for Inf values (negative or positive) and 0 for other values. It's able to operate on series or scalar values."
                      )}
                    />
                    <DocumentedFunction
                      name="is_nan"
                      description={t(
                        'expression.math.description-is-nan',
                        "Returns 1 for NaN values and 0 for other values. It's able to operate on series or scalar values."
                      )}
                    />
                    <DocumentedFunction
                      name="is_null"
                      description={t(
                        'expression.math.description-is-null',
                        "Returns 1 for null values and 0 for other values. It's able to operate on series or scalar values."
                      )}
                    />
                    <DocumentedFunction
                      name="is_number"
                      description={t(
                        'expression.math.description-is-number',
                        "Returns 1 for all real number values and 0 for non-number. It's able to operate on series or scalar values."
                      )}
                    />
                    <DocumentedFunction
                      name="log"
                      description={t(
                        'expression.math.description-log',
                        'Returns the natural logarithm of its argument, which can be a number or a series'
                      )}
                    />
                    <DocumentedFunction
                      name="inf, infn, nan, and null"
                      description={t(
                        'expression.math.description-inf-nan-null',
                        'The inf for infinity positive, infn for infinity negative, nan, and null functions all return a single scalar value that matches its name.'
                      )}
                    />
                    <DocumentedFunction
                      name="round"
                      description={t(
                        'expression.math.description-round',
                        "Returns a rounded integer value. It's able to operate on series or escalar values."
                      )}
                    />
                    <DocumentedFunction
                      name="ceil"
                      description={t(
                        'expression.math.description-ceil',
                        "Rounds the number up to the nearest integer value. It's able to operate on series or escalar values."
                      )}
                    />
                    <DocumentedFunction
                      name="floor"
                      description={t(
                        'expression.math.description-floor',
                        "Rounds the number down to the nearest integer value. It's able to operate on series or escalar values."
                      )}
                    />
                  </div>
                </div>
              }
              title={
                <Stack gap={1} direction="row">
                  <Icon name="book-open" /> <Trans i18nKey="expressions.math.tooltip-title">Math operator</Trans>
                </Stack>
              }
              footer={
                <div>
                  <Trans i18nKey="expressions.math.tooltip-footer">
                    See our additional documentation on{' '}
                    <TextLink
                      external
                      href="https://grafana.com/docs/grafana/latest/panels/query-a-data-source/use-expressions-to-manipulate-data/about-expressions/#math"
                    >
                      Math expressions
                    </TextLink>
                    .
                  </Trans>
                </div>
              }
              closeButton={true}
              placement="bottom-start"
            >
              <div {...stylex.props(mathStyles.info)}>
                <Trans i18nKey="expressions.math.tooltip-trigger">Expression</Trans> <Icon name="info-circle" />
              </div>
            </Toggletip>
          </InlineLabel>
        }
        labelWidth={labelWidth}
        grow={true}
        shrink={true}
      >
        <TextArea
          value={query.expression}
          onChange={onExpressionChange}
          rows={1}
          placeholder={mathPlaceholder}
          onBlur={executeQuery}
          style={{ minWidth: 250, lineHeight: '26px', minHeight: 32 }}
        />
      </InlineField>
    </Stack>
  );
};

interface DocumentedFunctionProps {
  name: string;
  description: React.ReactNode;
}
const DocumentedFunction = ({ name, description }: DocumentedFunctionProps) => {
  const styles = (getDocumentedFunctionStyles);

  return (
    <>
      <span className={mathStyles.name}>{name}</span>
      <span className={mathStyles.description}>{description}</span>
    </>
  );
};


const getDocumentedFunctionStyles = (theme: GrafanaTheme2) => ({
  name: css({
    fontWeight: theme.typography.fontWeightBold,
  }),
  description: css({
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.disabled,
  }),
});
