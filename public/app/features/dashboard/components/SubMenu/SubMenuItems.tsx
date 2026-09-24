import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { subMenuItemsStyles } from './SubMenuItems.stylex';
import { useEffect, useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';

import { PickerRenderer } from '../../../variables/pickers/PickerRenderer';

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
          {...stylex.props(subMenuItemsStyles.submenuItem)}
          data-testid={selectors.pages.Dashboard.SubMenu.submenuItem}
        >
          <PickerRenderer variable={variable} readOnly={readOnly} />
        </div>
      ))}
    </>
  );
};

