import * as stylex from '@stylexjs/stylex';
import { useMemo, useEffect } from 'react';
import { useMeasure } from 'react-use';

import { t } from '@grafana/i18n';
import { Alert, LoadingBar, Text } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

type ErrorState = {
  message: string;
  title: string;
} | null;

interface ImagePreviewProps {
  imageBlob: Blob | null;
  isLoading: boolean;
  error: ErrorState;
  title?: string;
}

export function ImagePreview({ imageBlob, isLoading, error, title }: ImagePreviewProps) {
  const [ref, { width: measuredWidth }] = useMeasure<HTMLDivElement>();

  // Memoize and clean up the object URL for the image
  const imageUrl = useMemo(() => {
    if (!imageBlob) {
      return undefined;
    }
    const url = URL.createObjectURL(imageBlob);
    return url;
  }, [imageBlob]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div
      {...stylex.props(styles.previewContainer)}
      ref={ref}
      aria-label={t('share-modal.image.preview-region', 'Image preview')}
      role="region"
    >
      {isLoading && (
        <div
          {...stylex.props(styles.loadingBarContainer)}
          role="status"
          aria-label={t('share-modal.image.generating', 'Generating image...')}
        >
          <LoadingBar width={measuredWidth} />
          {title && (
            <div {...stylex.props(styles.titleContainer)}>
              <Text variant="body">{title}</Text>
            </div>
          )}
        </div>
      )}

      {error && !isLoading && <ErrorAlert error={error} />}
      {!isLoading && imageUrl && (
        <img
          src={imageUrl}
          alt={t('share-modal.image.preview', 'Preview')}
          {...stylex.props(styles.image)}
          aria-label={t('share-modal.image.preview-aria', 'Generated image preview')}
        />
      )}
    </div>
  );
}

function ErrorAlert({ error }: { error: ErrorState }) {
  if (!error) {
    return null;
  }

  // Only show message if it's different from the title to avoid repetition
  const showMessage = error.message && error.message !== error.title;

  return (
    <Alert severity="error" title={error.title}>
      {showMessage && <div>{error.message}</div>}
    </Alert>
  );
}

const styles = stylex.create({
  previewContainer: {
    position: 'relative',
    width: '100%',
    minHeight: '200px',
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-default'],
    overflow: 'hidden',
  },
  loadingBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  titleContainer: {
    padding: spacing['--gf-spacing-x1'],
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
});
