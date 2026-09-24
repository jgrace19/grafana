import * as stylex from '@stylexjs/stylex';
import { partListSectionStyles } from './PartListSection.stylex';

import { Fragment, useMemo, type JSX } from 'react';

import { AccessoryButton } from '@grafana/plugin-ui';
import { useTheme2 } from '@grafana/ui';

import { toSelectableValue } from '../utils/toSelectableValue';
import { unwrap } from '../utils/unwrap';

import { AddButton } from './AddButton';
import { Seg } from './Seg';

export type PartParams = Array<{
  value: string;
  options: (() => Promise<string[]>) | null;
}>;

type Props = {
  parts: Array<{
    name: string;
    params: PartParams;
  }>;
  getNewPartOptions: () => Promise<SelectableValue[]>;
  onChange: (partIndex: number, paramValues: string[]) => void;
  onRemovePart: (index: number) => void;
  onAddNewPart: (type: string) => void;
};


type PartProps = {
  name: string;
  params: PartParams;
  onRemove: () => void;
  onChange: (paramValues: string[]) => void;
};


const getPartClass = (theme: GrafanaTheme2) => {
  return clsx(
    'gf-form-label',
    css({
      paddingLeft: '0',
      // gf-form-label class makes certain css attributes incorrect
      // for the selectbox-dropdown, so we have to "reset" them back
      lineHeight: theme.typography.body.lineHeight,
      fontSize: theme.typography.body.fontSize,
    })
  );
};

const Part = ({ name, params, onChange }: PartProps): JSX.Element => {
  const theme = useTheme2();
  const partClass = useMemo(() => getPartClass(theme), [theme]);

  const onParamChange = (par: string, i: number) => {
    const newParams = params.map((p) => p.value);
    newParams[i] = par;
    onChange(newParams);
  };
  return (
    <div className={partClass}>
      <button {...stylex.props(partListSectionStyles.noRightMarginPaddingClass)}>{name}</button>(
      {params.map((p, i) => {
        const { value, options } = p;
        const isLast = i === params.length - 1;
        const loadOptions =
          options !== null ? () => options().then((items) => items.map(toSelectableValue)) : undefined;
        return (
          <Fragment key={i}>
            <Seg
              allowCustomValue
              value={value}
              buttonClassName={noHorizMarginPaddingClass}
              loadOptions={loadOptions}
              onChange={(v) => {
                onParamChange(unwrap(v.value), i);
              }}
            />
            {!isLast && ','}
          </Fragment>
        );
      })}
      )
    </div>
  );
};

export const PartListSection = ({
  parts,
  getNewPartOptions,
  onAddNewPart,
  onRemovePart,
  onChange,
}: Props): JSX.Element => {
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          <Part
            name={part.name}
            params={part.params}
            onRemove={() => {
              onRemovePart(index);
            }}
            onChange={(pars) => {
              onChange(index, pars);
            }}
          />
          <AccessoryButton
            style={{ marginRight: '4px' }}
            aria-label="remove"
            icon="times"
            variant="secondary"
            onClick={() => {
              onRemovePart(index);
            }}
          />
        </Fragment>
      ))}
      <AddButton loadOptions={getNewPartOptions} onAdd={onAddNewPart} />
    </>
  );
};
