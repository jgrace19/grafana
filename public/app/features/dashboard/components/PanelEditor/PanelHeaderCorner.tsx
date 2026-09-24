import * as stylex from '@stylexjs/stylex';
import { useCallback, type JSX } from 'react';

import { renderMarkdown, type LinkModelSupplier, type ScopedVars, type IconName } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { locationService, getTemplateSrv } from '@grafana/runtime';
import { Tooltip, type PopoverContent, Icon } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type PanelModel } from 'app/features/dashboard/state/PanelModel';
import { InspectTab } from 'app/features/inspector/types';

import './PanelHeaderCorner.global.css';

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
      <div {...mergeStylexProps(stylex.props(contentStyles.content), { className: 'gf-panel-header-corner-content' })}>
        <div dangerouslySetInnerHTML={{ __html: markedInterpolatedMarkdown }} />

        {linksList && linksList.length > 0 && (
          <ul {...stylex.props(contentStyles.cornerLinks)}>
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
  }, [panel, links]);

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
      <button type="button" {...stylex.props(styles.infoCorner)} onClick={onClick} aria-label={ariaLabel}>
        <Icon
          name={iconMap[infoMode]}
          size={infoMode === InfoMode.Links ? 'sm' : 'lg'}
          xstyle={[styles.icon, infoMode === InfoMode.Links && styles.iconLinks]}
        />
        <span {...stylex.props(styles.inner, infoMode === InfoMode.Error && styles.error)} />
      </button>
    </Tooltip>
  );
}

const iconMap: Record<InfoMode, IconName> = {
  [InfoMode.Error]: 'exclamation',
  [InfoMode.Info]: 'info',
  [InfoMode.Links]: 'external-link-alt',
};

// The markdown's code/pre rules live in PanelHeaderCorner.global.css: StyleX can't target rendered HTML.
const contentStyles = stylex.create({
  content: {
    overflow: 'auto',
  },
  cornerLinks: {
    listStyle: 'none',
    paddingLeft: 0,
  },
});

const styles = stylex.create({
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    fill: colors['--gf-colors-text-max-contrast'],
  },
  iconLinks: {
    left: spacing['--gf-spacing-x0-5'],
    top: spacing['--gf-spacing-x0-25'],
  },
  inner: {
    width: 0,
    height: 0,
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderBottomWidth: spacing['--gf-spacing-x4'],
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    borderLeftWidth: spacing['--gf-spacing-x4'],
    borderLeftStyle: 'solid',
    borderLeftColor: colors['--gf-colors-background-secondary'],
  },
  error: {
    borderLeftColor: colors['--gf-colors-error-main'],
  },
  infoCorner: {
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderStyle: 'none',
    color: colors['--gf-colors-text-secondary'],
    cursor: 'pointer',
    position: 'absolute',
    left: 0,
    top: 0,
    width: spacing['--gf-spacing-x4'],
    height: spacing['--gf-spacing-x4'],
    zIndex: 3,
  },
});
