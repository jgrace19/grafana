import { css } from '@emotion/css';

// stylex: pending Field migration. EditorField forwards className to Field, whose own Emotion marginBottom beats a
// StyleX override.
export const removeMarginBottom = css({ marginBottom: 8 });
