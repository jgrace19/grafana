import * as stylex from '@stylexjs/stylex';
import { type ReactElement } from 'react';

import { Field } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { LibraryPanelCard } from '../../../library-panels/components/LibraryPanelCard/LibraryPanelCard';
import { type LibraryElementDTO } from '../../../library-panels/types';
import { type LibraryPanelInput, LibraryPanelInputState } from '../../types';

interface Props {
  inputs: LibraryPanelInput[];
  label: string;
  description: string;
  folderName?: string;
}

const DEFAULT_FOLDER_NAME = 'Dashboards';

export function LibraryPanelsList({ inputs, label, description, folderName }: Props): ReactElement | null {
  if (!Boolean(inputs?.length)) {
    return null;
  }

  return (
    <div {...stylex.props(styles.spacer)}>
      <Field label={label} description={description} noMargin>
        <>
          {inputs.map((input, index) => {
            const libraryPanelIndex = `elements[${index}]`;
            // For new panels, override folderName in meta; existing panels use model as-is
            const libraryPanel: LibraryElementDTO =
              input.state === LibraryPanelInputState.New && input.model.meta
                ? {
                    ...input.model,
                    meta: {
                      ...input.model.meta,
                      folderName: folderName ?? input.model.meta.folderName ?? DEFAULT_FOLDER_NAME,
                    },
                  }
                : input.model;

            return (
              <div {...stylex.props(styles.item)} key={libraryPanelIndex}>
                <LibraryPanelCard libraryPanel={libraryPanel} onClick={() => undefined} />
              </div>
            );
          })}
        </>
      </Field>
    </div>
  );
}

const styles = stylex.create({
  spacer: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
  item: {
    marginBottom: spacing['--gf-spacing-x1'],
  },
});
