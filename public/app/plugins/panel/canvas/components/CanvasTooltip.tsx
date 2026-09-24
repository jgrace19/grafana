import { useDialog } from '@react-aria/dialog';
import { useOverlay } from '@react-aria/overlays';
import * as stylex from '@stylexjs/stylex';
import { createRef, useMemo } from 'react';

import {
  type Field,
  type LinkModel,
  FieldType,
  formattedValueToString,
  getFieldDisplayName,
  type ScopedVars,
  type ValueLinkConfig,
  type ActionModel,
} from '@grafana/data';
import { Portal, useTheme2, VizTooltipContainer, usePanelContext } from '@grafana/ui';
import {
  VizTooltipContent,
  VizTooltipFooter,
  VizTooltipHeader,
  type VizTooltipItem,
  CloseButton,
} from '@grafana/ui/internal';
import { colors, shadows, shape, typography } from '@grafana/ui/stylex/tokens.stylex';
import { getActions, getActionsDefaultField } from 'app/features/actions/utils';
import { type Scene } from 'app/features/canvas/runtime/scene';

import { getDataLinks } from '../../status-history/utils';
import { getElementFields, getRowIndex } from '../utils';

interface Props {
  scene: Scene;
}

export const CanvasTooltip = ({ scene }: Props) => {
  const theme = useTheme2();
  const { canExecuteActions } = usePanelContext();
  const userCanExecuteActions = useMemo(() => canExecuteActions?.() ?? false, [canExecuteActions]);

  const onClose = () => {
    if (scene?.tooltipCallback && scene.tooltipPayload) {
      scene.tooltipCallback(undefined);
    }
  };

  const ref = createRef<HTMLElement>();
  const { overlayProps } = useOverlay({ onClose: onClose, isDismissable: true }, ref);
  const { dialogProps } = useDialog({}, ref);

  const element = scene.tooltipPayload?.element;
  if (!element) {
    return <></>;
  }

  // Retrieve timestamp of the last data point if available
  const timeField = scene.data?.series[0]?.fields?.find((field) => field.type === FieldType.time);
  const lastTimeValue = timeField?.values[timeField.values.length - 1];
  const shouldDisplayTimeContentItem =
    timeField && lastTimeValue && element.data.field && getFieldDisplayName(timeField) !== element.data.field;

  const headerItem: VizTooltipItem = {
    label: element.getName(),
    value: '',
  };

  const contentItems: VizTooltipItem[] = [
    {
      label: element.data.field ?? 'Fixed',
      value: element.data.text,
    },
    ...(shouldDisplayTimeContentItem
      ? [
          {
            label: 'Time',
            value: formattedValueToString(timeField?.display!(lastTimeValue)),
          },
        ]
      : []),
  ];

  // NOTE: almost identical to getDataLinks() helper
  const links: Array<LinkModel<Field>> = [];

  if ((element.options.links?.length ?? 0) > 0 && element.getLinks) {
    const linkLookup = new Set<string>();

    element.getLinks({ valueRowIndex: getRowIndex(element.data.field, scene) }).forEach((link) => {
      const key = `${link.title}/${link.href}`;
      if (!linkLookup.has(key)) {
        links.push(link);
        linkLookup.add(key);
      }
    });
  }

  if (scene.data?.series) {
    getElementFields(scene.data?.series, element.options).forEach((field) => {
      links.push(...getDataLinks(field, getRowIndex(element.data.field, scene)));
    });
  }

  const actions: Array<ActionModel<Field>> = [];
  const actionLookup = new Set<string>();

  const elementHasActions = (element.options.actions?.length ?? 0) > 0;
  const frames = scene.data?.series;

  if (elementHasActions && frames && userCanExecuteActions) {
    const defaultField = getActionsDefaultField(element.options.links ?? [], element.options.actions ?? []);
    const scopedVars: ScopedVars = {
      __dataContext: {
        value: {
          data: frames,
          field: defaultField,
          frame: frames[0],
          frameIndex: 0,
        },
      },
    };

    const config: ValueLinkConfig = { valueRowIndex: getRowIndex(element.data.field, scene) };

    const actionsModel = getActions(
      frames[0],
      defaultField,
      scopedVars,
      scene.panel.props.replaceVariables!,
      element.options.actions ?? [],
      config,
      'canvas'
    );

    actionsModel.forEach((action) => {
      const key = `${action.title}/${Math.random()}`;
      if (!actionLookup.has(key)) {
        actions.push(action);
        actionLookup.add(key);
      }
    });
  }

  return (
    <>
      {scene.tooltipPayload?.element && scene.tooltipPayload.anchorPoint && (
        <Portal zIndex={theme.zIndex.tooltip}>
          <VizTooltipContainer
            xstyle={[styles.tooltip, scene.tooltipPayload.isOpen && styles.tooltipPinned]}
            position={{ x: scene.tooltipPayload.anchorPoint.x, y: scene.tooltipPayload.anchorPoint.y }}
            offset={{ x: 5, y: 0 }}
            allowPointerEvents={scene.tooltipPayload.isOpen}
          >
            <section ref={ref} {...overlayProps} {...dialogProps}>
              {scene.tooltipPayload.isOpen && <CloseButton style={{ zIndex: 1 }} onClick={onClose} />}
              <VizTooltipHeader item={headerItem} isPinned={scene.tooltipPayload.isOpen!} />
              {element.data.text && <VizTooltipContent items={contentItems} isPinned={scene.tooltipPayload.isOpen!} />}
              {(links.length > 0 || actions.length > 0) && <VizTooltipFooter dataLinks={links} actions={actions} />}
            </section>
          </VizTooltipContainer>
        </Portal>
      )}
    </>
  );
};

const styles = stylex.create({
  // Over VizTooltipContainer's own look; its inline style already fixes the position at 0, 0.
  tooltip: {
    whiteSpace: 'pre',
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-primary'],
    backgroundImage: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    boxShadow: shadows['--gf-shadows-z2'],
    userSelect: 'text',
    padding: 0,
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  tooltipPinned: {
    boxShadow: shadows['--gf-shadows-z3'],
  },
});
