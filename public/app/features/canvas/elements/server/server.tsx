import * as stylex from '@stylexjs/stylex';

import { type GrafanaTheme2, type LinkModel } from '@grafana/data';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { t } from '@grafana/i18n';
import { type ColorDimensionConfig, type ScalarDimensionConfig } from '@grafana/schema';
import config from 'app/core/config';
import { type DimensionContext } from 'app/features/dimensions/context';
import { ColorDimensionEditor } from 'app/features/dimensions/editors/ColorDimensionEditor';
import { ScalarDimensionEditor } from 'app/features/dimensions/editors/ScalarDimensionEditor';

import { type CanvasElementItem, type CanvasElementOptions, type CanvasElementProps } from '../../element';

import { ServerDatabase } from './types/database';
import { ServerSingle } from './types/single';
import { ServerStack } from './types/stack';
import { ServerTerminal } from './types/terminal';

import { serverCanvasStyles } from './server.stylex';

interface ServerConfig {
  blinkRate?: ScalarDimensionConfig;
  statusColor?: ColorDimensionConfig;
  bulbColor?: ColorDimensionConfig;
  type: ServerType;
}

export interface ServerData {
  blinkRate?: number;
  statusColor?: string;
  bulbColor?: string;
  type: ServerType;
  links?: LinkModel[];
}

enum ServerType {
  Single = 'Single',
  Stack = 'Stack',
  Database = 'Database',
  Terminal = 'Terminal',
}

type Props = CanvasElementProps<ServerConfig, ServerData>;
const outlineColor = config.theme2.colors.text.primary;

const ServerDisplay = ({ data }: Props) => {
  return data ? (
    <svg viewBox="0 0 75 75">
      {data.type === ServerType.Single ? (
        <ServerSingle {...data} />
      ) : data.type === ServerType.Stack ? (
        <ServerStack {...data} />
      ) : data.type === ServerType.Database ? (
        <ServerDatabase {...data} />
      ) : data.type === ServerType.Terminal ? (
        <ServerTerminal {...data} />
      ) : null}
    </svg>
  ) : null;
};

export const serverItem: CanvasElementItem<ServerConfig, ServerData> = {
  id: 'server',
  name: 'Server',
  description: 'Basic server with status',

  display: ServerDisplay,

  defaultSize: {
    width: 100,
    height: 100,
  },

  getNewOptions: (options) => ({
    ...options,
    background: {
      color: {
        fixed: 'transparent',
      },
    },
    placement: {
      width: options?.placement?.width ?? 100,
      height: options?.placement?.height ?? 100,
      top: options?.placement?.top,
      left: options?.placement?.left,
      rotation: options?.placement?.rotation ?? 0,
    },
    config: {
      type: ServerType.Single,
    },
    links: options?.links ?? [],
  }),

  // Called when data changes
  prepareData: (dimensionContext: DimensionContext, elementOptions: CanvasElementOptions<ServerConfig>) => {
    const serverConfig = elementOptions.config;

    const data: ServerData = {
      blinkRate: serverConfig?.blinkRate ? dimensionContext.getScalar(serverConfig.blinkRate).value() : 0,
      statusColor: serverConfig?.statusColor
        ? dimensionContext.getColor(serverConfig.statusColor).value()
        : 'transparent',
      bulbColor: serverConfig?.bulbColor ? dimensionContext.getColor(serverConfig.bulbColor).value() : 'green',
      type: serverConfig?.type ?? ServerType.Single,
    };

    return data;
  },

  registerOptionsUI: (builder) => {
    const category = [t('canvas.server-item.category-server', 'Server')];
    builder
      .addSelect({
        category,
        path: 'config.type',
        name: t('canvas.server-item.name-type', 'Type'),
        settings: {
          options: [
            { value: ServerType.Single, label: t('canvas.server-item.type-options.label-single', 'Single') },
            { value: ServerType.Stack, label: t('canvas.server-item.type-options.label-stack', 'Stack') },
            { value: ServerType.Database, label: t('canvas.server-item.type-options.label-database', 'Database') },
            { value: ServerType.Terminal, label: t('canvas.server-item.type-options.label-terminal', 'Terminal') },
          ],
        },
        defaultValue: ServerType.Single,
      })
      .addCustomEditor({
        category,
        id: 'statusColor',
        path: 'config.statusColor',
        name: t('canvas.server-item.name-status-color', 'Status color'),
        editor: ColorDimensionEditor,
        settings: {},
        defaultValue: {
          fixed: 'transparent',
        },
      })
      .addCustomEditor({
        category,
        id: 'bulbColor',
        path: 'config.bulbColor',
        name: t('canvas.server-item.name-bulb-color', 'Bulb color'),
        editor: ColorDimensionEditor,
        settings: {},
        defaultValue: {
          fixed: 'green',
        },
      })
      .addCustomEditor({
        category,
        id: 'blinkRate',
        path: 'config.blinkRate',
        name: t('canvas.server-item.name-blink-rate', 'Blink rate [hz] (0 = off)'),
        editor: ScalarDimensionEditor,
        settings: { min: 0, max: 100 },
      });
  },
};

export const getServerStyles = (data: ServerData | undefined) => (theme: GrafanaTheme2) => {
  const motionQuery = theme.transitions.handleMotion('no-preference', 'reduce');
  const blinkDuration = data?.blinkRate ? `${1 / data.blinkRate}s` : '0s';

  return {
    bulb: mergeStylexClassName(stylex.props(serverCanvasStyles.bulb), undefined).className ?? '',
    server:
      mergeStylexClassName(
        stylex.props(serverCanvasStyles.server, { fill: data?.statusColor ?? 'transparent' }),
        undefined
      ).className ?? '',
    circle:
      mergeStylexClassName(
        stylex.props(serverCanvasStyles.circle, {
          [motionQuery]: {
            animationDuration: blinkDuration,
          },
          fill: data?.bulbColor,
        }),
        undefined
      ).className ?? '',
    circleBack:
      mergeStylexClassName(stylex.props(serverCanvasStyles.circleBack, { fill: outlineColor }), undefined).className ??
      '',
    outline:
      mergeStylexClassName(stylex.props(serverCanvasStyles.outline, { stroke: outlineColor }), undefined).className ??
      '',
  };
};
