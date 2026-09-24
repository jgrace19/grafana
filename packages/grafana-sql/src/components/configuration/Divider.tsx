import * as stylex from '@stylexjs/stylex';

import { sqlEditorStyles } from '../sqlComponents.stylex';

// this custom component is necessary because the Grafana UI <Divider /> component is not backwards compatible with Grafana < 10.1.0
export const Divider = () => {
  return <hr {...stylex.props(sqlEditorStyles.horizontalDivider)} />;
};
