import * as stylex from '@stylexjs/stylex';
import { inlineEditStyles } from './InlineEdit.stylex';

import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import Draggable, { type DraggableEventHandler } from 'react-draggable';
import { Resizable, type ResizeCallbackData } from 'react-resizable';

import { type Dimensions2D, type GrafanaTheme2, store } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { IconButton, Portal } from '@grafana/ui';
import { type Scene } from 'app/features/canvas/runtime/scene';

import { InlineEditBody } from './InlineEditBody';

type Props = {
  onClose?: () => void;
  id: number;
  scene: Scene;
};

const OFFSET_X = 10;
const OFFSET_Y = 32;

export function InlineEdit({ onClose, id, scene }: Props) {
  const root = scene.root.div?.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const ref = useRef<HTMLDivElement>(null);
  const inlineEditKey = 'inlineEditPanel' + id.toString();

  const defaultMeasurements = { width: 400, height: 400 };
  const widthOffset = root?.width ?? defaultMeasurements.width + OFFSET_X * 2;
  const defaultX = root?.x ?? 0 + widthOffset - defaultMeasurements.width - OFFSET_X;
  const defaultY = root?.y ?? 0 + OFFSET_Y;

  const savedPlacement = store.getObject(inlineEditKey, {
    x: defaultX,
    y: defaultY,
    w: defaultMeasurements.width,
    h: defaultMeasurements.height,
  });
  const [measurements, setMeasurements] = useState<Dimensions2D>({ width: savedPlacement.w, height: savedPlacement.h });
  const [placement, setPlacement] = useState({ x: savedPlacement.x, y: savedPlacement.y });

  // Checks that placement is within browser window
  useEffect(() => {
    const minX = windowWidth - measurements.width - OFFSET_X;
    const minY = windowHeight - measurements.height - OFFSET_Y;
    if (minX < placement.x && minX > 0) {
      setPlacement({ ...placement, x: minX });
    }
    if (minY < placement.y && minY > 0) {
      setPlacement({ ...placement, y: minY });
    }
  }, [windowHeight, windowWidth, placement, measurements]);

  const onDragStop: DraggableEventHandler = (event, dragElement) => {
    let x = dragElement.x < 0 ? 0 : dragElement.x;
    let y = dragElement.y < 0 ? 0 : dragElement.y;

    setPlacement({ x: x, y: y });
    saveToStore(x, y, measurements.width, measurements.height);
  };

  const onResizeStop = (event: SyntheticEvent<Element, Event>, data: ResizeCallbackData) => {
    const { size } = data;
    setMeasurements({ width: size.width, height: size.height });
    saveToStore(placement.x, placement.y, size.width, size.height);
  };

  const saveToStore = (x: number, y: number, width: number, height: number) => {
    store.setObject(inlineEditKey, { x: x, y: y, w: width, h: height });
  };

  return (
    <Portal>
      <div {...stylex.props(inlineEditStyles.draggableWrapper)}>
        <Draggable handle="strong" onStop={onDragStop} position={{ x: placement.x, y: placement.y }}>
          <Resizable height={measurements.height} width={measurements.width} onResize={onResizeStop}>
            <div
              {...stylex.props(inlineEditStyles.inlineEditorContainer)}
              style={{ height: `${measurements.height}px`, width: `${measurements.width}px` }}
              ref={ref}
            >
              <strong {...stylex.props(inlineEditStyles.inlineEditorHeader)}>
                <div {...stylex.props(inlineEditStyles.placeholder)} />
                <div>
                  <Trans i18nKey="canvas.inline-edit.canvas-inline-editor">Canvas Inline Editor</Trans>
                </div>
                <IconButton
                  name="times"
                  size="xl"
                  {...stylex.props(inlineEditStyles.inlineEditorClose)}
                  onClick={onClose}
                  tooltip={t('canvas.inline-edit.tooltip-close-inline-editor', 'Close inline editor')}
                />
              </strong>
              <div {...stylex.props(inlineEditStyles.inlineEditorContentWrapper)}>
                <div {...stylex.props(inlineEditStyles.inlineEditorContent)}>
                  <InlineEditBody />
                </div>
              </div>
            </div>
          </Resizable>
        </Draggable>
      </div>
    </Portal>
  );
}

