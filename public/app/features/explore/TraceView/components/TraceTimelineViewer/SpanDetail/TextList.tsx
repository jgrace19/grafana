import clsx from 'clsx';
// Copyright (c) 2019 Uber Technologies, Inc.
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
import { textListStyles } from './TextList.stylex';
import cx from 'classnames';



type TextListProps = {
  data: string[];
};

export default function TextList(props: TextListProps) {
  const { data } = props;
  return (
    <div {...mergeStylexClassName(stylex.props(textListStyles.TextList, ), undefined)} data-testid="TextList">
      <ul {...stylex.props(textListStyles.List)}>
        {data.map((row, i) => {
          return (
            // `i` is necessary in the key because row.key can repeat
            <li {...stylex.props(textListStyles.item)} key={`${i}`}>
              {row}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
