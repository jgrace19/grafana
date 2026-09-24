import * as stylex from '@stylexjs/stylex';
import { PureComponent } from 'react';
import * as React from 'react';
import { connect, type MapStateToProps } from 'react-redux';

import { type AnnotationQuery, type DataQuery, type TypedVariableModel } from '@grafana/data';
import { t } from '@grafana/i18n';
import { type DashboardLink } from '@grafana/schema';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type StoreState } from 'app/types/store';

import { getSubMenuVariables, getVariablesState } from '../../../variables/state/selectors';
import { type DashboardModel } from '../../state/DashboardModel';

import { Annotations } from './Annotations';
import { DashboardLinks } from './DashboardLinks';
import { SubMenuItems } from './SubMenuItems';

interface OwnProps {
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
    const { dashboard, variables, links, annotations } = this.props;

    const readOnlyVariables = dashboard.meta.isSnapshot ?? false;

    return (
      <div {...stylex.props(styles.submenu)}>
        <form
          aria-label={t('dashboard.sub-menu-un-connected.aria-label-template-variables', 'Template variables')}
          {...stylex.props(styles.formStyles)}
          onSubmit={this.disableSubmitOnEnter}
        >
          <SubMenuItems variables={variables} readOnly={readOnlyVariables} />
        </form>
        <Annotations
          annotations={annotations}
          onAnnotationChanged={this.onAnnotationStateChanged}
          events={dashboard.events}
        />
        <div {...stylex.props(styles.spacer)} />
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

const styles = stylex.create({
  formStyles: {
    display: 'contents',
    flexWrap: 'wrap',
  },
  submenu: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    rowGap: spacing['--gf-spacing-x1'],
    columnGap: spacing['--gf-spacing-x2'],
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: 0,
  },
  spacer: {
    flexGrow: 1,
  },
});

export const SubMenu = connect(mapStateToProps)(SubMenuUnConnected);

SubMenu.displayName = 'SubMenu';
