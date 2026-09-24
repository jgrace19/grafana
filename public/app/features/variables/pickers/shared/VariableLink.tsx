import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { variableLinkStyles } from './VariableLink.stylex';
import { type MouseEvent, useCallback } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Icon } from '@grafana/ui';
import { LoadingIndicator } from '@grafana/ui/internal';

import { getStyles as getTagBadgeStyles } from '../../../../core/components/TagFilter/TagBadge';
import { ALL_VARIABLE_TEXT } from '../../constants';

interface Props {
  onClick: () => void;
  text: string;
  loading: boolean;
  onCancel: () => void;
  disabled?: boolean;
  /**
   *  htmlFor, needed for the label
   */
  id: string;
}

export const VariableLink = ({ loading, disabled, onClick: propsOnClick, text, onCancel, id }: Props) => {
  const onClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      propsOnClick();
    },
    [propsOnClick]
  );

  if (loading) {
    return (
      <div
        {...stylex.props(variableLinkStyles.container)}
        data-testid={selectors.pages.Dashboard.SubMenu.submenuItemValueDropDownValueLinkTexts(`${text}`)}
        title={text}
        id={id}
      >
        <VariableLinkText text={text} />
        <LoadingIndicator loading onCancel={onCancel} />
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      {...stylex.props(variableLinkStyles.container)}
      data-testid={selectors.pages.Dashboard.SubMenu.submenuItemValueDropDownValueLinkTexts(`${text}`)}
      aria-expanded={false}
      aria-controls={`options-${id}`}
      id={id}
      title={text}
      disabled={disabled}
    >
      <VariableLinkText text={text} />
      <Icon aria-hidden name="angle-down" size="sm" />
    </button>
  );
};

interface VariableLinkTextProps {
  text: string;
}

const VariableLinkText = ({ text }: VariableLinkTextProps) => {

  return (
    <span {...stylex.props(variableLinkStyles.textAndTags)}>
      {text === ALL_VARIABLE_TEXT ? t('variable.picker.link-all', 'All') : text}
    </span>
  );
};

