import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import grafanaIconSvg from 'img/grafana_icon.svg';
import headerDarkSvg from 'img/licensing/header_dark.svg';
import headerLightSvg from 'img/licensing/header_light.svg';

const title = { fontWeight: 500, fontSize: '26px', lineHeight: '123%' };

interface Props {
  header: string;
  subheader?: string;
  editionNotice?: string;
  children?: React.ReactNode;
}

export function LicenseChrome({ header, editionNotice, subheader, children }: Props) {
  const theme = useTheme2();
  const backgroundUrl = theme.isDark ? headerDarkSvg : headerLightSvg;
  const footerBg = theme.isDark ? theme.v1.palette.dark9 : theme.v1.palette.gray6;

  return (
    <>
      <div
        {...mergeStylexProps(stylex.props(styles.header), {
          // A relative url() in a StyleX dynamic value would resolve against the stylesheet, not the document.
          style: { backgroundImage: `url('${backgroundUrl}')` },
        })}
      >
        <h2 style={title}>{header}</h2>
        {subheader && <h3>{subheader}</h3>}

        <Circle
          size="128px"
          style={{
            boxShadow: '0px 0px 24px rgba(24, 58, 110, 0.45)',
            background: '#0A1C36',
            position: 'absolute',
            top: '19px',
            right: '5%',
          }}
        >
          <img
            src={grafanaIconSvg}
            alt="Grafana"
            width="80px"
            style={{ position: 'absolute', left: '23px', top: '20px' }}
          />
        </Circle>
      </div>

      <div {...stylex.props(styles.container)}>{children}</div>

      {editionNotice && <div {...stylex.props(styles.footer, styles.footerBackground(footerBg))}>{editionNotice}</div>}
    </>
  );
}

interface CircleProps {
  size: string;
  style?: React.CSSProperties;
}

export const Circle = ({ size, style, children }: React.PropsWithChildren<CircleProps>) => {
  const theme = useTheme2();
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: theme.shape.radius.circle,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const styles = stylex.create({
  container: {
    padding: spacing['--gf-spacing-x4'],
    backgroundColor: components['--gf-components-panel-background'],
  },
  footer: {
    textAlign: 'center',
    padding: spacing['--gf-spacing-x2'],
    borderRadius: shape['--gf-shape-radius-lg'],
  },
  footerBackground: (backgroundColor: string) => ({
    backgroundColor,
  }),
  header: {
    height: '137px',
    paddingTop: spacing['--gf-spacing-x4'],
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x4'],
    position: 'relative',
    backgroundPosition: 'right',
    borderRadius: shape['--gf-shape-radius-lg'],
  },
});
