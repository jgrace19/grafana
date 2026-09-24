import * as stylex from '@stylexjs/stylex';
import { addGraphiteFunctionStyles } from './AddGraphiteFunction.stylex';

import { useEffect, useMemo, useState } from 'react';

import { Button, Segment } from '@grafana/ui';

import { type FuncDefs } from '../gfunc';
import { actions } from '../state/actions';
import { useDispatch } from '../state/context';

import { mapFuncDefsToSelectables } from './helpers';

type Props = {
  funcDefs: FuncDefs;
};

export function AddGraphiteFunction({ funcDefs }: Props) {
  const dispatch = useDispatch();
  const [value, setValue] = useState<SelectableValue<string> | undefined>(undefined);

  const options = useMemo(() => mapFuncDefsToSelectables(funcDefs), [funcDefs]);

  // Note: actions.addFunction will add a component that will have a dropdown or input in auto-focus
  // (the first param of the function). This auto-focus will cause onBlur() on AddGraphiteFunction's
  // Segment component and trigger onChange once again. (why? we call onChange if the user dismissed
  // the dropdown, see: SegmentSelect.onCloseMenu for more details). To avoid it we need to wait for
  // the Segment to disappear first (hence useEffect) and then dispatch the action that will add new
  // components.
  useEffect(() => {
    if (value?.value !== undefined) {
      dispatch(actions.addFunction({ name: value.value }));
      setValue(undefined);
    }
  }, [value, dispatch]);

  return (
    <div>
      <Segment
        Component={
          <Button icon="plus" variant="secondary" className={clsx(styles.button)} aria-label="Add new function" />
        }
        options={options}
        onChange={setValue}
        inputMinWidth={150}
      />
    </div>
  );
}

