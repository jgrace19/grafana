import * as stylex from '@stylexjs/stylex';
import { components, type GroupBase, type SingleValueProps } from 'react-select';

import { type SelectableValue, toIconName } from '@grafana/data';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, spacing } from '../../themes/stylex/tokens.stylex';
import { useDelayedSwitch } from '../../utils/useDelayedSwitch';
import { Icon } from '../Icon/Icon';
import { Spinner } from '../Spinner/Spinner';
import { FadeTransition } from '../transitions/FadeTransition';
import { SlideOutTransition } from '../transitions/SlideOutTransition';

// `selectors.components.Select.singleValue` (used by e2e tests, including plugin ones) matches `[class*="-singleValue"]`,
// which used to come from the Emotion label.
const SINGLE_VALUE_CLASS = 'gf-select-singleValue';

export type Props<T> = SingleValueProps<SelectableValue<T>, boolean, GroupBase<SelectableValue<T>>>;

export const SingleValue = <T extends unknown>(props: Props<T>) => {
  const { children, data, isDisabled } = props;
  const loading = useDelayedSwitch(data.loading || false, { delay: 250, duration: 750 });
  const icon = data.icon ? toIconName(data.icon) : undefined;

  return (
    <components.SingleValue
      {...props}
      className={
        mergeStylexProps(
          stylex.props(
            styles.singleValue,
            // eslint-disable-next-line @grafana/stylex-no-toggled-pseudo-state -- react-select disabled state, a toggled class on main too
            isDisabled && styles.disabled,
            props.selectProps.menuIsOpen && styles.isOpen
          ),
          { className: SINGLE_VALUE_CLASS }
        ).className
      }
    >
      {data.imgUrl ? (
        <FadeWithImage loading={loading} imgUrl={data.imgUrl} alt={String(data.label ?? data.value)} />
      ) : (
        <>
          <SlideOutTransition horizontal size={16} visible={loading} duration={150}>
            <div {...stylex.props(styles.spinnerWrapper)}>
              <Spinner className={stylex.props(styles.spinnerIcon).className} inline />
            </div>
          </SlideOutTransition>
          {icon && <Icon name={icon} role="img" xstyle={styles.optionIcon} />}
        </>
      )}

      {!data.hideText && children}
    </components.SingleValue>
  );
};

const FadeWithImage = (props: { loading: boolean; imgUrl: string; alt?: string }) => {
  return (
    <div {...stylex.props(styles.spinnerWrapper)}>
      <FadeTransition duration={150} visible={props.loading}>
        <Spinner className={stylex.props(styles.spinnerIcon).className} inline />
      </FadeTransition>
      <FadeTransition duration={150} visible={!props.loading}>
        <img {...stylex.props(styles.spinnerIcon)} src={props.imgUrl} alt={props.alt} />
      </FadeTransition>
    </div>
  );
};

const styles = stylex.create({
  singleValue: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    boxSizing: 'border-box',
    maxWidth: '100%',
    gridRowStart: 1,
    gridColumnStart: 1,
    gridRowEnd: 2,
    gridColumnEnd: 3,
  },
  spinnerWrapper: {
    width: '16px',
    height: '16px',
    display: 'inline-block',
    marginRight: '10px',
    position: 'relative',
    verticalAlign: 'middle',
    overflow: 'hidden',
  },
  spinnerIcon: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  optionIcon: {
    marginRight: spacing['--gf-spacing-x1'],
    color: colors['--gf-colors-text-secondary'],
  },
  disabled: {
    color: colors['--gf-colors-text-disabled'],
  },
  isOpen: {
    color: colors['--gf-colors-text-disabled'],
  },
});
