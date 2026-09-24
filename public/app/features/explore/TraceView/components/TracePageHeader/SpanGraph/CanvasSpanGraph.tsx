// Copyright (c) 2017 Uber Technologies, Inc.
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
import { memo, useCallback, useEffect, useRef } from 'react';

import { useTheme2 } from '@grafana/ui';

import { autoColor } from '../../Theme';
import { traceColors } from '../../traceColors.stylex';
import { getRgbColorByKey } from '../../utils/color-generator';

import renderIntoCanvas from './render-into-canvas';

type CanvasSpanGraphProps = {
  items: Array<{ valueWidth: number; valueOffset: number; serviceName: string }>;
  valueWidth: number;
};

export const CanvasSpanGraph = memo(function CanvasSpanGraph({
  items,
  valueWidth: totalValueWidth,
}: CanvasSpanGraphProps) {
  const theme = useTheme2();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback(() => {
    if (canvasRef.current) {
      const getColor = (key: string) => getRgbColorByKey(key, theme);
      renderIntoCanvas(canvasRef.current, items, totalValueWidth, getColor, autoColor(theme, '#fff'));
    }
  }, [items, totalValueWidth, theme]);

  useEffect(() => {
    draw();
  });

  return <canvas {...stylex.props(styles.CanvasSpanGraph)} ref={canvasRef} data-testid="CanvasSpanGraph" />;
});

export default CanvasSpanGraph;

const styles = stylex.create({
  CanvasSpanGraph: {
    backgroundColor: traceColors['--gf-trace-fafafa'],
    height: '60px',
    position: 'absolute',
    width: '100%',
    imageRendering: 'crisp-edges',
  },
});
