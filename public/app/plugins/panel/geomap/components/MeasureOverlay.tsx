import * as stylex from '@stylexjs/stylex';
import type Map from 'ol/Map';
import { useMemo, useRef, useState } from 'react';

import { type SelectableValue } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Button, IconButton, RadioButtonGroup, Select } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { type MapMeasure, type MapMeasureOptions, measures } from '../utils/measure';

import { MeasureVectorLayer } from './MeasureVectorLayer';

type Props = {
  map: Map;
  menuActiveState: (value: boolean) => void;
};

export const MeasureOverlay = ({ map, menuActiveState }: Props) => {
  const vector = useRef(new MeasureVectorLayer());

  // Menu State Management
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [menuActive, setMenuActive] = useState<boolean>(false);

  // Options State
  const [options, setOptions] = useState<MapMeasureOptions>({
    action: measures[0].value!,
    unit: measures[0].units[0].value!,
  });
  const unit = useMemo(() => {
    const action = measures.find((m: MapMeasure) => m.value === options.action) ?? measures[0];
    const current = action.getUnit(options.unit);
    vector.current.setOptions(options);
    return {
      current,
      options: action.units,
    };
  }, [options]);

  const clearPrevious = true;
  const showSegments = false;

  function toggleMenu() {
    setMenuActive(!menuActive);
    // Lift menu state
    // TODO: consolidate into one state
    menuActiveState(!menuActive);
    if (menuActive) {
      map.removeInteraction(vector.current.draw);
      vector.current.setVisible(false);
    } else {
      if (firstLoad) {
        // Initialize on first load
        setFirstLoad(false);
        vector.current.setZIndex(1);
        map.addLayer(vector.current);
        map.addInteraction(vector.current.modify);
      }
      vector.current.setVisible(true);
      map.removeInteraction(vector.current.draw); // Remove last interaction
      const a = measures.find((v: MapMeasure) => v.value === options.action) ?? measures[0];
      vector.current.addInteraction(map, a.geometry, showSegments, clearPrevious);
    }
  }

  return (
    <div {...stylex.props(styles.infoWrap, !menuActive && styles.infoWrapClosed)}>
      {menuActive ? (
        <div>
          <div {...stylex.props(styles.rowGroup)}>
            <RadioButtonGroup
              value={options.action}
              options={measures}
              size="md"
              fullWidth={false}
              onChange={(e: string) => {
                map.removeInteraction(vector.current.draw);
                const m = measures.find((v: MapMeasure) => v.value === e) ?? measures[0];
                const unit = m.getUnit(options.unit);
                setOptions({ ...options, action: m.value!, unit: unit.value! });
                vector.current.addInteraction(map, m.geometry, showSegments, clearPrevious);
              }}
            />
            <Button
              aria-label={t('geomap.measure-overlay.aria-label-close', 'Close measure tools')}
              className={stylex.props(styles.button).className}
              icon="times"
              variant="secondary"
              size="sm"
              onClick={toggleMenu}
            />
          </div>
          <Select
            className={stylex.props(styles.unitSelect).className}
            value={unit.current}
            options={unit.options}
            isSearchable={false}
            onChange={(v: SelectableValue<string>) => {
              const a = measures.find((v: SelectableValue<string>) => v.value === options.action) ?? measures[0];
              const unit = a.getUnit(v.value) ?? a.units[0];
              setOptions({ ...options, unit: unit.value! });
            }}
          />
        </div>
      ) : (
        <IconButton
          xstyle={styles.measureIcon}
          data-testid={selectors.components.PanelEditor.measureButton}
          name="ruler-combined"
          tooltip={t('geomap.measure-overlay.tooltip-show-measure-tools', 'Show measure tools')}
          tooltipPlacement="left"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
};

const styles = stylex.create({
  measureIcon: {
    backgroundColor: colors['--gf-colors-secondary-main'],
    display: 'inline-block',
    height: '19.25px',
    marginTop: '1px',
    marginRight: '1px',
    marginBottom: '1px',
    marginLeft: '1px',
    width: '19.25px',
  },
  button: {
    marginLeft: 'auto',
  },
  infoWrap: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    // eslint-disable-next-line @grafana/stylex-no-border-radius-literal
    borderRadius: '4px',
    padding: '2px',
  },
  infoWrapClosed: {
    height: '25.25px',
    width: '25.25px',
  },
  rowGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  unitSelect: {
    minWidth: '200px',
  },
});
