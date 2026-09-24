import * as stylex from '@stylexjs/stylex';
import { type MouseEvent, useCallback } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Icon } from '@grafana/ui';
import { LoadingIndicator } from '@grafana/ui/internal';
import { colors, components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
        {...stylex.props(styles.container)}
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
      {...stylex.props(styles.container)}
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
    <span {...stylex.props(styles.textAndTags)}>
      {text === ALL_VARIABLE_TEXT ? t('variable.picker.link-all', 'All') : text}
    </span>
  );
};

const styles = stylex.create({
  container: {
    maxWidth: '500px',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
    backgroundColor: {
      default: components['--gf-components-input-background'],
      ':disabled': colors['--gf-colors-action-disabled-background'],
    },
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':disabled': colors['--gf-colors-action-disabled-background'],
    },
    borderRadius: shape['--gf-shape-radius-default'],
    display: 'flex',
    alignItems: 'center',
    color: { default: colors['--gf-colors-text-primary'], ':disabled': colors['--gf-colors-action-disabled-text'] },
    height: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
  },
  textAndTags: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: spacing['--gf-spacing-x0-25'],
    userSelect: 'none',
  },
});
