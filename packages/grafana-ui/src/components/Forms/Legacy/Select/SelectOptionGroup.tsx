import * as stylex from '@stylexjs/stylex';
import { PureComponent } from 'react';
import { GroupProps } from 'react-select';

import { colors } from '../../../../themes/stylex/tokens.stylex';
import { Icon } from '../../../Icon/Icon';

interface ExtendedGroupProps extends Omit<GroupProps<any, any>, 'theme'> {
  data: {
    label: string;
    expanded: boolean;
    options: any[];
  };
}

interface State {
  expanded: boolean;
}

export class SelectOptionGroup extends PureComponent<ExtendedGroupProps, State> {
  state = {
    expanded: false,
  };

  componentDidMount() {
    if (this.props.data.expanded) {
      this.setState({ expanded: true });
    } else if (this.props.selectProps && this.props.selectProps.value) {
      const { value } = this.props.selectProps.value;

      if (value && this.props.options.some((option) => option.value === value)) {
        this.setState({ expanded: true });
      }
    }
  }

  componentDidUpdate(nextProps: ExtendedGroupProps) {
    if (nextProps.selectProps.inputValue !== '') {
      this.setState({ expanded: true });
    }
  }

  onToggleChildren = () => {
    this.setState((prevState) => ({
      expanded: !prevState.expanded,
    }));
  };

  render() {
    const { children, label } = this.props;
    const { expanded } = this.state;

    return (
      <div>
        {/*React Select doesn't support focusable option group headers, this will be skipped when using
      the keyboard */}
        <div {...stylex.props(styles.header)} onClick={this.onToggleChildren} role="presentation">
          <span {...stylex.props(styles.label)}>{label}</span>
          <Icon xstyle={styles.icon} name={expanded ? 'angle-up' : 'angle-down'} />
        </div>
        {expanded && children}
      </div>
    );
  }
}

const styles = stylex.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    justifyItems: 'center',
    cursor: 'pointer',
    paddingTop: '7px',
    paddingRight: '10px',
    paddingBottom: '7px',
    paddingLeft: '10px',
    width: '100%',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-background-secondary'],
    color: { default: null, ':hover': colors['--gf-colors-text-max-contrast'] },
  },
  label: {
    flexGrow: 1,
  },
  icon: {
    paddingRight: '2px',
  },
});
