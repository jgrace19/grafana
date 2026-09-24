import * as stylex from '@stylexjs/stylex';
import { kQLPreviewStyles } from './KQLPreview.stylex';

import Prism from 'prismjs';
import React, { useEffect } from 'react';

import { Trans, t } from '@grafana/i18n';
import { EditorField, EditorFieldGroup, EditorRow } from '@grafana/plugin-ui';
import { Button } from '@grafana/ui';

import 'prismjs/components/prism-kusto';
import 'prismjs/themes/prism-tomorrow.min.css';

interface KQLPreviewProps {
  query: string;
  hidden: boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const KQLPreview: React.FC<KQLPreviewProps> = ({ query, hidden, setHidden }) => {

  useEffect(() => {
    Prism.highlightAll();
  }, [query]);

  return (
    <EditorRow>
      <EditorFieldGroup>
        <EditorField label={t('components.kql-preview.label-query-preview', 'Query Preview')}>
          <>
            <Button hidden={!hidden} variant="secondary" onClick={() => setHidden(false)} size="sm">
              <Trans i18nKey="components.kql-preview.button-show">Show</Trans>
            </Button>
            <div {...stylex.props(kQLPreviewStyles.codeBlock)} hidden={hidden}>
              <pre {...stylex.props(kQLPreviewStyles.code)}>
                <code className="language-kusto">{query}</code>
              </pre>
            </div>
            <Button hidden={hidden} variant="secondary" onClick={() => setHidden(true)} size="sm">
              <Trans i18nKey="components.kql-preview.button-hide">Hide</Trans>
            </Button>
          </>
        </EditorField>
      </EditorFieldGroup>
    </EditorRow>
  );
};

;

export default KQLPreview;
