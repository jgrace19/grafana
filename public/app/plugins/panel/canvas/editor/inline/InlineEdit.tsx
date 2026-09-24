import * as stylex from '@stylexjs/stylex';
import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import Draggable, { type DraggableEventHandler } from 'react-draggable';
import { Resizable, type ResizeCallbackData } from 'react-resizable';

import { type Dimensions2D, store } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { IconButton, Portal } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, components, shadows } from '@grafana/ui/stylex/tokens.stylex';
import { type Scene } from 'app/features/canvas/runtime/scene';

import './InlineEdit.css';
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
      <div {...stylex.props(styles.draggableWrapper)}>
        <Draggable handle="strong" onStop={onDragStop} position={{ x: placement.x, y: placement.y }}>
          <Resizable height={measurements.height} width={measurements.width} onResize={onResizeStop}>
            <div
              {...mergeStylexProps(stylex.props(styles.inlineEditorContainer), {
                style: { height: `${measurements.height}px`, width: `${measurements.width}px` },
              })}
              ref={ref}
            >
              <strong {...stylex.props(styles.inlineEditorHeader)}>
                <div {...stylex.props(styles.placeholder)} />
                <div>
                  <Trans i18nKey="canvas.inline-edit.canvas-inline-editor">Canvas Inline Editor</Trans>
                </div>
                <IconButton
                  name="times"
                  size="xl"
                  className="gf-canvas-inline-editor-close"
                  onClick={onClose}
                  tooltip={t('canvas.inline-edit.tooltip-close-inline-editor', 'Close inline editor')}
                />
              </strong>
              <div {...stylex.props(styles.inlineEditorContentWrapper)}>
                <div {...stylex.props(styles.inlineEditorContent)}>
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

const styles = stylex.create({
  inlineEditorContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: components['--gf-components-panel-background'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    boxShadow: shadows['--gf-shadows-z3'],
    zIndex: 1000,
    opacity: 1,
    minWidth: '400px',
  },
  draggableWrapper: {
    width: 0,
    height: 0,
  },
  inlineEditorHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors['--gf-colors-background-canvas'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    height: '40px',
    cursor: 'move',
  },
  inlineEditorContent: {
    whiteSpace: 'pre-wrap',
    padding: '10px',
  },
  placeholder: {
    width: '24px',
    height: '24px',
    visibility: 'hidden',
    marginRight: 'auto',
  },
  inlineEditorContentWrapper: {
    overflow: 'scroll',
  },
});
