import { useEffect, useState } from 'react';

import { AppEvents, LoadingState, type NavModelItem } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { config, locationService, reportInteraction } from '@grafana/runtime';
import { Alert, Button, Spinner, Stack } from '@grafana/ui';
import { appEvents } from 'app/core/app_events';
import { Form } from 'app/core/components/Form/Form';
import { Page } from 'app/core/components/Page/Page';
import { type GrafanaRouteComponentProps } from 'app/core/navigation/types';
import { isRecord } from 'app/core/utils/isRecord';
import { isDashboardV2Spec } from 'app/features/dashboard/api/utils';
import { type StoreState, useDispatch, useSelector } from 'app/types/store';

import { cleanUpAction } from '../../../../core/actions/cleanUp';
import { ExportFormat } from '../../../dashboard/api/types';
import { DashboardSource, type ImportDashboardDTO } from '../../types';
import { GcomDashboardInfo } from '../components/GcomDashboardInfo';
import { ImportForm } from '../components/ImportForm';
import { ImportSourceForm } from '../components/ImportSourceForm';
import { detectExportFormat } from '../utils/inputs';

import {
  clearLoadedDashboard,
  fetchGcomDashboard,
  importDashboard,
  importDashboardJson,
  importDashboardV2Json,
} from './actions';
import { initialImportDashboardState } from './reducers';

function getV1ResourceSpec(dashboard: unknown): Record<string, unknown> | undefined {
  if (!isRecord(dashboard) || !('spec' in dashboard)) {
    return undefined;
  }
  const spec = dashboard.spec;
  if (!isRecord(spec) || isDashboardV2Spec(spec)) {
    return undefined;
  }
  return spec;
}

const IMPORT_STARTED_EVENT_NAME = 'dashboard_import_loaded';
const IMPORT_FINISHED_EVENT_NAME = 'dashboard_import_imported';

function ImportResourceFormatError({ format, onCancel }: { format: ExportFormat; onCancel: () => void }) {
  const errorMessage =
    format === ExportFormat.V1Resource
      ? t(
          'manage-dashboards.import-resource-format-error.v1-message',
          'This dashboard is in Kubernetes v1 resource format and cannot be imported when Kubernetes dashboards feature is disabled. Please enable the kubernetesDashboards feature toggle to import this dashboard.'
        )
      : t(
          'manage-dashboards.import-resource-format-error.v2-message',
          'This dashboard is in v2 resource format and cannot be imported when Kubernetes dashboards feature is disabled. Please enable the kubernetesDashboards feature toggle to import this dashboard.'
        );

  return (
    <Stack direction="column" gap={2}>
      <Alert title={t('manage-dashboards.import-resource-format-error.title', 'Unsupported format')} severity="error">
        {errorMessage}
      </Alert>
      <Stack>
        <Button variant="secondary" onClick={onCancel}>
          <Trans i18nKey="manage-dashboards.import-resource-format-error.cancel">Cancel</Trans>
        </Button>
      </Stack>
    </Stack>
  );
}

function ImportOverview() {
  const dispatch = useDispatch();
  const [uidReset, setUidReset] = useState(false);

  const overviewDashboard = useSelector((state: StoreState) => state.importDashboard.dashboard);
  const meta = useSelector((state: StoreState) => state.importDashboard.meta);
  const source = useSelector((state: StoreState) => state.importDashboard.source);
  const inputs = useSelector((state: StoreState) => state.importDashboard.inputs);
  const folder = useSelector((state: StoreState) => {
    const searchObj = locationService.getSearchObject();
    return searchObj.folderUid ? { uid: String(searchObj.folderUid) } : { uid: '' };
  });

  const onSubmit = (form: ImportDashboardDTO) => {
    reportInteraction(IMPORT_FINISHED_EVENT_NAME);
    dispatch(importDashboard(form));
  };

  const onCancel = () => {
    dispatch(clearLoadedDashboard());
  };

  const onUidReset = () => {
    setUidReset(true);
  };

  return (
    <>
      {source === DashboardSource.Gcom && (
        <GcomDashboardInfo gnetId={overviewDashboard.gnetId} orgName={meta.orgName} updatedAt={meta.updatedAt} />
      )}
      <Form
        onSubmit={onSubmit}
        defaultValues={{ ...overviewDashboard, constants: [], dataSources: [], elements: [], folder: folder }}
        validateOnMount
        validateFieldsOnMount={['title', 'uid']}
        validateOn="onChange"
      >
        {({ register, errors, control, watch, getValues }) => (
          <ImportForm
            register={register}
            errors={errors}
            control={control}
            getValues={getValues}
            uidReset={uidReset}
            inputs={inputs}
            onCancel={onCancel}
            onUidReset={onUidReset}
            onSubmit={onSubmit}
            watch={watch}
          />
        )}
      </Form>
    </>
  );
}

