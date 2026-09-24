import * as stylex from '@stylexjs/stylex';
import { isEqual } from 'lodash';
import { Component, createRef, type ReactNode } from 'react';
import { type ValueContainerProps as BaseValueContainerProps, type GroupBase } from 'react-select';

import type { CustomComponentProps } from './types';

type ValueContainerProps<Option, isMulti extends boolean, Group extends GroupBase<Option>> = BaseValueContainerProps<
  Option,
  isMulti,
  Group
> &
  CustomComponentProps<Option, isMulti, Group>;

class ValueContainerComponent<Option, isMulti extends boolean, Group extends GroupBase<Option>> extends Component<
  ValueContainerProps<Option, isMulti, Group>
> {
  private ref = createRef<HTMLDivElement>();

  componentDidUpdate(prevProps: ValueContainerProps<Option, isMulti, Group>) {
    if (
      this.ref.current &&
      this.props.selectProps.autoWidth &&
      !this.props.selectProps.maxVisibleValues &&
      !isEqual(prevProps.selectProps.value, this.props.selectProps.value)
    ) {
      // Reset in order to measure the new width
      this.ref.current.style.minWidth = '0px';

      const width = this.ref.current.offsetWidth;

      this.ref.current.style.minWidth = `${width}px`;
    }
  }

  render() {
    const { children } = this.props;
    const { selectProps } = this.props;

    if (
      selectProps &&
      Array.isArray(children) &&
      Array.isArray(children[0]) &&
      selectProps.maxVisibleValues !== undefined &&
      !(selectProps.showAllSelectedWhenOpen && selectProps.menuIsOpen)
    ) {
      const [valueChildren, ...otherChildren] = children;
      const truncatedValues = valueChildren.slice(0, selectProps.maxVisibleValues);

      return this.renderContainer([truncatedValues, ...otherChildren]);
    }

    return this.renderContainer(children);
  }

  renderContainer(children?: ReactNode) {
    const { isMulti, selectProps } = this.props;
    const noWrap = this.props.selectProps?.noMultiValueWrap && !this.props.selectProps?.menuIsOpen;
    const dataTestid = selectProps['data-testid'];

    return (
      <div
        ref={this.ref}
        data-testid={dataTestid}
        {...stylex.props(
          styles.valueContainer,
          isMulti && !noWrap && styles.valueContainerMulti,
          isMulti && noWrap && styles.valueContainerMultiNoWrap
        )}
      >
        {children}
      </div>
    );
  }
}

export const ValueContainer: React.ComponentType<ValueContainerProps<unknown, boolean, GroupBase<unknown>>> =
  ValueContainerComponent;

const styles = stylex.create({
  valueContainer: {
    alignItems: 'center',
    display: 'grid',
    position: 'relative',
    boxSizing: 'border-box',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    outline: 'none',
    overflow: 'hidden',
  },
  valueContainerMulti: {
    flexWrap: 'wrap',
    display: 'flex',
  },
  valueContainerMultiNoWrap: {
    display: 'grid',
    gridAutoFlow: 'column',
  },
});
