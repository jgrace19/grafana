// Copyright (c) 2018 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { tracePageSearchBarStyles } from './TracePageSearchBar.stylex';
import { memo, type Dispatch, type SetStateAction } from 'react';

import { t } from '@grafana/i18n';
import { InlineSwitch, useStyles2 } from '@grafana/ui';

import { type Trace } from '../../types/trace';

import NextPrevResult from './NextPrevResult';

export type TracePageSearchBarProps = {
  trace: Trace;
  search: TraceSearchProps;
  spanFilterMatches: Set<string> | undefined;
  setShowSpanFilterMatchesOnly: (showMatchesOnly: boolean) => void;
  focusedSpanIndexForSearch: number;
  setFocusedSpanIndexForSearch: Dispatch<SetStateAction<number>>;
  setFocusedSpanIdForSearch: Dispatch<SetStateAction<string>>;
  datasourceType: string;
  showSpanFilters: boolean;
};

export default memo(function TracePageSearchBar(props: TracePageSearchBarProps) {
  const {
    trace,
    search,
    spanFilterMatches,
    setShowSpanFilterMatchesOnly,
    focusedSpanIndexForSearch,
    setFocusedSpanIndexForSearch,
    setFocusedSpanIdForSearch,
    datasourceType,
    showSpanFilters,
  } = props;

  return (
    <div {...stylex.props(tracePageSearchBarStyles.controls)}>
      <NextPrevResult
        trace={trace}
        spanFilterMatches={spanFilterMatches}
        setFocusedSpanIdForSearch={setFocusedSpanIdForSearch}
        focusedSpanIndexForSearch={focusedSpanIndexForSearch}
        setFocusedSpanIndexForSearch={setFocusedSpanIndexForSearch}
        datasourceType={datasourceType}
        showSpanFilters={showSpanFilters}
      />
      <InlineSwitch
        showLabel={true}
        value={!search.matchesOnly}
        label={t('explore.show-all-spans', 'Show all spans')}
        disabled={!spanFilterMatches?.size}
        {...stylex.props(tracePageSearchBarStyles.switch)}
        onChange={(e) => {
          setShowSpanFilterMatchesOnly(!search.matchesOnly);
        }}
      />
    </div>
  );
});

export ;
