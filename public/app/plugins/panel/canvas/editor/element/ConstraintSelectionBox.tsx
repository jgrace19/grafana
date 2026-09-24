import * as stylex from '@stylexjs/stylex';

import { useTheme2 } from '@grafana/ui';

import { VerticalConstraint, HorizontalConstraint, type Constraint } from '../../panelcfg.gen';

interface Props {
  onVerticalConstraintChange: (v: VerticalConstraint) => void;
  onHorizontalConstraintChange: (h: HorizontalConstraint) => void;
  currentConstraints: Constraint;
}

export const ConstraintSelectionBox = ({
  onVerticalConstraintChange,
  onHorizontalConstraintChange,
  currentConstraints,
}: Props) => {
  const theme = useTheme2();
  const unselected = theme.isDark ? styles.unselectedDark : styles.unselectedLight;
  const { vertical: v, horizontal: h } = currentConstraints;
  // A selected constraint's bar is wider, re-centred with the x/y attribute.
  const vertical = (selected: boolean) => ({
    ...stylex.props(selected ? styles.verticalSelected : unselected),
    x: selected ? '1085' : '1123',
  });
  const horizontal = (selected: boolean) => ({
    ...stylex.props(selected ? styles.horizontalSelected : unselected),
    y: selected ? '1014' : '1060',
  });

  const onClickTopConstraint = () => {
    onVerticalConstraintChange(VerticalConstraint.Top);
  };

  const onClickBottomConstraint = () => {
    onVerticalConstraintChange(VerticalConstraint.Bottom);
  };

  const onClickVerticalCenterConstraint = () => {
    onVerticalConstraintChange(VerticalConstraint.Center);
  };

  const onClickLeftConstraint = () => {
    onHorizontalConstraintChange(HorizontalConstraint.Left);
  };

  const onClickRightConstraint = () => {
    onHorizontalConstraintChange(HorizontalConstraint.Right);
  };

  const onClickHorizontalCenterConstraint = () => {
    onHorizontalConstraintChange(HorizontalConstraint.Center);
  };

  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="75.000000pt"
      height="75.000000pt"
      viewBox="0 0 228.000000 228.000000"
      preserveAspectRatio="xMidYMid meet"
      style={{ marginBottom: '4.8px' }}
    >
      <g transform="translate(0.000000,228.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
        <path
          fill="#e5e5e5"
          d="M198 2028 l-28 -32 0 -912 0 -912 31 -31 31 -31 915 0 915 0 29 29
29 29 0 917 0 917 -27 29 -28 29 -920 0 -920 0 -27 -32z m1876 -17 c15 -16 16
-98 16 -927 0 -860 -1 -909 -18 -926 -17 -17 -66 -18 -927 -18 -862 0 -910 1
-927 18 -17 17 -18 65 -18 926 0 832 1 911 16 927 16 18 45 19 468 21 248 2
659 2 912 0 431 -2 462 -4 478 -21z"
        />
        <rect
          {...vertical(v === VerticalConstraint.Top || v === VerticalConstraint.TopBottom)}
          height="228"
          width="46"
          y="1735"
        />
        <rect
          {...stylex.props(styles.constraintHover)}
          onClick={onClickTopConstraint}
          height="350"
          width="300"
          y="1680"
          x="995"
          fill="transparent"
        />
        <rect
          {...vertical(v === VerticalConstraint.Bottom || v === VerticalConstraint.TopBottom)}
          height="228"
          width="46"
          y="210"
        />
        <rect
          {...stylex.props(styles.constraintHover)}
          onClick={onClickBottomConstraint}
          height="350"
          width="300"
          y="135"
          x="995"
          fill="transparent"
        />
        <rect
          {...horizontal(h === HorizontalConstraint.Left || h === HorizontalConstraint.LeftRight)}
          height="46"
          width="228"
          x="265"
        />
        <rect
          {...stylex.props(styles.constraintHover)}
          onClick={onClickLeftConstraint}
          height="300"
          width="350"
          y="925"
          x="200"
          fill="transparent"
        />
        <rect
          {...horizontal(h === HorizontalConstraint.Right || h === HorizontalConstraint.LeftRight)}
          height="46"
          width="228"
          x="1795"
        />
        <rect
          {...stylex.props(styles.constraintHover)}
          onClick={onClickRightConstraint}
          height="300"
          width="350"
          y="925"
          x="1730"
          fill="transparent"
        />
        <path
          {...stylex.props(unselected)}
          d="M568 1669 c-17 -9 -18 -48 -18 -584 0 -558 1 -575 19 -585 27 -14
1125 -14 1152 0 18 10 19 27 19 580 0 504 -2 570 -16 584 -14 14 -80 16 -577
16 -363 -1 -568 -4 -579 -11z m1119 -42 c4 -5 4 -1079 0 -1084 -5 -4 -1079 -4
-1084 0 -5 6 -4 1077 1 1085 4 7 1076 6 1083 -1z"
        />
        <rect {...vertical(v === VerticalConstraint.Center)} height="456" width="46" y="855" />
        <rect
          {...stylex.props(styles.constraintHover)}
          onClick={onClickVerticalCenterConstraint}
          height="660"
          width="300"
          y="750"
          x="995"
          fill="transparent"
        />
        <rect {...horizontal(h === HorizontalConstraint.Center)} height="46" width="456" x="918" />
        <rect
          {...stylex.props(styles.constraintHover)}
          onClick={onClickHorizontalCenterConstraint}
          height="300"
          width="660"
          y="925"
          x="815"
          fill="transparent"
        />
      </g>
    </svg>
  );
};

const HOVER_COLOR = '#daebf7';
const HOVER_OPACITY = '0.6';
const SELECTED_COLOR = '#0d99ff';

const styles = stylex.create({
  constraintHover: {
    fill: { default: null, ':hover': HOVER_COLOR },
    fillOpacity: { default: null, ':hover': HOVER_OPACITY },
  },
  verticalSelected: {
    width: '92pt',
    fill: SELECTED_COLOR,
  },
  horizontalSelected: {
    height: '92pt',
    fill: SELECTED_COLOR,
  },
  unselectedDark: {
    fill: '#ffffff',
  },
  unselectedLight: {
    fill: '#000000',
  },
});
