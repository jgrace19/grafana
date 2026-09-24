import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { elementEditPaneStyles } from './ElementEditPane.stylex';

import {ScrollContainer} from '@grafana/ui';

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
    <div {...stylex.props(elementEditPaneStyles.wrapper)}>
      <EditPaneHeader element={element} editPane={editPane} />
      <ScrollContainer showScrollIndicators={true}>
        <div {...stylex.props(elementEditPaneStyles.categories)}>{categories.map((cat) => cat.renderElement())}</div>
      </ScrollContainer>
    </div>
  );
}


