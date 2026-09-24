import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { panelHeaderCornerStyles } from './PanelHeaderCorner.stylex';
import { useCallback, type JSX } from 'react';

import {
  type GrafanaTheme2,
  renderMarkdown,
  type LinkModelSupplier,
  type ScopedVars,
  type IconName,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { locationService, getTemplateSrv } from '@grafana/runtime';
import { Tooltip, type PopoverContent, Icon, useStyles2 } from '@grafana/ui';
import { type PanelModel } from 'app/features/dashboard/state/PanelModel';
import { InspectTab } from 'app/features/inspector/types';

enum InfoMode {
  Error = 'Error',
  Info = 'Info',
  Links = 'Links',
}

export interface Props {
  panel: PanelModel;
  title?: string;
  description?: string;
  scopedVars?: ScopedVars;
  links?: LinkModelSupplier<PanelModel>;
  error?: string;
}

export function PanelHeaderCorner({ panel, links, error }: Props) {

  const getInfoMode = useCallback(() => {
    if (error) {
      return InfoMode.Error;
    }
    if (!!panel.description) {
      return InfoMode.Info;
    }
    if (panel.links && panel.links.length) {
      return InfoMode.Links;
    }

    return undefined;
  }, [panel, error]);

  const getInfoContent = useCallback((): JSX.Element => {
    const markdown = panel.description || '';
    const interpolatedMarkdown = getTemplateSrv().replace(markdown, panel.scopedVars);
    const markedInterpolatedMarkdown = renderMarkdown(interpolatedMarkdown);
    const linksList = links && links.getLinks(panel.replaceVariables);

    return (
      <div {...stylex.props(panelHeaderCornerStyles.content)}>
        <div dangerouslySetInnerHTML={{ __html: markedInterpolatedMarkdown }} />

        {linksList && linksList.length > 0 && (
          <ul {...stylex.props(panelHeaderCornerStyles.cornerLinks)}>
            {linksList.map((link, idx) => {
              return (
                <li key={idx}>
                  <a href={link.href} target={link.target}>
                    {link.title}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }, [panel, links, styles]);

  /**
   * Open the Panel Inspector when we click on an error
   */
  const onClickError = useCallback(() => {
    locationService.partial({
      inspect: panel.id,
      inspectTab: InspectTab.Error,
    });
  }, [panel.id]);

  const infoMode: InfoMode | undefined = getInfoMode();

  if (!infoMode) {
    return null;
  }

  if (infoMode === InfoMode.Error && error) {
    return <PanelInfoCorner infoMode={infoMode} content={error} onClick={onClickError} />;
  }

  if (infoMode === InfoMode.Info || infoMode === InfoMode.Links) {
    return <PanelInfoCorner infoMode={infoMode} content={getInfoContent} />;
  }

  return null;
}

export default PanelHeaderCorner;

interface PanelInfoCornerProps {
  infoMode: InfoMode;
  content: PopoverContent;
  onClick?: () => void;
}

function PanelInfoCorner({ infoMode, content, onClick }: PanelInfoCornerProps) {
  const theme = infoMode === InfoMode.Error ? 'error' : 'info';
  const ariaLabel = selectors.components.Panels.Panel.headerCornerInfo(infoMode.toLowerCase());

  return (
    <Tooltip content={content} placement="top-start" theme={theme} interactive>
      <button type="button" {...stylex.props(panelHeaderCornerStyles.infoCorner)} onClick={onClick} aria-label={ariaLabel}>
        <Icon
          name={iconMap[infoMode]}
          size={infoMode === InfoMode.Links ? 'sm' : 'lg'}
          {...mergeStylexClassName(stylex.props(panelHeaderCornerStyles.icon, , { [mergeStylexClassName(stylex.props(panelHeaderCornerStyles.iconLinks), undefined).className]: infoMode === InfoMode.Links }), undefined)}
        />
        <span {...mergeStylexClassName(stylex.props(panelHeaderCornerStyles.inner, , { [mergeStylexClassName(stylex.props(panelHeaderCornerStyles.error), undefined).className]: infoMode === InfoMode.Error }), undefined)} />
      </button>
    </Tooltip>
  );
}

const iconMap: Record<InfoMode, IconName> = {
  [InfoMode.Error]: 'exclamation',
  [InfoMode.Info]: 'info',
  [InfoMode.Links]: 'external-link-alt',
};


;
