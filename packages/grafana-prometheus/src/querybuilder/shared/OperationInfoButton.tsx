// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/querybuilder/shared/OperationInfoButton.tsx
import { autoUpdate, offset, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import { memo, useState } from 'react';
import * as stylex from '@stylexjs/stylex';

import { renderMarkdown } from '@grafana/data';
import { t } from '@grafana/i18n';
import { FlexItem } from '@grafana/plugin-ui';
import { Button, floatingUtils, Portal } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { operationInfoButtonStyles } from './OperationInfoButton.stylex';
import { type QueryBuilderOperation, type QueryBuilderOperationDef } from './types';

interface Props {
  operation: QueryBuilderOperation;
  def: QueryBuilderOperationDef;
}

export const OperationInfoButton = memo<Props>(({ def, operation }) => {
  const [show, setShow] = useState(false);

  // the order of middleware is important!
  const middleware = [offset(16), ...floatingUtils.getPositioningMiddleware()];

  const { context, refs, floatingStyles } = useFloating({
    open: show,
    placement: 'top',
    onOpenChange: setShow,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, click]);

  return (
    <>
      <Button
        tooltip={t(
          'grafana-prometheus.querybuilder.operation-info-button.title-click-to-show-description',
          'Click to show description'
        )}
        ref={refs.setReference}
        icon="info-circle"
        size="sm"
        variant="secondary"
        fill="text"
        {...getReferenceProps()}
      />
      {show && (
        <Portal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            {...mergeStylexClassName(stylex.props(operationInfoButtonStyles.docBox))}
          >
            <div {...stylex.props(operationInfoButtonStyles.docBoxHeader)}>
              <span>{def.renderer(operation, def, '<expr>')}</span>
              <FlexItem grow={1} />
              <Button
                icon="times"
                onClick={() => setShow(false)}
                fill="text"
                variant="secondary"
                aria-label={t(
                  'grafana-prometheus.querybuilder.operation-info-button.title-remove-operation',
                  'Remove operation'
                )}
              />
            </div>
            <div
              {...stylex.props(operationInfoButtonStyles.docBoxBody)}
              dangerouslySetInnerHTML={{ __html: getOperationDocs(def, operation) }}
            ></div>
          </div>
        </Portal>
      )}
    </>
  );
});

OperationInfoButton.displayName = 'OperationDocs';

function getOperationDocs(def: QueryBuilderOperationDef, op: QueryBuilderOperation): string {
  return renderMarkdown(def.explainHandler ? def.explainHandler(op, def) : (def.documentation ?? 'no docs'));
}
