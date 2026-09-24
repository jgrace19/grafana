import * as stylex from '@stylexjs/stylex';
import { stylesStyles } from './styles.stylex';



export const containerStyles = stylex.props(stylesStyles.containerStyles).className ?? '';
