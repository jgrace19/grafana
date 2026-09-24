import * as stylex from '@stylexjs/stylex';
import { useMemo, useState } from 'react';

import { t } from '@grafana/i18n';
import { type DataQuery } from '@grafana/schema';
import { Input, FieldValidationMessage, Icon, Text } from '@grafana/ui';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { trackRenameInitiated } from '../../tracking';

interface EditableQueryNameProps {
  query: DataQuery;
  queries: DataQuery[];
  onQueryUpdate: (updatedQuery: DataQuery, originalRefId: string) => void;
  readOnly?: boolean;
}

export function EditableQueryName({ query, queries, onQueryUpdate, readOnly }: EditableQueryNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const existingRefIds = useMemo(
    () => new Set(queries.filter((q) => q.refId !== query.refId).map((q) => q.refId)),
    [queries, query.refId]
  );

  const onEditQuery = () => {
    trackRenameInitiated();
    setIsEditing(true);
    setValidationError(null);
  };

  const validateQueryName = (name: string): string | null => {
    if (name === query.refId) {
      return null;
    }

    if (name.length === 0) {
      return t('query-editor-next.validation.empty-name', 'An empty query name is not allowed');
    }

    if (existingRefIds.has(name)) {
      return t('query-editor-next.validation.duplicate-name', 'Query name already exists');
    }

    return null;
  };

  const onEndEditName = (newName: string) => {
    setIsEditing(false);
    setValidationError(null);

    const trimmedName = newName.trim();

    if (validateQueryName(trimmedName)) {
      return;
    }

    if (query.refId !== trimmedName) {
      onQueryUpdate({ ...query, refId: trimmedName }, query.refId);
    }
  };

  const onInputChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const newName = event.currentTarget.value;
    const error = validateQueryName(newName);
    setValidationError(error);
  };

  const onEditQueryBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // Switching cards should cancel in-progress rename edits.
    if (isSidebarCardElement(event.relatedTarget)) {
      setIsEditing(false);
      setValidationError(null);
      return;
    }

    // Any other blur should finish the edit flow (validate + optional rename).
    onEndEditName(event.currentTarget.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const trimmedName = event.currentTarget.value.trim();
      const error = validateQueryName(trimmedName);

      if (error) {
        setValidationError(error);
        return;
      }

      onEndEditName(event.currentTarget.value);
    } else if (event.key === 'Escape') {
      event.stopPropagation(); // Prevent going all the way back to the dashboard scene
      setIsEditing(false);
      setValidationError(null);
    }
  };

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  if (readOnly) {
    return (
      <span {...stylex.props(styles.queryNameText)}>
        <Text color="primary" truncate variant="code">
          {query.refId}
        </Text>
      </span>
    );
  }

  if (isEditing) {
    return (
      <div {...stylex.props(styles.inputRow)}>
        <Input
          type="text"
          defaultValue={query.refId}
          onBlur={onEditQueryBlur}
          autoFocus
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onChange={onInputChange}
          invalid={validationError !== null}
          xstyle={styles.queryNameInput}
          inputXstyle={styles.queryNameInputElement}
          data-testid="query-name-input"
        />
        {validationError && (
          <FieldValidationMessage xstyle={styles.validation}>{validationError}</FieldValidationMessage>
        )}
      </div>
    );
  }

  return (
    <button
      {...stylex.props(styles.queryNameWrapper)}
      onClick={onEditQuery}
      type="button"
      aria-label={t('query-editor-next.edit-query-name', 'Edit query name')}
      title={t('query-editor-next.edit-query-name', 'Edit query name')}
    >
      <span {...stylex.props(styles.queryNameText)}>
        <Text color="primary" element="p" truncate variant="code">
          {query.refId}
        </Text>
      </span>
      <Icon name="pen" xstyle={styles.queryEditIcon} data-edit-icon size="sm" />
    </button>
  );
}

function isSidebarCardElement(target: EventTarget | null) {
  return target instanceof HTMLElement && target.closest('[data-query-sidebar-card]') !== null;
}

const styles = stylex.create({
  // On hover and focus-visible together, the focus-visible border wins, as the later Emotion rule did.
  queryNameWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1-5'],
    cursor: 'pointer',
    borderWidth: { default: '1px', ':hover': { default: '1px', ':focus-visible': '2px' }, ':focus-visible': '2px' },
    borderStyle: {
      default: 'solid',
      ':hover': { default: 'dashed', ':focus-visible': 'solid' },
      ':focus-visible': 'solid',
    },
    borderColor: {
      default: 'transparent',
      ':hover': {
        default: colors['--gf-colors-border-strong'],
        ':focus-visible': colors['--gf-colors-primary-border'],
      },
      ':focus-visible': colors['--gf-colors-primary-border'],
    },
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: spacing['--gf-spacing-x0'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
    overflow: 'hidden',
  },
  queryNameText: {
    display: 'block',
    maxWidth: '180px',
    minWidth: 0,
    overflow: 'hidden',
  },
  queryNameInput: {
    maxWidth: '300px',
  },
  queryNameInputElement: {
    fontFamily: typography['--gf-typography-font-family-monospace'],
  },
  // Floats the validation message under the input.
  validation: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: spacing['--gf-spacing-x0-5'],
    whiteSpace: 'normal',
    maxWidth: 'min(360px, 40vw)',
    zIndex: zIndex.tooltip,
  },
  inputRow: {
    position: 'relative',
  },
  queryEditIcon: {
    color: colors['--gf-colors-text-secondary'],
  },
});
