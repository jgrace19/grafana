import * as stylex from '@stylexjs/stylex';
import { capitalize, filter, uniqBy } from 'lodash';
import { useMemo } from 'react';

import { type QueryResultMetaNotice } from '@grafana/data';
import { Badge } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { filterPanelDataToQuery } from 'app/features/query/components/QueryEditorRow';

import { QueryEditorType } from '../../constants';
import { useQueryEditorUIContext, useQueryRunnerContext } from '../QueryEditorContext';

type SeverityType = 'warning' | 'info';

interface SeverityGroup {
  type: SeverityType;
  notices: QueryResultMetaNotice[];
}

interface SeverityBadgeProps {
  type: SeverityType;
  notices: QueryResultMetaNotice[];
}

function SeverityBadge({ type, notices }: SeverityBadgeProps) {
  const color = type === 'warning' ? 'orange' : 'blue';
  const icon = type === 'warning' ? 'exclamation-triangle' : 'info-circle';

  return (
    <Badge
      color={color}
      icon={icon}
      text={notices.length}
      tooltip={
        <div {...stylex.props(styles.noticeContainer)}>
          {capitalize(type)}
          <ol {...stylex.props(styles.noticeList)}>
            {notices.map(({ text }, index) => (
              <li key={index}>{text}</li>
            ))}
          </ol>
        </div>
      }
    />
  );
}

export function WarningBadges() {
  const { data } = useQueryRunnerContext();
  const { selectedQuery, cardType } = useQueryEditorUIContext();
  const queryRefId = selectedQuery?.refId;

  const severityGroups = useMemo<SeverityGroup[]>(() => {
    if (!data || !queryRefId) {
      return [];
    }

    const dataFilteredByRefId = filterPanelDataToQuery(data, queryRefId)?.series ?? [];

    // Collect notices grouped by severity type
    const groups: SeverityGroup[] = [];
    const severityTypes: SeverityType[] = ['warning', 'info'];

    severityTypes.forEach((type) => {
      const allNotices = dataFilteredByRefId.reduce((acc: QueryResultMetaNotice[], series) => {
        if (!series.meta?.notices) {
          return acc;
        }

        const notices = filter(series.meta.notices, (item: QueryResultMetaNotice) => item.severity === type);
        return acc.concat(notices);
      }, []);

      const uniqueNotices = uniqBy(allNotices, 'text');

      if (uniqueNotices.length > 0) {
        groups.push({ type, notices: uniqueNotices });
      }
    });

    return groups;
  }, [data, queryRefId]);

  if (cardType === QueryEditorType.Transformation) {
    return null;
  }

  if (severityGroups.length === 0) {
    return null;
  }

  return severityGroups.map(({ type, notices }) => <SeverityBadge key={type} type={type} notices={notices} />);
}

const styles = stylex.create({
  noticeList: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingLeft: spacing['--gf-spacing-x2'],
  },
  noticeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
});
