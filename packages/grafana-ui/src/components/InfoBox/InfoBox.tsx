import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import * as React from 'react';
import type { JSX } from 'react';

import { spacing } from '../../themes/stylex/tokens.stylex';
import { Alert, type AlertVariant } from '../Alert/Alert';
import { Icon } from '../Icon/Icon';

export interface InfoBoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  children: React.ReactNode;
  /** Title of the box */
  title?: string | JSX.Element;
  /** Url of the read more link */
  url?: string;
  /** Text of the read more link */
  urlTitle?: string;
  /** Indicates whether or not box should be rendered with Grafana branding background */
  branded?: boolean;
  /** Color variant of the box */
  severity?: AlertVariant;
  /** Call back to be performed when box is dismissed */
  onDismiss?: () => void;
  /** @internal first-party StyleX overrides for the Alert, applied last */
  xstyle?: stylex.StyleXStyles;
}

/**
 * @deprecated use Alert with severity info.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-deprecated-infobox--docs
 * */
export const InfoBox = React.memo(
  React.forwardRef<HTMLDivElement, InfoBoxProps>(
    ({ title, className, children, branded, url, urlTitle, onDismiss, severity = 'info', ...otherProps }, ref) => {
      return (
        // component is deprecated so no point fixing this
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        <Alert severity={severity} className={className} {...otherProps} ref={ref} title={title as string}>
          <div>{children}</div>
          {url && (
            <a
              href={url}
              className={clsx('external-link', stylex.props(styles.docsLink).className)}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="book" /> {urlTitle || 'Read more'}
            </a>
          )}
        </Alert>
      );
    }
  )
);

InfoBox.displayName = 'InfoBox';

const styles = stylex.create({
  docsLink: {
    display: 'inline-block',
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
  },
});
