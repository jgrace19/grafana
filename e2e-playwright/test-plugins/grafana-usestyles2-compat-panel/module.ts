import { PanelPlugin } from '@grafana/data';

import { UseStyles2CompatPanel } from './components/UseStyles2CompatPanel';
import { CompatPanelOptions } from './types';

export const plugin = new PanelPlugin<CompatPanelOptions>(UseStyles2CompatPanel);
