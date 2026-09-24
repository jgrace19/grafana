import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef } from 'react';

import { type LogRowModel } from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Menu } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';

import { copyText } from '../../logs/utils';

interface PopoverMenuProps {
  selection: string;
  x: number;
  y: number;
  onClickFilterString?: (value: string, refId?: string) => void;
  onClickFilterOutString?: (value: string, refId?: string) => void;
  onClickSearchString?: (text: string) => void;
  onDisable: () => void;
  row: LogRowModel;
  close: () => void;
}

export const PopoverMenu = ({
  x,
  y,
  onClickFilterString,
  onClickFilterOutString,
  onClickSearchString,
  selection,
  row,
  close,
  ...props
}: PopoverMenuProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close();
      }
    }
    document.addEventListener('keyup', handleEscape);

    return () => {
      document.removeEventListener('keyup', handleEscape);
    };
  }, [close]);

  const onDisable = useCallback(() => {
    track('popover_menu_disabled', selection.length, row.datasourceType);
    props.onDisable();
  }, [props, row.datasourceType, selection.length]);

  const supported = onClickFilterString || onClickFilterOutString || onClickSearchString;

  if (!supported) {
    return null;
  }

  return (
    <>
      <div {...mergeStylexProps(stylex.props(styles.menu), { style: { top: y, left: x } })}>
        <Menu ref={containerRef}>
          <Menu.Item
            label={t('logs.popover-menu.copy', 'Copy selection')}
            onClick={() => {
              copyText(selection, containerRef);
              close();
              track('copy', selection.length, row.datasourceType);
            }}
          />
          {onClickFilterString && (
            <Menu.Item
              label={t('logs.popover-menu.line-contains', 'Add as line contains filter')}
              onClick={() => {
                onClickFilterString(selection, row.dataFrame.refId);
                close();
                track('line_contains', selection.length, row.datasourceType);
              }}
            />
          )}
          {onClickFilterOutString && (
            <Menu.Item
              label={t('logs.popover-menu.line-contains-not', 'Add as line does not contain filter')}
              onClick={() => {
                onClickFilterOutString(selection, row.dataFrame.refId);
                close();
                track('line_does_not_contain', selection.length, row.datasourceType);
              }}
            />
          )}
          <Menu.Divider />
          {onClickSearchString && (
            <Menu.Item
              label={t('logs.popover-menu.search-text', 'Search in results')}
              onClick={() => {
                onClickSearchString(selection);
                close();
                track('search_text', selection.length, row.datasourceType);
              }}
            />
          )}
          <Menu.Divider />
          <Menu.Item label={t('logs.popover-menu.disable-menu', 'Disable menu')} onClick={onDisable} />
        </Menu>
      </div>
    </>
  );
};

function track(action: string, selectionLength: number, dataSourceType: string | undefined) {
  reportInteraction(`grafana_explore_logs_popover_menu`, {
    action,
    selectionLength: selectionLength,
    datasourceType: dataSourceType || 'unknown',
  });
}

const styles = stylex.create({
  menu: {
    position: 'fixed',
    zIndex: zIndex.modal,
  },
});
