import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';

import { Button, ConfirmModal } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type LogGroup } from '../../../dataquery.gen';

type CrossAccountLogsQueryProps = {
  selectedLogGroups?: LogGroup[];
  onChange: (selectedLogGroups: LogGroup[]) => void;
  maxNoOfVisibleLogGroups?: number;
};

const MAX_NO_OF_VISIBLE_LOG_GROUPS = 6;

export const SelectedLogGroups = ({
  selectedLogGroups = [],
  onChange,
  maxNoOfVisibleLogGroups = MAX_NO_OF_VISIBLE_LOG_GROUPS,
}: CrossAccountLogsQueryProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [visibleSelectecLogGroups, setVisibleSelectecLogGroups] = useState(
    selectedLogGroups.slice(0, MAX_NO_OF_VISIBLE_LOG_GROUPS)
  );

  useEffect(() => {
    setVisibleSelectecLogGroups(selectedLogGroups.slice(0, maxNoOfVisibleLogGroups));
  }, [selectedLogGroups, maxNoOfVisibleLogGroups]);

  if (selectedLogGroups.length === 0) {
    return null;
  }

  return (
    <>
      <div {...stylex.props(styles.selectedLogGroupsContainer)}>
        {visibleSelectecLogGroups.map((lg) => (
          <Button
            key={lg.arn}
            size="sm"
            variant="secondary"
            icon="times"
            className={stylex.props(styles.removeButton).className}
            onClick={() => {
              onChange(selectedLogGroups.filter((slg) => slg.arn !== lg.arn));
            }}
          >
            {`${lg.name}${lg.accountLabel ? `(${lg.accountLabel})` : ''}`}
          </Button>
        ))}
        {visibleSelectecLogGroups.length !== selectedLogGroups.length && (
          <Button
            size="sm"
            variant="secondary"
            icon="plus"
            fill="outline"
            className={stylex.props(styles.removeButton).className}
            onClick={() => setVisibleSelectecLogGroups(selectedLogGroups)}
          >
            Show all
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          icon="times"
          fill="outline"
          className={stylex.props(styles.removeButton).className}
          onClick={() => setShowConfirm(true)}
        >
          Clear selection
        </Button>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        title="Clear Log Group Selection"
        body="Are you sure you want to clear all log groups?"
        confirmText="Yes"
        dismissText="No"
        onConfirm={() => {
          setShowConfirm(false);
          onChange([]);
        }}
        onDismiss={() => setShowConfirm(false)}
      />
    </>
  );
};

const styles = stylex.create({
  selectedLogGroupsContainer: {
    marginLeft: spacing['--gf-spacing-x0-5'],
    display: 'flex',
    flexFlow: 'wrap',
    gap: spacing['--gf-spacing-x1'],
  },
  removeButton: {
    marginTop: 'unset',
    marginRight: 'unset',
    marginBottom: 'unset',
    marginLeft: 'unset',
  },
});
