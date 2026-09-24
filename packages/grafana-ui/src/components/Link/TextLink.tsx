import * as stylex from '@stylexjs/stylex';
import { type AnchorHTMLAttributes, forwardRef } from 'react';

import { type GrafanaTheme2, locationUtil, textUtil, type ThemeTypographyVariantTypes } from '@grafana/data';

import { colors } from '../../themes/stylex/tokens.stylex';
import { type IconName, type IconSize } from '../../types/icon';
import { Icon } from '../Icon/Icon';
import { textVariantStyles, textWeightStyles } from '../Text/Text';

import { Link } from './Link';

type TextLinkVariants = keyof Omit<ThemeTypographyVariantTypes, 'code'>;

interface TextLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> {
  /** url to which redirect the user, external or internal */
  href: string;
  /** Color to use for text */
  color?: keyof GrafanaTheme2['colors']['text'];
  /** Specify if the link will redirect users to a page in or out Grafana */
  external?: boolean;
  /** True when the link will be displayed inline with surrounding text, false if it will be displayed as a block. Depending on this prop correspondant default styles will be applied */
  inline?: boolean;
  /** The default variant is 'body'. To fit another styles set the correspondent variant as it is necessary also to adjust the icon size. `code` is excluded, as it is not fit for links. */
  variant?: TextLinkVariants;
  /** Override the default weight for the used variant */
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  /** Set the icon to be shown. An external link will show the 'external-link-alt' icon as default.*/
  icon?: IconName;
  children: React.ReactNode;
}

const svgSizes: {
  [key in TextLinkVariants]: IconSize;
} = {
  h1: 'xl',
  h2: 'xl',
  h3: 'lg',
  h4: 'lg',
  h5: 'md',
  h6: 'md',
  body: 'md',
  bodySmall: 'xs',
};

/**
 * The TextLink component renders an anchor tag `<a>` that takes users to another page, external or internal to Grafana.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/foundations-textlink--docs
 */
export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  (
    { href, color = 'link', external = false, inline = true, variant = 'body', weight, icon, children, style, ...rest },
    ref
  ) => {
    const validUrl = textUtil.sanitizeUrl(href ?? '');

    const stylexProps = stylex.props(
      variant && textVariantStyles[variant],
      weight && textWeightStyles[weight],
      styles.wrapper,
      // Hover always switches to the link colour, so the colour and its hover state are one property.
      styles.color(color ? `var(--gf-colors-text-${color.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)})` : null),
      inline && styles.inline
    );
    // Consumer className is ignored, as it always was; a consumer style still applies.
    const wrapperProps = { className: stylexProps.className, style: { ...stylexProps.style, ...style } };
    const externalIcon = icon || 'external-link-alt';

    if (external) {
      return (
        <a href={validUrl} ref={ref} {...rest} target="_blank" rel="noreferrer" {...wrapperProps}>
          {children}
          <Icon xstyle={styles.icon} size={svgSizes[variant] || 'md'} name={externalIcon} />
        </a>
      );
    }

    const strippedUrl = locationUtil.stripBaseFromUrl(validUrl);

    return (
      <Link ref={ref} href={strippedUrl} {...rest} {...wrapperProps}>
        {children}
        {icon && <Icon xstyle={styles.icon} name={icon} size={svgSizes[variant] || 'md'} />}
      </Link>
    );
  }
);

TextLink.displayName = 'TextLink';

const styles = stylex.create({
  icon: {
    marginLeft: '0.25em',
    verticalAlign: 'text-bottom',
  },
  wrapper: {
    textDecoration: { default: 'none', ':hover': 'underline' },
  },
  color: (color: string | null) => ({
    color: { default: color, ':hover': colors['--gf-colors-text-link'] },
  }),
  inline: {
    textDecoration: { default: 'underline', ':hover': 'none' },
  },
});
