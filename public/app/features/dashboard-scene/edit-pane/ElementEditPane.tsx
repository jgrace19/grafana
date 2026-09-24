import * as stylex from '@stylexjs/stylex';

import { ScrollContainer } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { type EditableDashboardElement } from '../scene/types/EditableDashboardElement';

import { type DashboardEditPane } from './DashboardEditPane';
import { EditPaneHeader } from './EditPaneHeader';

export interface Props {
  element: EditableDashboardElement;
  editPane: DashboardEditPane;
  isNewElement: boolean;
}

export function ElementEditPane({ element, editPane, isNewElement }: Props) {
  const categories = element.useEditPaneOptions ? element.useEditPaneOptions(isNewElement) : [];

  return (
    <div {...stylex.props(styles.wrapper)}>
      <EditPaneHeader element={element} editPane={editPane} />
      <ScrollContainer showScrollIndicators={true}>
        <div {...stylex.props(styles.categories)}>{categories.map((cat) => cat.renderElement())}</div>
      </ScrollContainer>
    </div>
  );
}

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: '100%',
  },
  categories: {
    display: 'flex',
    flexDirection: 'column',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
});
