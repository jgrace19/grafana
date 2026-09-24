import * as stylex from '@stylexjs/stylex';

import { useTheme2 } from '@grafana/ui';

import { VerticalConstraint, HorizontalConstraint, type Constraint } from '../../panelcfg.gen';

import { constraintSelectionBoxStyles } from './ConstraintSelectionBox.stylex';

interface Props {
  onVerticalConstraintChange: (v: VerticalConstraint) => void;
  onHorizontalConstraintChange: (h: HorizontalConstraint) => void;
  currentConstraints: Constraint;
}

const SELECTED_COLOR = '#0d99ff';

export const ConstraintSelectionBox = ({
  onVerticalConstraintChange,
  onHorizontalConstraintChange,
  currentConstraints,
}: Props) => {
  const theme = useTheme2();
  const selectionBoxColor = theme.isDark ? '#ffffff' : '#000000';
  const hoverClass = stylex.props(constraintSelectionBoxStyles.constraintHover).className;

  const topSelected =
    currentConstraints.vertical === VerticalConstraint.Top ||
    currentConstraints.vertical === VerticalConstraint.TopBottom;
  const bottomSelected =
    currentConstraints.vertical === VerticalConstraint.Bottom ||
    currentConstraints.vertical === VerticalConstraint.TopBottom;
  const leftSelected =
    currentConstraints.horizontal === HorizontalConstraint.Left ||
    currentConstraints.horizontal === HorizontalConstraint.LeftRight;
  const rightSelected =
    currentConstraints.horizontal === HorizontalConstraint.Right ||
    currentConstraints.horizontal === HorizontalConstraint.LeftRight;

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
          fill={topSelected ? SELECTED_COLOR : selectionBoxColor}
          height="228"
          width={topSelected ? '92' : '46'}
          y="1735"
          x={topSelected ? '1085' : '1123'}
        />
        <rect
          className={hoverClass}
          onClick={() => onVerticalConstraintChange(VerticalConstraint.Top)}
          height="350"
          width="300"
          y="1680"
          x="995"
          fill="transparent"
        />
        <rect
          fill={bottomSelected ? SELECTED_COLOR : selectionBoxColor}
          height="228"
          width={bottomSelected ? '92' : '46'}
          y="210"
          x={bottomSelected ? '1085' : '1123'}
        />
        <rect
          className={hoverClass}
          onClick={() => onVerticalConstraintChange(VerticalConstraint.Bottom)}
          height="350"
          width="300"
          y="135"
          x="995"
          fill="transparent"
        />
        <rect
          fill={leftSelected ? SELECTED_COLOR : selectionBoxColor}
          height={leftSelected ? '92' : '46'}
          width="228"
          y={leftSelected ? '1014' : '1060'}
          x="265"
        />
        <rect
          className={hoverClass}
          onClick={() => onHorizontalConstraintChange(HorizontalConstraint.Left)}
          height="300"
          width="350"
          y="925"
          x="200"
          fill="transparent"
        />
        <rect
          fill={rightSelected ? SELECTED_COLOR : selectionBoxColor}
          height={rightSelected ? '92' : '46'}
          width="228"
          y={rightSelected ? '1014' : '1060'}
          x="1795"
        />
        <rect
          className={hoverClass}
          onClick={() => onHorizontalConstraintChange(HorizontalConstraint.Right)}
          height="300"
          width="350"
          y="925"
          x="1730"
          fill="transparent"
        />
        <path
          fill={selectionBoxColor}
          d="M568 1669 c-17 -9 -18 -48 -18 -584 0 -558 1 -575 19 -585 27 -14
1125 -14 1152 0 18 10 19 27 19 580 0 504 -2 570 -16 584 -14 14 -80 16 -577
16 -363 -1 -568 -4 -579 -11z m1119 -42 c4 -5 4 -1079 0 -1084 -5 -4 -1079 -4
-1084 0 -5 6 -4 1077 1 1085 4 7 1076 6 1083 -1z"
        />
        <rect
          fill={currentConstraints.vertical === VerticalConstraint.Center ? SELECTED_COLOR : selectionBoxColor}
          height="456"
          width={currentConstraints.vertical === VerticalConstraint.Center ? '92' : '46'}
          y="855"
          x={currentConstraints.vertical === VerticalConstraint.Center ? '1085' : '1123'}
        />
        <rect
          className={hoverClass}
          onClick={() => onVerticalConstraintChange(VerticalConstraint.Center)}
          height="660"
          width="300"
          y="750"
          x="995"
          fill="transparent"
        />
        <rect
          fill={currentConstraints.horizontal === HorizontalConstraint.Center ? SELECTED_COLOR : selectionBoxColor}
          height={currentConstraints.horizontal === HorizontalConstraint.Center ? '92' : '46'}
          width="456"
          y={currentConstraints.horizontal === HorizontalConstraint.Center ? '1014' : '1060'}
          x="918"
        />
        <rect
          className={hoverClass}
          onClick={() => onHorizontalConstraintChange(HorizontalConstraint.Center)}
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
