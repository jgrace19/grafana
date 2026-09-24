import * as stylex from '@stylexjs/stylex';
import { tagsInputStyles } from './TagsInput.stylex';

import { useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { AccessoryButton } from '@grafana/plugin-ui';
import { type FetchError } from '@grafana/runtime';

import { type TraceqlFilter, TraceqlSearchScope } from '../dataquery.gen';
import { type TempoDatasource } from '../datasource';

import SearchField from './SearchField';
import { getFilteredTags } from './utils';


interface Props {
  updateFilter: (f: TraceqlFilter) => void;
  deleteFilter: (f: TraceqlFilter) => void;
  generateQueryWithoutFilter: (f?: TraceqlFilter) => string;
  filters: TraceqlFilter[];
  datasource: TempoDatasource;
  setError: (error: FetchError | null) => void;
  staticTags: Array<string | undefined>;
  isTagsLoading: boolean;
  hideValues?: boolean;
  requireTagAndValue?: boolean;
  addVariablesToOptions?: boolean;
  range?: TimeRange;
  timeRangeForTags?: number;
}
const TagsInput = ({
  updateFilter,
  deleteFilter,
  filters,
  datasource,
  setError,
  staticTags,
  isTagsLoading,
  hideValues,
  requireTagAndValue,
  generateQueryWithoutFilter,
  addVariablesToOptions,
  range,
  timeRangeForTags,
}: Props) => {
  const handleOnAdd = useCallback(
    () => updateFilter({ id: generateId(), operator: '=', scope: TraceqlSearchScope.Span }),
    [updateFilter]
  );

  useEffect(() => {
    if (!filters?.length) {
      handleOnAdd();
    }
  }, [filters, handleOnAdd]);

  const getTags = (f: TraceqlFilter) => {
    const tags = datasource.languageProvider.getTags(f.scope);
    return getFilteredTags(tags, staticTags);
  };

  const validInput = (f: TraceqlFilter) => {
    // If value is removed from the filter, it can be set as an empty array
    return requireTagAndValue ? f.tag && f.value && f.value.length > 0 : f.tag;
  };

  return (
    <div {...stylex.props(tagsInputStyles.vertical)}>
      {filters?.map((f, i) => (
        <div {...stylex.props(tagsInputStyles.horizontal)} key={f.id}>
          <SearchField
            filter={f}
            datasource={datasource}
            setError={setError}
            updateFilter={updateFilter}
            tags={getTags(f)}
            isTagsLoading={isTagsLoading}
            hideValue={hideValues}
            query={generateQueryWithoutFilter(f)}
            addVariablesToOptions={addVariablesToOptions}
            range={range}
            timeRangeForTags={timeRangeForTags}
          />
          {(validInput(f) || filters.length > 1) && (
            <AccessoryButton
              aria-label={`Remove tag with ID ${f.id}`}
              variant={'secondary'}
              icon={'times'}
              onClick={() => deleteFilter?.(f)}
              tooltip={'Remove tag'}
            />
          )}
          {validInput(f) && i === filters.length - 1 && (
            <span {...stylex.props(tagsInputStyles.addTag)}>
              <AccessoryButton
                aria-label="Add tag"
                variant={'secondary'}
                icon={'plus'}
                onClick={handleOnAdd}
                tooltip={'Add tag'}
              />
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TagsInput;

export const generateId = () => uuidv4().slice(0, 8);
