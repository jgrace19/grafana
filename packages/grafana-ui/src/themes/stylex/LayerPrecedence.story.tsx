import { css } from '@emotion/css';
import { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../../components/Badge/Badge';

const meta: Meta = {
  title: 'StyleX/Layer Precedence',
};

export default meta;

export const OverrideWins: StoryObj = {
  render: () => {
    const override = css({ color: 'rgb(255, 0, 0) !important' });
    return (
      <div data-testid="stylex-layer-target">
        <Badge text="Override" color="blue" className={override} />
      </div>
    );
  },
};
