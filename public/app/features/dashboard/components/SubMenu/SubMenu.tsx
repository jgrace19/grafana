import { css } from '@emotion/css';
import { useState } from 'react';
import * as React from 'react';

import { type AnnotationQuery, type DataQuery, type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { type DashboardLink } from '@grafana/schema';
import { useStyles2 } from '@grafana/ui';
import { useSelector } from 'app/types/store';

import { getSubMenuVariables, getVariablesState } from '../../../variables/state/selectors';
import { type DashboardModel } from '../../state/DashboardModel';

import { Annotations } from './Annotations';
import { DashboardLinks } from './DashboardLinks';
import { SubMenuItems } from './SubMenuItems';

interface Props {
  dashboard: DashboardModel;
  links: DashboardLink[];
  annotations: AnnotationQuery[];
}

export function SubMenu({ dashboard, links, annotations }: Props) {
  const styles = useStyles2(getStyles);
  const [, setRenderCount] = useState(0);

  const variables = useSelector((state) => {
    const { uid } = dashboard;
    const templatingState = getVariablesState(uid, state);
    return getSubMenuVariables(uid, templatingState.variables);
  });

  const onAnnotationStateChanged = (updatedAnnotation: AnnotationQuery<DataQuery>) => {
    for (let index = 0; index < dashboard.annotations.list.length; index++) {
      const annotation = dashboard.annotations.list[index];
      if (annotation.name === updatedAnnotation.name) {
        annotation.enable = !annotation.enable;
        break;
      }
    }
    dashboard.startRefresh();
    setRenderCount((c) => c + 1);
  };

  const disableSubmitOnEnter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const readOnlyVariables = dashboard.meta.isSnapshot ?? false;

  return (
    <div className={styles.submenu}>
      <form
        aria-label={t('dashboard.sub-menu-un-connected.aria-label-template-variables', 'Template variables')}
        className={styles.formStyles}
        onSubmit={disableSubmitOnEnter}
      >
        <SubMenuItems variables={variables} readOnly={readOnlyVariables} />
      </form>
      <Annotations
        annotations={annotations}
        onAnnotationChanged={onAnnotationStateChanged}
        events={dashboard.events}
      />
      <div className={styles.spacer} />
      {dashboard && <DashboardLinks dashboard={dashboard} links={links} />}
    </div>
  );
}

SubMenu.displayName = 'SubMenu';

const getStyles = (theme: GrafanaTheme2) => ({
  formStyles: css({
    display: 'contents',
    flexWrap: 'wrap',
  }),
  submenu: css({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    gap: `${theme.spacing(1)} ${theme.spacing(2)}`,
    padding: `0 0 ${theme.spacing(1)} 0`,
  }),
  spacer: css({
    flexGrow: 1,
  }),
});
