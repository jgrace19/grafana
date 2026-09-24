import type { JSX } from 'react';

import { type GrafanaTheme2 } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { FieldValidationMessage, TextLink } from '@grafana/ui';

import { stylexClassNames } from '../../stylex/classNames';

import { overhaulStylexStyles } from './utils.stylex';

const overhaulClassNames = stylexClassNames(overhaulStylexStyles);

/**
 * Use this to return a url in a tooltip in a field. Don't forget to make the field interactive to be able to click on the tooltip
 * @param url
 * @returns
 */
export function docsTip(url?: string) {
  const docsUrl = 'https://grafana.com/docs/grafana/latest/datasources/prometheus/configure/';

  return (
    <TextLink href={url ? url : docsUrl} external>
      <Trans i18nKey="grafana-prometheus.configuration.docs-tip.visit-docs-for-more-details-here">
        Visit docs for more details here.
      </Trans>
    </TextLink>
  );
}

export const validateInput = (
  input: string,
  pattern: string | RegExp,
  errorMessage?: string
): boolean | JSX.Element => {
  const defaultErrorMessage = 'Value is not valid';
  const inputTooLongErrorMessage = 'Input is too long';
  const validationTimeoutErrorMessage = 'Validation timeout - input too complex';
  const invalidValidationPatternErrorMessage = 'Invalid validation pattern';
  const MAX_INPUT_LENGTH = 1000; // Reasonable limit for most validation cases

  // Early return if no input
  if (!input) {
    return true;
  }

  // Check input length
  if (input.length > MAX_INPUT_LENGTH) {
    return <FieldValidationMessage>{inputTooLongErrorMessage}</FieldValidationMessage>;
  }

  try {
    // Convert string pattern to RegExp if needed
    let regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    // Ensure pattern is properly anchored to prevent catastrophic backtracking
    if (typeof pattern === 'string' && !pattern.startsWith('^') && !pattern.endsWith('$')) {
      regex = new RegExp(`^${pattern}$`);
    }

    // Add timeout to prevent ReDoS
    const timeout = 100; // 100ms timeout
    const startTime = Date.now();

    const isValid = regex.test(input);

    // Check if execution took too long
    if (Date.now() - startTime > timeout) {
      return <FieldValidationMessage>{validationTimeoutErrorMessage}</FieldValidationMessage>;
    }

    if (!isValid) {
      return <FieldValidationMessage>{errorMessage || defaultErrorMessage}</FieldValidationMessage>;
    }

    return true;
  } catch (error) {
    return <FieldValidationMessage>{invalidValidationPatternErrorMessage}</FieldValidationMessage>;
  }
};

export function overhaulStyles(_theme?: GrafanaTheme2) {
  return overhaulClassNames;
}
