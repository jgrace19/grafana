import { css } from '@emotion/css';
import { useEffect, useMemo, useRef, useState } from 'react';

import { EventBusSrv, getTimeZone } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { stopQueryState } from 'app/core/utils/explore';
import { useSelector } from 'app/types/store';

import Explore from './Explore';
import ExploreQueryInspector from './ExploreQueryInspector';
import { getExploreItemSelector } from './state/selectors';

const containerStyles = css({
  label: 'explorePaneContainer',
  display: 'flex',
  flexDirection: 'column',
  minWidth: '600px',
  height: '100%',
});

interface Props {
  exploreId: string;
}

export function ExplorePaneContainer({ exploreId }: Props) {
  useStopQueries(exploreId);
  const eventBus = useRef(new EventBusSrv());
  const ref = useRef(null);
  const [showQueryInspector, setShowQueryInspector] = useState(false);

  useEffect(() => {
    const bus = eventBus.current;
    return () => bus.removeAllListeners();
  }, []);

  return (
    <div className={containerStyles} ref={ref} data-testid={selectors.pages.Explore.General.container}>
      <Explore
        exploreId={exploreId}
        eventBus={eventBus.current}
        showQueryInspector={showQueryInspector}
        setShowQueryInspector={setShowQueryInspector}
      />
      {showQueryInspector && (
        <ExploreQueryInspector
          exploreId={exploreId}
          onClose={() => setShowQueryInspector(false)}
          timeZone={getTimeZone()}
        />
      )}
    </div>
  );
}

function useStopQueries(exploreId: string) {
  const paneSelector = useMemo(() => getExploreItemSelector(exploreId), [exploreId]);
  const paneRef = useRef<ReturnType<typeof paneSelector>>(undefined);
  paneRef.current = useSelector(paneSelector);

  useEffect(() => {
    return () => {
      stopQueryState(paneRef.current?.querySubscription);
    };
  }, []);
}
