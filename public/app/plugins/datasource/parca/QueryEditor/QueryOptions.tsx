import * as stylex from '@stylexjs/stylex';
import { queryOptionsStyles } from './QueryOptions.stylex';

import { useToggle } from 'react-use';

import { CoreApp, type GrafanaTheme2 } from '@grafana/data';
import { Icon, RadioButtonGroup, Field, clearButtonStyles, Button } from '@grafana/ui';

import { type Query } from '../types';

import { Stack } from './Stack';

export interface Props {
  query: Query;
  onQueryTypeChange: (val: Query['queryType']) => void;
  app?: CoreApp;
}

const rangeOptions: Array<{ value: Query['queryType']; label: string; description: string }> = [
  { value: 'metrics', label: 'Metric', description: 'Return aggregated metrics' },
  { value: 'profile', label: 'Profile', description: 'Return profile' },
  { value: 'both', label: 'Both', description: 'Return both metric and profile data' },
];

function getOptions(app?: CoreApp) {
  if (app === CoreApp.Explore) {
    return rangeOptions;
  }
  return rangeOptions.filter((option) => option.value !== 'both');
}

/**
 * Base on QueryOptionGroup component from grafana/ui but that is not available yet.
 */
export function QueryOptions({ query, onQueryTypeChange, app }: Props) {
  const [isOpen, toggleOpen] = useToggle(false);
  const options = getOptions(app);
  const buttonStyles = useStyles2(clearButtonStyles);

  return (
    <Stack gap={0} direction="column">
      <Button className={mergeStylexClassName(stylex.props(queryOptionsStyles.header), clsx( buttonStyles)} onClick={toggleOpen} title="Click to edit options">
        <div {...stylex.props(queryOptionsStyles.toggle)}>
          <Icon name={isOpen ? 'angle-down' : 'angle-right'} />
        </div>
        <h6 {...stylex.props(queryOptionsStyles.title)}>Options</h6>
        {!isOpen && (
          <div {...stylex.props(queryOptionsStyles.description)}>
            <span>Type: {query.queryType}</span>
          </div>
        )}
      </Button>
      {isOpen && (
        <div {...stylex.props(queryOptionsStyles.body)}>
          <Field label={'Query Type'}>
            <RadioButtonGroup options={options} value={query.queryType} onChange={onQueryTypeChange} />
          </Field>
        </div>
      )}
    </Stack>
  );
}

;
