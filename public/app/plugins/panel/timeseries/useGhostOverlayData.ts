import { useEffect, useRef, useState } from 'react';
import { from, type Observable, type Subscription } from 'rxjs';

import {
  type DataFrame,
  type DataQueryResponse,
  dateTime,
  type Field,
  FieldType,
  type PanelData,
  rangeUtil,
  type TimeRange,
} from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';

import { type GhostOverlayOptions } from './panelcfg.gen';

function getCompareRefId(refId: string): string {
  return `${refId}-compare`;
}

function formatOffsetLabel(offset: string): string {
  const map: Record<string, string> = {
    '1d': '1d ago',
    '7d': '7d ago',
    '30d': '30d ago',
  };
  return map[offset] ?? `${offset} ago`;
}

function processGhostFrames(
  rawFrames: DataFrame[],
  offsetMs: number,
  opacity: number,
  offset: string
): DataFrame[] {
  const label = formatOffsetLabel(offset);
  return rawFrames.map((frame) => ({
    ...frame,
    refId: getCompareRefId(frame.refId ?? ''),
    fields: frame.fields.map((field: Field) => {
      if (field.type === FieldType.time) {
        return field;
      }
      const displayName = field.config?.displayNameFromDS ?? field.name;
      return {
        ...field,
        config: {
          ...(field.config ?? {}),
          displayNameFromDS: `${displayName} (${label})`,
          custom: {
            ...(field.config?.custom ?? {}),
            lineStyle: { fill: 'dash', dash: [5, 5] },
            fillOpacity: Math.round(opacity * 0.3),
            ghostOverlayOpacity: opacity / 100,
          },
        },
      };
    }),
    meta: {
      ...frame.meta,
      timeCompare: {
        diffMs: offsetMs,
        isTimeShiftQuery: true,
      },
      custom: {
        ...(frame.meta?.custom ?? {}),
        isGhostOverlay: true,
        ghostOpacity: opacity,
      },
    },
  }));
}

export function useGhostOverlayData(
  data: PanelData,
  timeRange: TimeRange,
  ghostOverlay: GhostOverlayOptions | undefined
): DataFrame[] {
  const [ghostFrames, setGhostFrames] = useState<DataFrame[]>([]);
  const subscriptionRef = useRef<Subscription | null>(null);

  const enabled = ghostOverlay?.enabled ?? false;
  const offset = ghostOverlay?.offset ?? '1d';
  const fromMs = timeRange.from.valueOf();
  const toMs = timeRange.to.valueOf();
  const requestId = data.request?.requestId;

  useEffect(() => {
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;

    if (!enabled || !data.request?.targets?.length) {
      setGhostFrames([]);
      return;
    }

    let offsetMs: number;
    try {
      offsetMs = rangeUtil.intervalToMs(offset);
    } catch {
      setGhostFrames([]);
      return;
    }

    if (offsetMs <= 0) {
      setGhostFrames([]);
      return;
    }

    const shiftedRange: TimeRange = {
      from: dateTime(fromMs - offsetMs),
      to: dateTime(toMs - offsetMs),
      raw: {
        from: dateTime(fromMs - offsetMs),
        to: dateTime(toMs - offsetMs),
      },
    };

    const request = {
      ...data.request!,
      range: shiftedRange,
      requestId: `${data.request!.requestId}-ghost-overlay`,
    };

    let cancelled = false;

    (async () => {
      try {
        const dsRef = data.request!.targets[0].datasource;
        const ds = await getDataSourceSrv().get(dsRef);

        const result = ds.query(request);
        const obs: Observable<DataQueryResponse> = 'then' in result ? from(result) : result;
        subscriptionRef.current = obs.subscribe({
          next: (response: DataQueryResponse) => {
            if (!cancelled) {
              setGhostFrames(processGhostFrames(response.data as DataFrame[], offsetMs, ghostOverlay?.opacity ?? 30, offset));
            }
          },
          error: (err: unknown) => {
            if (!cancelled) {
              console.error('Ghost overlay query failed:', err);
              setGhostFrames([]);
            }
          },
        });
      } catch (err) {
        if (!cancelled) {
          console.error('Ghost overlay data source load failed:', err);
          setGhostFrames([]);
        }
      }
    })();

    return () => {
      cancelled = true;
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, offset, fromMs, toMs, requestId]);

  return ghostFrames;
}
