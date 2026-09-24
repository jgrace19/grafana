import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { subMenuStyles } from './SubMenu.stylex';
import { PureComponent } from 'react';
import * as React from 'react';
import { connect, type MapStateToProps } from 'react-redux';

import { type AnnotationQuery, type DataQuery, type TypedVariableModel, type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { type DashboardLink } from '@grafana/schema';
import { type Themeable2, withTheme2 } from '@grafana/ui';
import { type StoreState } from 'app/types/store';

import { getSubMenuVariables, getVariablesState } from '../../../variables/state/selectors';
import { type DashboardModel } from '../../state/DashboardModel';

import { Annotations } from './Annotations';
import { DashboardLinks } from './DashboardLinks';
import { SubMenuItems } from './SubMenuItems';

interface OwnProps extends Themeable2 {
  dashboard: DashboardModel;
  links: DashboardLink[];
  annotations: AnnotationQuery[];
}

interface ConnectedProps {
  variables: TypedVariableModel[];
}

interface DispatchProps {}

type Props = OwnProps & ConnectedProps & DispatchProps;

class SubMenuUnConnected extends PureComponent<Props> {
  onAnnotationStateChanged = (updatedAnnotation: AnnotationQuery<DataQuery>) => {
    // we're mutating dashboard state directly here until annotations are in Redux.
    for (let index = 0; index < this.props.dashboard.annotations.list.length; index++) {
      const annotation = this.props.dashboard.annotations.list[index];
      if (annotation.name === updatedAnnotation.name) {
        annotation.enable = !annotation.enable;
        break;
      }
    }
    this.props.dashboard.startRefresh();
    this.forceUpdate();
  };

  disableSubmitOnEnter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  render() {
    const { dashboard, variables, links, annotations, theme } = this.props;

    const readOnlyVariables = dashboard.meta.isSnapshot ?? false;

    return (
      <div {...stylex.props(subMenuStyles.submenu)}>
        <form
          aria-label={t('dashboard.sub-menu-un-connected.aria-label-template-variables', 'Template variables')}
          {...stylex.props(subMenuStyles.formStyles)}
          onSubmit={this.disableSubmitOnEnter}
        >
          <SubMenuItems variables={variables} readOnly={readOnlyVariables} />
        </form>
        <Annotations
          annotations={annotations}
          onAnnotationChanged={this.onAnnotationStateChanged}
          events={dashboard.events}
        />
        <div {...stylex.props(subMenuStyles.spacer)} />
        {dashboard && <DashboardLinks dashboard={dashboard} links={links} />}
      </div>
    );
  }
}

const mapStateToProps: MapStateToProps<ConnectedProps, OwnProps, StoreState> = (state, ownProps) => {
  const { uid } = ownProps.dashboard;
  const templatingState = getVariablesState(uid, state);
  return {
    variables: getSubMenuVariables(uid, templatingState.variables),
  };
};


export const SubMenu = withTheme2(connect(mapStateToProps)(SubMenuUnConnected));

SubMenu.displayName = 'SubMenu';
