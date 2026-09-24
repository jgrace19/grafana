import * as stylex from '@stylexjs/stylex';
import type Map from 'ol/Map';
import { type Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { PureComponent } from 'react';
import tinycolor from 'tinycolor2';

import { selectors } from '@grafana/e2e-selectors';
import { Trans } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  map: Map;
}

interface State {
  zoom?: number;
  center: Coordinate;
}

export class DebugOverlay extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { zoom: 0, center: [0, 0] };
  }

  updateViewState = () => {
    const view = this.props.map.getView();
    this.setState({
      zoom: view.getZoom(),
      center: transform(view.getCenter()!, view.getProjection(), 'EPSG:4326'),
    });
  };

  componentDidMount() {
    this.props.map.on('moveend', this.updateViewState);
    this.updateViewState();
  }

  render() {
    const { zoom, center } = this.state;

    return (
      <div
        {...stylex.props(
          styles.infoWrap,
          styles.background(tinycolor(config.theme2.components.panel.background).setAlpha(0.7).toString())
        )}
        data-testid={selectors.components.DebugOverlay.wrapper}
      >
        <table>
          <tbody>
            <tr>
              <th>
                <Trans i18nKey="geomap.debug-overlay.zoom">Zoom:</Trans>
              </th>
              <td>{zoom?.toFixed(1)}</td>
            </tr>
            <tr>
              <th>
                <Trans i18nKey="geomap.debug-overlay.center">Center:</Trans>&nbsp;
              </th>
              <td>
                {center[0].toFixed(5)}, {center[1].toFixed(5)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const styles = stylex.create({
  infoWrap: {
    color: colors['--gf-colors-text-primary'],
    borderRadius: shape['--gf-shape-radius-default'],
    padding: spacing['--gf-spacing-x1'],
  },
  background: (backgroundColor: string) => ({
    backgroundColor,
  }),
});
