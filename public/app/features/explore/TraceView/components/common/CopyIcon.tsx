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
import { useState } from 'react';

import { t } from '@grafana/i18n';
import { Button, type IconName, Tooltip } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

type PropsType = {
  className?: string;
  copyText: string;
  icon?: IconName;
  tooltipTitle: string;
};

export default function CopyIcon({ copyText, icon = 'copy', tooltipTitle }: PropsType) {
  const [hasCopied, setHasCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(copyText);
    setHasCopied(true);
  };

  return (
    <Tooltip content={hasCopied ? t('explore.trace-view.tooltip-copy-icon', 'Copied') : tooltipTitle}>
      <Button
        aria-label={t('explore.trace-view.aria-label-copy', 'Copy to clipboard')}
        xstyle={styles.button}
        type="button"
        icon={icon}
        onClick={handleClick}
      />
    </Tooltip>
  );
}

const styles = stylex.create({
  // Over Button's primary solid look: its :hover and :active values beat the base override on main, and the
  // override's :focus came after them.
  button: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-primary-shade'],
      ':active': { default: colors['--gf-colors-primary-main'], ':focus': 'rgba(255, 255, 255, 0.25)' },
      ':focus': 'rgba(255, 255, 255, 0.25)',
    },
    borderStyle: 'none',
    color: { default: 'inherit', ':hover': colors['--gf-colors-primary-contrast-text'], ':focus': 'inherit' },
    overflow: 'hidden',
  },
});
