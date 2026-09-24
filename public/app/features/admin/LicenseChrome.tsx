import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { licenseChromeStyles } from './LicenseChrome.stylex';
import * as React from 'react';

import { useTheme2 } from '@grafana/ui';
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

  return (
    <>
      <div {...stylex.props(licenseChromeStyles.header)}>
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

      <div {...stylex.props(licenseChromeStyles.container)}>{children}</div>

      {editionNotice && <div {...stylex.props(licenseChromeStyles.footer)}>{editionNotice}</div>}
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
