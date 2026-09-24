import RCCascader, { type FieldNames } from '@rc-component/cascader';
import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, useMemo } from 'react';
import * as React from 'react';

import { type IconName } from '../../types/icon';
import { Button, type ButtonProps } from '../Button/Button';
import { type CascaderOption } from '../Cascader/Cascader';
import '../Cascader/Cascader.global.css';
import { onChangeCascader, onLoadDataCascader } from '../Cascader/optionMappings';
import { Icon } from '../Icon/Icon';
import { getIconPath } from '../Icon/utils';

export interface ButtonCascaderProps {
  options: CascaderOption[];
  children: string;
  icon?: IconName;
  disabled?: boolean;
  value?: string[];
  fieldNames?: FieldNames<CascaderOption, keyof CascaderOption>;
  loadData?: (selectedOptions: CascaderOption[]) => void;
  onChange?: (value: string[], selectedOptions: CascaderOption[]) => void;
  onPopupVisibleChange?: (visible: boolean) => void;
  className?: string;
  variant?: ButtonProps['variant'];
  buttonProps?: Omit<ButtonProps, 'children'>;
  hideDownIcon?: boolean;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-buttoncascader--docs
 */
export const ButtonCascader = (props: ButtonCascaderProps) => {
  const { onChange, className, loadData, icon, buttonProps, hideDownIcon, variant, disabled, ...rest } = props;
  const popupStyle = useMemo(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    () => ({ '--gf-cascader-expand-icon': `url(${getIconPath('angle-right')})` }) as CSSProperties,
    []
  );

  // Weird way to do this bit it goes around a styling issue in Button where even null/undefined child triggers
  // styling change which messes up the look if there is only single icon content.
  let content: React.ReactNode = props.children;
  if (!hideDownIcon) {
    content = [props.children, <Icon key={'down-icon'} name="angle-down" xstyle={styles.downIcon} />];
  }

  return (
    <RCCascader
      onChange={onChangeCascader(onChange)}
      loadData={onLoadDataCascader(loadData)}
      popupClassName="gf-cascader-dropdown"
      popupStyle={popupStyle}
      {...rest}
      expandIcon={null}
    >
      <Button icon={icon} disabled={disabled} variant={variant} {...(buttonProps ?? {})}>
        {content}
      </Button>
    </RCCascader>
  );
};

ButtonCascader.displayName = 'ButtonCascader';

const styles = stylex.create({
  downIcon: {
    marginTop: '1px',
    marginRight: 0,
    marginBottom: 0,
    marginLeft: '4px',
  },
});
