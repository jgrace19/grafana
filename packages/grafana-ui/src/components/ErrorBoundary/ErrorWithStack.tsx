import * as stylex from '@stylexjs/stylex';

import { type ErrorBoundaryApi } from './ErrorBoundary';

export interface Props extends ErrorBoundaryApi {
  title: string;
}

export const ErrorWithStack = ({ error, errorInfo, title }: Props) => {
  return (
    <div {...stylex.props(styles.container)}>
      <h2>{title}</h2>
      <details style={{ whiteSpace: 'pre-wrap' }}>
        {error && error.toString()}
        <br />
        {errorInfo && errorInfo.componentStack}
      </details>
    </div>
  );
};

ErrorWithStack.displayName = 'ErrorWithStack';

const styles = stylex.create({
  container: {
    width: '500px',
    marginTop: '64px',
    marginRight: 'auto',
    marginBottom: '64px',
    marginLeft: 'auto',
  },
});
