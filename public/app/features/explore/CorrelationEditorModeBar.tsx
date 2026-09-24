import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { useBeforeUnload, useUnmount } from 'react-use';

import { type GrafanaTheme2, colorManipulator } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Button, Icon, Stack, Tooltip, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { Prompt } from 'app/core/components/FormPrompt/Prompt';
import { CORRELATION_EDITOR_POST_CONFIRM_ACTION, type ExploreItemState } from 'app/types/explore';
import { useDispatch, useSelector } from 'app/types/store';

import { CorrelationUnsavedChangesModal } from './CorrelationUnsavedChangesModal';
import { showModalMessage } from './correlationEditLogic';
import { saveCurrentCorrelation } from './state/correlations';
import { changeDatasource } from './state/datasource';
import { changeCorrelationHelperData } from './state/explorePane';
import { changeCorrelationEditorDetails, splitClose } from './state/main';
import { runQueries } from './state/query';
import { selectCorrelationDetails, selectIsHelperShowing } from './state/selectors';

import './CorrelationEditorModeBar.css';

export const CorrelationEditorModeBar = ({ panes }: { panes: Array<[string, ExploreItemState]> }) => {
  const dispatch = useDispatch();
  const theme = useTheme2();
  const barColors = useMemo(() => getBarColors(theme), [theme]);
  const correlationDetails = useSelector(selectCorrelationDetails);
  const isHelperShowing = useSelector(selectIsHelperShowing);
  const [saveMessage, setSaveMessage] = useState<string | undefined>(undefined); // undefined means do not show

  // handle refreshing and closing the tab
  useBeforeUnload(correlationDetails?.correlationDirty || false, 'Save correlation?');
  useBeforeUnload(
    (!correlationDetails?.correlationDirty && correlationDetails?.queryEditorDirty) || false,
    'The query editor was changed. Save correlation before continuing?'
  );

  // decide if we are displaying prompt, perform action if not
  useEffect(() => {
    if (correlationDetails?.isExiting) {
      const { correlationDirty, queryEditorDirty } = correlationDetails;
      let isActionLeft = undefined;
      let action = undefined;
      if (correlationDetails.postConfirmAction) {
        isActionLeft = correlationDetails.postConfirmAction.isActionLeft;
        action = correlationDetails.postConfirmAction.action;
      } else {
        // closing the editor only
        action = CORRELATION_EDITOR_POST_CONFIRM_ACTION.CLOSE_EDITOR;
        isActionLeft = false;
      }

      const modalMessage = showModalMessage(action, isActionLeft, correlationDirty, queryEditorDirty);
      if (modalMessage !== undefined) {
        setSaveMessage(modalMessage);
      } else {
        // if no prompt, perform action
        if (
          action === CORRELATION_EDITOR_POST_CONFIRM_ACTION.CHANGE_DATASOURCE &&
          correlationDetails.postConfirmAction
        ) {
          const { exploreId, changeDatasourceUid } = correlationDetails?.postConfirmAction;
          if (exploreId && changeDatasourceUid) {
            dispatch(
              changeDatasource({ exploreId, datasource: changeDatasourceUid, options: { importQueries: true } })
            );
            dispatch(
              changeCorrelationEditorDetails({
                isExiting: false,
              })
            );
          }
        } else if (
          action === CORRELATION_EDITOR_POST_CONFIRM_ACTION.CLOSE_PANE &&
          correlationDetails.postConfirmAction
        ) {
          const { exploreId } = correlationDetails?.postConfirmAction;
          if (exploreId !== undefined) {
            dispatch(splitClose(exploreId));
            dispatch(
              changeCorrelationEditorDetails({
                isExiting: false,
              })
            );
          }
        } else if (action === CORRELATION_EDITOR_POST_CONFIRM_ACTION.CLOSE_EDITOR) {
          dispatch(
            changeCorrelationEditorDetails({
              editorMode: false,
            })
          );
        }
      }
    }
  }, [correlationDetails, dispatch, isHelperShowing]);

  // clear data when unmounted
  useUnmount(() => {
    dispatch(
      changeCorrelationEditorDetails({
        editorMode: false,
        isExiting: false,
        correlationDirty: false,
        label: undefined,
        description: undefined,
        canSave: false,
      })
    );

    panes.forEach((pane) => {
      dispatch(
        changeCorrelationHelperData({
          exploreId: pane[0],
          correlationEditorHelperData: undefined,
        })
      );
      dispatch(runQueries({ exploreId: pane[0] }));
    });
  });

  const resetEditor = () => {
    dispatch(
      changeCorrelationEditorDetails({
        editorMode: true,
        isExiting: false,
        correlationDirty: false,
        label: undefined,
        description: undefined,
        canSave: false,
      })
    );

    panes.forEach((pane) => {
      dispatch(
        changeCorrelationHelperData({
          exploreId: pane[0],
          correlationEditorHelperData: undefined,
        })
      );
      dispatch(runQueries({ exploreId: pane[0] }));
    });
  };

  const closePane = (exploreId: string) => {
    setSaveMessage(undefined);
    dispatch(splitClose(exploreId));
    reportInteraction('grafana_explore_split_view_closed');
  };

  const changeDatasourcePostAction = (exploreId: string, datasourceUid: string) => {
    setSaveMessage(undefined);
    dispatch(changeDatasource({ exploreId, datasource: datasourceUid, options: { importQueries: true } }));
  };

  const saveCorrelationPostAction = (skipPostConfirmAction: boolean) => {
    dispatch(
      saveCurrentCorrelation(
        correlationDetails?.label,
        correlationDetails?.description,
        correlationDetails?.transformations
      )
    );
    if (!skipPostConfirmAction && correlationDetails?.postConfirmAction !== undefined) {
      const { exploreId, action, changeDatasourceUid } = correlationDetails?.postConfirmAction;
      if (action === CORRELATION_EDITOR_POST_CONFIRM_ACTION.CLOSE_PANE) {
        closePane(exploreId);
        resetEditor();
      } else if (
        action === CORRELATION_EDITOR_POST_CONFIRM_ACTION.CHANGE_DATASOURCE &&
        changeDatasourceUid !== undefined
      ) {
        changeDatasource({ exploreId, datasource: changeDatasourceUid });
        resetEditor();
      }
    } else {
      dispatch(changeCorrelationEditorDetails({ editorMode: false, correlationDirty: false, isExiting: false }));
    }
  };

  return (
    <>
      {/* Handle navigating outside Explore */}
      <Prompt
        message={(location) => {
          if (
            location.pathname !== '/explore' &&
            correlationDetails?.editorMode &&
            correlationDetails?.correlationDirty
          ) {
            return 'You have unsaved correlation data. Continue?';
          } else {
            return true;
          }
        }}
      />

      {saveMessage !== undefined && (
        <CorrelationUnsavedChangesModal
          onDiscard={() => {
            if (correlationDetails?.postConfirmAction !== undefined) {
              const { exploreId, action, changeDatasourceUid } = correlationDetails?.postConfirmAction;
              if (action === CORRELATION_EDITOR_POST_CONFIRM_ACTION.CLOSE_PANE) {
                closePane(exploreId);
              } else if (
                action === CORRELATION_EDITOR_POST_CONFIRM_ACTION.CHANGE_DATASOURCE &&
                changeDatasourceUid !== undefined
              ) {
                changeDatasourcePostAction(exploreId, changeDatasourceUid);
              }
              dispatch(changeCorrelationEditorDetails({ isExiting: false }));
            } else {
              // exit correlations mode
              // if we are discarding the in progress correlation, reset everything
              // this modal only shows if the editorMode is false, so we just need to update the dirty state
              dispatch(
                changeCorrelationEditorDetails({
                  editorMode: false,
                  correlationDirty: false,
                  isExiting: false,
                })
              );
            }
          }}
          onCancel={() => {
            // if we are cancelling the exit, set the editor mode back to true and hide the prompt
            dispatch(changeCorrelationEditorDetails({ isExiting: false }));
            setSaveMessage(undefined);
          }}
          onSave={() => {
            saveCorrelationPostAction(false);
          }}
          message={saveMessage}
        />
      )}
      <div {...mergeStylexProps(stylex.props(styles.correlationEditorTop), { style: barColors.vars })}>
        <Stack gap={2} justifyContent="flex-end" alignItems="center">
          <Tooltip
            content={t(
              'explore.correlation-editor-mode-bar.content-correlations-editor-explore-experimental-feature',
              'Correlations editor in Explore is an experimental feature.'
            )}
          >
            <Icon xstyle={styles.iconColor(barColors.contrastColor)} name="info-circle" size="xl" />
          </Tooltip>
          <Button
            variant="secondary"
            disabled={!correlationDetails?.canSave}
            fill="outline"
            className={
              correlationDetails?.canSave ? 'gf-explore-correlation-button' : 'gf-explore-correlation-button-disabled'
            }
            onClick={() => {
              saveCorrelationPostAction(true);
            }}
          >
            <Trans i18nKey="explore.correlation-editor-mode-bar.save">Save</Trans>
          </Button>
          <Button
            variant="secondary"
            fill="outline"
            className="gf-explore-correlation-button"
            icon="times"
            onClick={() => {
              dispatch(changeCorrelationEditorDetails({ isExiting: true }));
              reportInteraction('grafana_explore_correlation_editor_exit_pressed');
            }}
          >
            <Trans i18nKey="explore.correlation-editor-mode-bar.exit-correlation-editor">Exit correlation editor</Trans>
          </Button>
        </Stack>
      </div>
    </>
  );
};

// Colour math on the theme's primary colour; the Button overrides in CorrelationEditorModeBar.css read the vars.
function getBarColors(theme: GrafanaTheme2) {
  const contrastColor = theme.colors.getContrastText(theme.colors.primary.main);
  const vars: CSSProperties & Record<string, string> = {
    '--gf-explore-correlation-contrast': contrastColor,
    '--gf-explore-correlation-hover-background': colorManipulator.lighten(theme.colors.primary.main, 0.1),
    '--gf-explore-correlation-disabled-background': colorManipulator.darken(theme.colors.primary.main, 0.2),
    '--gf-explore-correlation-disabled-text': colorManipulator.darken(contrastColor, 0.2),
  };
  return { contrastColor, vars };
}

const styles = stylex.create({
  correlationEditorTop: {
    backgroundColor: colors['--gf-colors-primary-main'],
    marginTop: '3px',
    padding: spacing['--gf-spacing-x1'],
  },
  iconColor: (color: string) => ({
    color,
  }),
});
