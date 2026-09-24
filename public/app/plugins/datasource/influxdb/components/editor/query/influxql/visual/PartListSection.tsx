import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import { Fragment, type JSX } from 'react';

import { type SelectableValue } from '@grafana/data';
import { AccessoryButton } from '@grafana/plugin-ui';
import { typography } from '@grafana/ui/stylex/tokens.stylex';

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

// stylex: pending InlineLabel migration. Seg passes this to InlineLabel, which sets its own padding and margin in
// Emotion that beat a StyleX override.
const noHorizMarginPaddingClass = css({
  paddingLeft: '0',
  paddingRight: '0',
  marginLeft: '0',
  marginRight: '0',
});

const Part = ({ name, params, onChange }: PartProps): JSX.Element => {
  const onParamChange = (par: string, i: number) => {
    const newParams = params.map((p) => p.value);
    newParams[i] = par;
    onChange(newParams);
  };
  return (
    <div className={`gf-form-label ${stylex.props(styles.part).className}`}>
      <button className={`gf-form-label ${stylex.props(styles.noRightMarginPadding).className}`}>{name}</button>(
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

const styles = stylex.create({
  noRightMarginPadding: {
    paddingRight: '0',
    marginRight: '0',
  },
  part: {
    paddingLeft: '0',
    // gf-form-label class makes certain css attributes incorrect
    // for the selectbox-dropdown, so we have to "reset" them back
    lineHeight: typography['--gf-typography-body-line-height'],
    fontSize: typography['--gf-typography-body-font-size'],
  },
});
