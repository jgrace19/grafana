import { type Meta } from '@storybook/react';
import * as stylex from '@stylexjs/stylex';
import { type ChangeEvent, useState } from 'react';

import { toIconName, type IconName } from '@grafana/data';

import { colors, typography } from '../../themes/stylex/tokens.stylex';
import { getAvailableIcons } from '../../types/icon';
import { Field } from '../Forms/Field';
import { Input } from '../Input/Input';

import { Icon } from './Icon';
import mdx from './Icon.mdx';

const meta: Meta<typeof Icon> = {
  title: 'Iconography/Icon',
  component: Icon,
  parameters: {
    options: {
      showPanel: false,
    },
    docs: {
      page: mdx,
    },
  },
};

const IconWrapper = ({ name }: { name: IconName }) => {
  return (
    <div {...stylex.props(styles.iconWrapper)}>
      <Icon name={name} />
      <div {...stylex.props(styles.iconName)}>{name}</div>
    </div>
  );
};

const icons = [...getAvailableIcons()];
icons.sort((a, b) => a.localeCompare(b));

export const IconsOverview = () => {
  const [filter, setFilter] = useState('');

  const searchIcon = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <div {...stylex.props(styles.overview)}>
      <Field className={stylex.props(styles.search).className}>
        <Input onChange={searchIcon} placeholder="Search icons by name" />
      </Field>
      <div {...stylex.props(styles.icons)}>
        {icons
          .filter((val) => val.includes(filter))
          .map((i) => {
            return <IconWrapper name={toIconName(i)!} key={i} />;
          })}
      </div>
    </div>
  );
};

export default meta;

const styles = stylex.create({
  iconWrapper: {
    width: '150px',
    padding: '12px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    textAlign: 'center',
    backgroundColor: { default: null, ':hover': colors['--gf-colors-border-medium'] },
  },
  iconName: {
    paddingTop: '16px',
    wordBreak: 'break-all',
    fontFamily: typography['--gf-typography-font-family-monospace'],
    fontSize: typography['--gf-typography-size-xs'],
  },
  overview: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'auto',
    width: '100%',
  },
  search: {
    width: '300px',
  },
  icons: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});
