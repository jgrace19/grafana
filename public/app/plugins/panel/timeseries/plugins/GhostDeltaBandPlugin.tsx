import { useLayoutEffect, useRef } from 'react';
import uPlot from 'uplot';

import { colorManipulator, type DataFrame } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { type UPlotConfigBuilder } from '@grafana/ui/internal';

interface GhostDeltaBandPluginProps {
  config: UPlotConfigBuilder;
  frame: DataFrame;
}

export const GhostDeltaBandPlugin = ({ config, frame }: GhostDeltaBandPluginProps) => {
  const theme = useTheme2();
  const configRef = useRef(config);
  configRef.current = config;

  useLayoutEffect(() => {
    const greenFill = colorManipulator.alpha(theme.visualization.getColorByName('green'), 0.08);
    const redFill = colorManipulator.alpha(theme.visualization.getColorByName('red'), 0.08);

    config.addHook('draw', (u: uPlot) => {
      const { ctx } = u;
      const xData = u.data[0];

      if (!xData || xData.length < 2) {
        return;
      }

      const seriesCount = u.series.length;
      const ghostPairs: Array<{ currentIdx: number; ghostIdx: number }> = [];

      for (let i = 1; i < seriesCount; i++) {
        const field = frame.fields[i];
        if (field?.state?.ghostOverlayOpacity != null) {
          const currentIdx = i - Math.floor((seriesCount - 1) / 2);
          if (currentIdx >= 1 && currentIdx < i) {
            ghostPairs.push({ currentIdx, ghostIdx: i });
          }
        }
      }

      if (ghostPairs.length === 0) {
        return;
      }

      ctx.save();

      for (const { currentIdx, ghostIdx } of ghostPairs) {
        const currentData = u.data[currentIdx];
        const ghostData = u.data[ghostIdx];

        if (!currentData || !ghostData) {
          continue;
        }

        for (let j = 0; j < xData.length - 1; j++) {
          const cv = currentData[j];
          const gv = ghostData[j];
          const cvNext = currentData[j + 1];
          const gvNext = ghostData[j + 1];

          if (cv == null || gv == null || cvNext == null || gvNext == null) {
            continue;
          }

          const x0 = Math.round(u.valToPos(xData[j], 'x', true));
          const x1 = Math.round(u.valToPos(xData[j + 1], 'x', true));

          const scale = u.series[currentIdx].scale!;

          const cy0 = Math.round(u.valToPos(cv, scale, true));
          const cy1 = Math.round(u.valToPos(cvNext, scale, true));
          const gy0 = Math.round(u.valToPos(gv, scale, true));
          const gy1 = Math.round(u.valToPos(gvNext, scale, true));

          ctx.beginPath();
          ctx.moveTo(x0, cy0);
          ctx.lineTo(x1, cy1);
          ctx.lineTo(x1, gy1);
          ctx.lineTo(x0, gy0);
          ctx.closePath();

          ctx.fillStyle = cv >= gv ? greenFill : redFill;
          ctx.fill();
        }
      }

      ctx.restore();
    });
  }, [config, frame, theme]);

  return null;
};

GhostDeltaBandPlugin.displayName = 'GhostDeltaBandPlugin';
