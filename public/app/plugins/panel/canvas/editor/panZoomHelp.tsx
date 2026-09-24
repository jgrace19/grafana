import { type StandardEditorProps } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Alert, Icon, Stack } from '@grafana/ui';

import './panZoomHelp.css';

const helpUrl = 'https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/canvas/';

export const PanZoomHelp = ({}: StandardEditorProps<string, unknown, unknown, unknown>) => {
  return (
    <>
      <Stack direction="row">
        <Alert
          title={t('canvas.pan-zoom-help.title-pan-and-zoom-controls', 'Pan and zoom controls')}
          severity="info"
          buttonContent={<Icon name="question-circle" size="xl" />}
          className="gf-canvas-pan-zoom-help"
          onRemove={() => {
            const newWindow = window.open(helpUrl, '_blank', 'noopener,noreferrer');
            if (newWindow) {
              newWindow.opener = null;
            }
          }}
        >
          <Stack direction="column">
            <ul>
              <li>
                <Trans i18nKey="canvas.pan-zoom-help.pan-title">Pan:</Trans>
                <ul>
                  <li>
                    <Trans i18nKey="canvas.pan-zoom-help.middle-mouse">Middle mouse</Trans>
                  </li>
                  <li>
                    <Trans i18nKey="canvas.pan-zoom-help.ctrl-right-mouse">CTRL + right mouse</Trans>
                  </li>
                </ul>
              </li>
              <li>
                <Trans i18nKey="canvas.pan-zoom-help.zoom-scroll-wheel">Zoom: Scroll wheel</Trans>
              </li>
              <li>
                <Trans i18nKey="canvas.pan-zoom-help.reset-double-click">Reset: Double click</Trans>
              </li>
            </ul>
          </Stack>
        </Alert>
      </Stack>
    </>
  );
};