type DashboardImportPageRouteSearchParams = {
  gcomDashboardId?: string;
};

type OwnProps = GrafanaRouteComponentProps<{}, DashboardImportPageRouteSearchParams>;

function DashboardImportLegacyComponent({ queryParams }: OwnProps) {
  const pageNav: NavModelItem = {
    text: t('manage-dashboards.unthemed-dashboard-import.text.import-dashboard', 'Import dashboard'),
    subTitle: t(
      'manage-dashboards.unthemed-dashboard-import.subTitle.import-dashboard-from-file-or-grafanacom',
      'Import dashboard from file or Grafana.com'
    ),
  };
  const dispatch = useDispatch();

  const loadingState = useSelector((state: StoreState) => state.importDashboard.state);
  const dashboard = useSelector((state: StoreState) => state.importDashboard.dashboard);

  useEffect(() => {
    const { gcomDashboardId } = queryParams;
    if (gcomDashboardId) {
      handleGcomSubmit({ gcomDashboard: gcomDashboardId });
    }

    return () => {
      dispatch(cleanUpAction({ cleanupAction: (state) => (state.importDashboard = initialImportDashboardState) }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = (result: string | ArrayBuffer | null) => {
    reportInteraction(IMPORT_STARTED_EVENT_NAME, {
      import_source: 'json_uploaded',
    });

    try {
      const json = JSON.parse(String(result));

      if (json.spec?.elements) {
        return dispatch(importDashboardV2Json(json.spec));
      } else if (json.elements) {
        return dispatch(importDashboardV2Json(json));
      }

      const v1ResourceSpec = getV1ResourceSpec(json);
      if (v1ResourceSpec) {
        return dispatch(importDashboardJson(v1ResourceSpec));
      }

      dispatch(importDashboardJson(json));
    } catch (error) {
      if (error instanceof Error) {
        appEvents.emit(AppEvents.alertError, ['Import failed', 'JSON -> JS Serialization failed: ' + error.message]);
      }
      return;
    }
  };

  const handleJsonSubmit = (formData: { dashboardJson: string }) => {
    reportInteraction(IMPORT_STARTED_EVENT_NAME, {
      import_source: 'json_pasted',
    });

    const dash = JSON.parse(formData.dashboardJson);

    if ((dash.spec?.elements || dash.elements) && !config.featureToggles.dashboardNewLayouts) {
      return appEvents.emit(AppEvents.alertError, [
        'Import failed',
        'Dashboard using new layout cannot be imported because the feature is not enabled',
      ]);
    }

    const format = detectExportFormat(dash);
    if (format === ExportFormat.V2Resource && dash.spec?.elements) {
      return dispatch(importDashboardV2Json(dash.spec));
    }

    if (format === ExportFormat.V2Resource && dash.elements) {
      return dispatch(importDashboardV2Json(dash));
    }

    const v1ResourceSpec = getV1ResourceSpec(dash);
    if (v1ResourceSpec) {
      return dispatch(importDashboardJson(v1ResourceSpec));
    }

    dispatch(importDashboardJson(dash));
  };

  const handleGcomSubmit = (formData: { gcomDashboard: string }) => {
    reportInteraction(IMPORT_STARTED_EVENT_NAME, {
      import_source: 'gcom',
    });

    let dashboardId;
    const match = /(^\d+$)|dashboards\/(\d+)/.exec(formData.gcomDashboard);
    if (match && match[1]) {
      dashboardId = match[1];
    } else if (match && match[2]) {
      dashboardId = match[2];
    }

    if (dashboardId) {
      dispatch(fetchGcomDashboard(dashboardId));
    }
  };

  const getDashboardOverview = () => {
    if (loadingState === LoadingState.Done) {
      const format = detectExportFormat(dashboard);

      if (format === ExportFormat.V1Resource || format === ExportFormat.V2Resource) {
        return <ImportResourceFormatError format={format} onCancel={() => dispatch(clearLoadedDashboard())} />;
      }

      return <ImportOverview />;
    }

    return null;
  };

  return (
    <Page navId="dashboards/browse" pageNav={pageNav}>
      <Page.Contents>
        {loadingState === LoadingState.Loading && (
          <Stack direction={'column'} justifyContent="center">
            <Stack justifyContent="center">
              <Spinner size="xxl" />
            </Stack>
          </Stack>
        )}
        {[LoadingState.Error, LoadingState.NotStarted].includes(loadingState) && (
          <ImportSourceForm
            onFileUpload={handleFileUpload}
            onGcomSubmit={handleGcomSubmit}
            onJsonSubmit={handleJsonSubmit}
          />
        )}
        {getDashboardOverview()}
      </Page.Contents>
    </Page>
  );
}

export const DashboardImportLegacy = DashboardImportLegacyComponent;
