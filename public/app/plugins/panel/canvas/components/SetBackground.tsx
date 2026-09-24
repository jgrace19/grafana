import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { ResourceDimensionMode } from '@grafana/schema';
import { Portal } from '@grafana/ui';
import { type Scene } from 'app/features/canvas/runtime/scene';
import { ResourcePickerPopover } from 'app/features/dimensions/editors/ResourcePickerPopover';
import { MediaType, ResourceFolderName } from 'app/features/dimensions/types';

import { type AnchorPoint } from '../types';

type Props = {
  onClose: () => void;
  scene: Scene;
  anchorPoint: AnchorPoint;
};

export function SetBackground({ onClose, scene, anchorPoint }: Props) {
  const defaultValue = scene.root.options.background?.image?.fixed ?? '';

  const [bgImage, setBgImage] = useState(defaultValue);

  const onChange = (value: string | undefined) => {
    if (value) {
      setBgImage(value);
      if (scene.root) {
        scene.root.options.background = {
          ...scene.root.options.background,
          image: { mode: ResourceDimensionMode.Fixed, fixed: value },
        };
        scene.revId++;
        scene.save();

        scene.root.reinitializeMoveable();
      }

      // Force a re-render (update scene data after config update)
      if (scene) {
        scene.updateData(scene.data!);
      }
    }

    onClose();
  };

  return (
    // Portal only takes a class name, set once, so the anchor position goes on an inner wrapper. The portal node
    // ignores the pointer so only the translated picker is interactive, as when the node itself was translated.
    <Portal className={stylex.props(styles.portalWrapper).className}>
      <div {...stylex.props(styles.picker(`translate(${anchorPoint.x}px, ${anchorPoint.y - 200}px)`))}>
        <ResourcePickerPopover
          onChange={onChange}
          value={bgImage}
          mediaType={MediaType.Image}
          folderName={ResourceFolderName.IOT}
        />
      </div>
    </Portal>
  );
}

const styles = stylex.create({
  portalWrapper: {
    width: '315px',
    height: '445px',
    pointerEvents: 'none',
  },
  picker: (transform: string) => ({
    height: '100%',
    pointerEvents: 'auto',
    transform,
  }),
});
