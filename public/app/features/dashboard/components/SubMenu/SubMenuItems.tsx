import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';

import { type TypedVariableModel, VariableHide } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { mergeStylexProps } from '@grafana/ui/internal';

import { PickerRenderer } from '../../../variables/pickers/PickerRenderer';

import './SubMenuItems.css';

interface Props {
  variables: TypedVariableModel[];
  readOnly?: boolean;
}

export const SubMenuItems = ({ variables, readOnly }: Props) => {
  const [visibleVariables, setVisibleVariables] = useState<TypedVariableModel[]>([]);

  useEffect(() => {
    setVisibleVariables(variables.filter((state) => state.hide !== VariableHide.hideVariable));
  }, [variables]);

  if (visibleVariables.length === 0) {
    return null;
  }

  return (
    <>
      {visibleVariables.map((variable) => (
        <div
          key={variable.id}
          {...mergeStylexProps(stylex.props(styles.submenuItem), { className: 'gf-submenu-item' })}
          data-testid={selectors.pages.Dashboard.SubMenu.submenuItem}
        >
          <PickerRenderer variable={variable} readOnly={readOnly} />
        </div>
      ))}
    </>
  );
};

// The rules for the variable pickers' legacy classes live in SubMenuItems.css.
const styles = stylex.create({
  submenuItem: {
    display: 'inline-block',
  },
});
