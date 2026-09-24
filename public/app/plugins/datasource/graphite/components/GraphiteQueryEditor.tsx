import * as stylex from '@stylexjs/stylex';
import { graphiteQueryEditorStyles } from './GraphiteQueryEditor.stylex';

import { Button } from '@grafana/ui';

import { actions } from '../state/actions';
import {
  GraphiteQueryEditorContext,
  type GraphiteQueryEditorProps,
  useDispatch,
  useGraphiteState,
} from '../state/context';

import { FunctionsSection } from './FunctionsSection';
import { GraphiteTextEditor } from './GraphiteTextEditor';
import { SeriesSection } from './SeriesSection';

export function GraphiteQueryEditor({
  datasource,
  onRunQuery,
  onChange,
  query,
  range,
  queries,
}: GraphiteQueryEditorProps) {
  return (
    <GraphiteQueryEditorContext
      datasource={datasource}
      onRunQuery={onRunQuery}
      onChange={onChange}
      query={query}
      queries={queries}
      range={range}
    >
      <GraphiteQueryEditorContent />
    </GraphiteQueryEditorContext>
  );
}

function GraphiteQueryEditorContent() {
  const dispatch = useDispatch();
  const state = useGraphiteState();

  return (
    <div {...stylex.props(graphiteQueryEditorStyles.container)}>
      <div {...stylex.props(graphiteQueryEditorStyles.visualEditor)}>
        {state.target?.textEditor && <GraphiteTextEditor rawQuery={state.target.target} />}
        {!state.target?.textEditor && (
          <>
            <SeriesSection state={state} />
            <FunctionsSection functions={state.queryModel?.functions} funcDefs={state.funcDefs!} />
          </>
        )}
      </div>
      <Button
        {...stylex.props(graphiteQueryEditorStyles.toggleButton)}
        icon="pen"
        variant="secondary"
        aria-label="Toggle editor mode"
        tooltip={state?.queryModel?.error}
        onClick={() => {
          dispatch(actions.toggleEditorMode());
        }}
      />
    </div>
  );
}

