import { BehaviorSubject } from 'rxjs';

import { dateMath, dateTime, type TimeRange } from '@grafana/data';

// target is 20hz (50ms), but we poll at 100ms to smooth out jitter
const interval = 100;

export interface LiveTimerListener {
  liveTimeChanged: (liveTime: TimeRange) => void;
  isInView?: boolean;
  width?: number;
}

interface LiveListenerEntry {
  last: number;
  intervalMs: number;
  listener: LiveTimerListener;
}

class LiveTimer {
  entries: LiveListenerEntry[] = [];

  budget = 1;
  threshold = 1.5; // trial and error appears about right
  ok = new BehaviorSubject(true);
  lastUpdate = Date.now();

  isLive = false; // the dashboard time range ends in "now"
  timeRange?: TimeRange;
  liveTimeOffset = 0;

  /** Called when the dashboard time range changes */
  setLiveTimeRange(v?: TimeRange) {
    this.timeRange = v;
    this.isLive = v?.raw?.to === 'now';

    if (this.isLive) {
      const from = dateMath.parse(v!.raw.from, false)?.valueOf()!;
      const to = dateMath.parse(v!.raw.to, true)?.valueOf()!;
      this.liveTimeOffset = to - from;

      for (const entry of this.entries) {
        entry.intervalMs = getLiveTimerInterval(this.liveTimeOffset, entry.listener.width ?? 1000);
      }
    }
  }

  listen(listener: LiveTimerListener) {
    this.entries.push({
      last: this.lastUpdate,
      listener,
      intervalMs: getLiveTimerInterval(
        60000, // 1min
        listener.width ?? 1000
      ),
    });
  }

  remove(listener: LiveTimerListener) {
    this.entries = this.entries.filter((v) => v.listener !== listener);
  }

  updateInterval(listener: LiveTimerListener) {
    if (!this.timeRange || !this.isLive) {
      return;
    }
    for (const entry of this.entries) {
      if (entry.listener === listener) {
        entry.intervalMs = getLiveTimerInterval(this.liveTimeOffset, entry.listener.width ?? 1000);
        return;
      }
    }
  }

  // Called at the consistent dashboard interval
  measure = () => {
    const now = Date.now();
    this.budget = (now - this.lastUpdate) / interval;

    const oldOk = this.ok.getValue();
    const newOk = this.budget <= this.threshold;
    if (oldOk !== newOk) {
      this.ok.next(newOk);
    }
    this.lastUpdate = now;

    // For live dashboards, listen to changes
    if (this.isLive && this.ok.getValue() && this.timeRange) {
      let tr: TimeRange | undefined = undefined;
      for (const entry of this.entries) {
        if (entry.listener.isInView === false) {
          continue;
        }

        const elapsed = now - entry.last;
        if (elapsed >= entry.intervalMs) {
          if (!tr) {
            const { raw } = this.timeRange;
            tr = {
              raw,
              from: dateTime(now - this.liveTimeOffset),
              to: dateTime(now),
            };
          }
          entry.listener.liveTimeChanged(tr);
          entry.last = now;
        }
      }
    }
  };

  /** @deprecated Use entries instead */
  get listeners() {
    return this.entries;
  }
}

const FIVE_MINS = 5 * 60 * 1000;

export function getLiveTimerInterval(delta: number, width: number): number {
  const millisPerPixel = Math.ceil(delta / width / 100) * 100;
  if (millisPerPixel > FIVE_MINS) {
    return FIVE_MINS;
  }
  return millisPerPixel;
}

export const liveTimer = new LiveTimer();
setInterval(liveTimer.measure, interval);
