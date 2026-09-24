import * as stylex from '@stylexjs/stylex';
import { upperFirst } from 'lodash';
import { type RefObject, useRef } from 'react';

import { type DataSourceInstanceSettings } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { type DataQuery } from '@grafana/schema';
import { Button, Icon, Text, useTheme2 } from '@grafana/ui';
import { shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { DataSourcePicker } from 'app/features/datasources/components/picker/DataSourcePicker';
import { type ExpressionQuery } from 'app/features/expressions/types';

import { getQueryEditorColors, QUERY_EDITOR_TYPE_CONFIG, QueryEditorType } from '../../constants';
import { useActionsContext, useQueryEditorUIContext, useQueryRunnerContext } from '../QueryEditorContext';
import { type AlertRule, type Transformation } from '../types';
import { getEditorBorderColor } from '../utils';

import { EditableQueryName } from './EditableQueryName';
import { HeaderActions } from './HeaderActions';

import './ContentHeader.css';

// TODO: This is a hacky solution to create an inline datasource picker.
function DatasourceSection({ selectedQuery, onChange }: DatasourceSectionProps) {
  return (
    <div className="gf-content-header-datasource-picker">
      <DataSourcePicker dashboard={true} variables={true} current={selectedQuery.datasource} onChange={onChange} />
    </div>
  );
}

const Separator = () => (
  <Text variant="h4" color="secondary">
    /
  </Text>
);

interface PendingPickerHeaderProps {
  editorType: QueryEditorType;
  label: NonNullable<React.ReactNode>;
  onCancel?: () => void;
  cancelLabel: React.ReactNode;
  headerStyles: stylex.StyleXStyles;
}

function PendingPickerHeader({ editorType, label, onCancel, cancelLabel, headerStyles }: PendingPickerHeaderProps) {
  return (
    <div {...stylex.props(headerStyles)}>
      <div {...stylex.props(styles.leftSection)}>
        <Icon name={QUERY_EDITOR_TYPE_CONFIG[editorType].icon} size="sm" />
        <Text weight="light" variant="body" color="secondary">
          {label}
        </Text>
      </div>
      <Button variant="secondary" fill="text" size="sm" icon="times" onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>
  );
}

/**
 * Props for the standalone ContentHeader component.
 * This interface defines everything needed to render the header without Scene coupling.
 */
export interface ContentHeaderProps {
  selectedAlert: AlertRule | null;
  selectedQuery: DataQuery | ExpressionQuery | null;
  selectedTransformation: Transformation | null;
  queries: DataQuery[];
  cardType: QueryEditorType;
  pendingExpression?: boolean;
  onCancelPendingExpression?: () => void;
  pendingTransformation?: boolean;
  onCancelPendingTransformation?: () => void;
  onChangeDataSource: (ds: DataSourceInstanceSettings, refId: string) => void;
  onUpdateQuery: (updatedQuery: DataQuery, originalRefId: string) => void;
  isMultiSelection?: boolean;
  /**
   * Optional callback to render additional elements in the header's left section.
   *
   * Used for feature parity with legacy QueryEditorRow's renderHeaderExtras prop.
   * In the legacy component, this is used by Alerting to inject:
   * - Query options (max data points, min interval)
   * - Alert condition indicators
   * - Alerting-specific tooltips
   */
  renderHeaderExtras?: () => React.ReactNode;
  /**
   * Optional ref to the container div.
   * Used downstream for saved queries positioning.
   */
  containerRef?: RefObject<HTMLDivElement>;
}

/**
 * Standalone, prop-based query editor header component.
 * Can be used in both Scene-based and non-Scene contexts (e.g., Alerting, Explore).
 *
 * @remarks
 * This component is fully decoupled from React Context and Scenes state.
 * All data and callbacks are passed via props, making it reusable across
 * different architectural patterns.
 */
export function ContentHeader({
  selectedAlert,
  selectedQuery,
  selectedTransformation,
  queries,
  cardType,
  pendingExpression,
  onCancelPendingExpression,
  pendingTransformation,
  onCancelPendingTransformation,
  onChangeDataSource,
  onUpdateQuery,
  isMultiSelection,
  renderHeaderExtras,
  containerRef: externalContainerRef,
}: ContentHeaderProps) {
  // Fallback ref if none provided (for saved queries positioning)
  const internalContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = externalContainerRef || internalContainerRef;

  const theme = useTheme2();
  const headerStyles = [
    styles.container,
    styles.colors(
      getQueryEditorColors(theme).contentHeaderBackground,
      getEditorBorderColor({ theme, editorType: cardType, alertState: selectedAlert?.state })
    ),
  ];

  if (pendingExpression) {
    return (
      <PendingPickerHeader
        editorType={QueryEditorType.Expression}
        label={<Trans i18nKey="query-editor-next.header.pending-expression">Select an Expression</Trans>}
        onCancel={onCancelPendingExpression}
        cancelLabel={<Trans i18nKey="query-editor-next.header.pending-expression-cancel">Cancel</Trans>}
        headerStyles={headerStyles}
      />
    );
  }

  if (pendingTransformation) {
    return (
      <PendingPickerHeader
        editorType={QueryEditorType.Transformation}
        label={<Trans i18nKey="query-editor-next.header.pending-transformation">Select a Transformation</Trans>}
        onCancel={onCancelPendingTransformation}
        cancelLabel={<Trans i18nKey="query-editor-next.header.pending-transformation-cancel">Cancel</Trans>}
        headerStyles={headerStyles}
      />
    );
  }

  if (!selectedQuery && !selectedTransformation && !selectedAlert) {
    return null;
  }

  return (
    <div {...stylex.props(headerStyles)} ref={containerRef}>
      <div {...stylex.props(styles.leftSection)}>
        <Icon name={QUERY_EDITOR_TYPE_CONFIG[cardType].icon} size="sm" />

        {cardType === QueryEditorType.Alert && selectedAlert && (
          <>
            <Text weight="light" variant="body" color="primary">
              <Trans i18nKey="query-editor-next.header.alert">Alert</Trans>
            </Text>
            <Separator />
            <Text weight="light" variant="code" color="primary">
              {selectedAlert.rule.name}
            </Text>
          </>
        )}

        {cardType === QueryEditorType.Query && selectedQuery && (
          <>
            <DatasourceSection
              selectedQuery={selectedQuery}
              onChange={(ds) => onChangeDataSource(ds, selectedQuery.refId)}
            />
            <Separator />
          </>
        )}

        {cardType === QueryEditorType.Expression && selectedQuery && 'type' in selectedQuery && (
          <>
            <Text weight="light" variant="body" color="primary">
              {upperFirst(selectedQuery.type)} <Trans i18nKey="query-editor-next.header.expression">Expression</Trans>
            </Text>
            <Separator />
          </>
        )}

        {cardType === QueryEditorType.Transformation && selectedTransformation && (
          <>
            <Text weight="light" variant="body" color="primary">
              <Trans i18nKey="query-editor-next.header.transformation">Transformation</Trans>
            </Text>
            <Separator />
            <Text weight="light" variant="code" color="primary">
              {selectedTransformation.registryItem?.name || selectedTransformation.transformConfig.id}
            </Text>
          </>
        )}

        {selectedQuery && cardType !== QueryEditorType.Alert && (
          <>
            <EditableQueryName
              key={selectedQuery.refId}
              query={selectedQuery}
              queries={queries}
              onQueryUpdate={onUpdateQuery}
              readOnly={isMultiSelection}
            />
            {renderHeaderExtras && <div {...stylex.props(styles.headerExtras)}>{renderHeaderExtras()}</div>}
          </>
        )}
      </div>
      <HeaderActions containerRef={containerRef} />
    </div>
  );
}

/**
 * Scene-aware wrapper for ContentHeader.
 * Reads state from Scene contexts and passes as props to the standalone component.
 *
 * @remarks
 * Use this component in Scene-based contexts (e.g., Dashboard panel editing).
 * For non-Scene contexts, use ContentHeader directly with props.
 */
export function ContentHeaderSceneWrapper({
  renderHeaderExtras,
}: {
  renderHeaderExtras?: () => React.ReactNode;
} = {}) {
  const {
    selectedAlert,
    selectedQuery,
    selectedTransformation,
    selectedQueryRefIds,
    cardType,
    pendingExpression,
    setPendingExpression,
    pendingTransformation,
    setPendingTransformation,
  } = useQueryEditorUIContext();
  const { queries } = useQueryRunnerContext();
  const { changeDataSource, updateSelectedQuery } = useActionsContext();

  return (
    <ContentHeader
      selectedAlert={selectedAlert}
      selectedQuery={selectedQuery}
      selectedTransformation={selectedTransformation}
      queries={queries}
      cardType={cardType}
      pendingExpression={!!pendingExpression}
      onCancelPendingExpression={() => setPendingExpression(null)}
      pendingTransformation={!!pendingTransformation}
      onCancelPendingTransformation={() => setPendingTransformation(null)}
      onChangeDataSource={changeDataSource}
      onUpdateQuery={updateSelectedQuery}
      isMultiSelection={selectedQueryRefIds.length > 1}
      renderHeaderExtras={renderHeaderExtras}
    />
  );
}

interface DatasourceSectionProps {
  selectedQuery: DataQuery;
  onChange: (ds: DataSourceInstanceSettings) => void;
}

const styles = stylex.create({
  container: {
    position: 'relative',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: `calc(${spacing['--gf-spacing-x0-5']} + 4px)`,
    borderTopLeftRadius: shape['--gf-shape-radius-default'],
    borderTopRightRadius: shape['--gf-shape-radius-default'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['--gf-spacing-x1'],
    minHeight: spacing['--gf-spacing-x5'],
    // psuedo-element to show the border color on the left of the header
    '::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      borderTopLeftRadius: shape['--gf-shape-radius-default'],
    },
  },
  colors: (backgroundColor: string, borderColor: string) => ({
    backgroundColor,
    '::before': {
      backgroundColor: borderColor,
    },
  }),
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
  headerExtras: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: spacing['--gf-spacing-x1'],
  },
});
