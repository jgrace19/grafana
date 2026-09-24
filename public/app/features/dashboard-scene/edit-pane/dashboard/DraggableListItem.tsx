import { Draggable } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { t } from '@grafana/i18n';
import { Tooltip, Icon } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface DraggableListItemProps {
  draggableId: string;
  index: number;
  children: ReactNode;
}

export function DraggableListItem({ draggableId, index, children }: DraggableListItemProps) {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided) => (
        <li ref={provided.innerRef} {...provided.draggableProps} className={stylex.props(styles.listItem).className}>
          <div {...provided.dragHandleProps} className={stylex.props(styles.dragHandle).className}>
            <Tooltip content={t('dashboard-scene.draggable-item.drag-to-reorder', 'Drag to reorder')} placement="top">
              <Icon name="draggabledots" size="md" />
            </Tooltip>
          </div>
          {children}
        </li>
      )}
    </Draggable>
  );
}

const styles = stylex.create({
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x0-5'],
    paddingTop: spacing['--gf-spacing-x0-25'],
    paddingRight: spacing['--gf-spacing-x0-25'],
    paddingBottom: spacing['--gf-spacing-x0-25'],
    paddingLeft: spacing['--gf-spacing-x0-25'],
  },
  dragHandle: {
    alignSelf: 'stretch',
    // The handle has role="button", and GlobalStyles' [role='button'] pointer won on main until :active.
    cursor: { default: null, ':active': 'grabbing' },
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
  },
});
