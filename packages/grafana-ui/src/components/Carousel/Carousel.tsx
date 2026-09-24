import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { OverlayContainer, useOverlay } from '@react-aria/overlays';
import * as stylex from '@stylexjs/stylex';
import { useState, useEffect, useRef, useId } from 'react';

import { t } from '@grafana/i18n';

import { zIndex } from '../../themes/stylex/constants.stylex';
import { colors, components, shadows, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { Alert } from '../Alert/Alert';
import { IconButton } from '../IconButton/IconButton';

// Define the image item interface
export interface CarouselImage {
  path: string;
  name: string;
}

export interface CarouselProps {
  images: CarouselImage[];
}

/**
 * The Carousel component displays a grid of image thumbnails that can be clicked to view full-sized images in a modal with navigation controls. It provides an elegant way to present collections of images or screenshots with fullscreen preview capabilities.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/overlays-carousel--docs
 */
export const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [validImages, setValidImages] = useState<CarouselImage[]>(images);
  const id = useId();

  const handleImageError = (path: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [path]: true,
    }));
  };

  useEffect(() => {
    const filteredImages = images.filter((image) => !imageErrors[image.path]);
    setValidImages(filteredImages);
  }, [imageErrors, images]);

  const openPreview = (index: number) => {
    setSelectedIndex(index);
  };

  const closePreview = () => {
    setSelectedIndex(null);
  };

  const goToNext = () => {
    if (selectedIndex !== null && validImages.length > 0) {
      setSelectedIndex((selectedIndex + 1) % validImages.length);
    }
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && validImages.length > 0) {
      setSelectedIndex((selectedIndex - 1 + validImages.length) % validImages.length);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (selectedIndex === null) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
        goToNext();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'Escape':
        closePreview();
        break;
      default:
        break;
    }
  };

  const ref = useRef<HTMLDivElement>(null);

  const { overlayProps, underlayProps } = useOverlay({ isOpen: selectedIndex !== null, onClose: closePreview }, ref);
  const { dialogProps } = useDialog({}, ref);

  if (validImages.length === 0) {
    return (
      <Alert
        title={t('carousel.error', 'Something went wrong loading images')}
        severity="warning"
        data-testid="alert-warning"
      />
    );
  }

  return (
    <>
      <div {...stylex.props(styles.imageGrid)}>
        {validImages.map((image, index) => {
          const imageNameId = `${id}-carousel-image-${index}`;
          return (
            <button
              aria-label={t('grafana-ui.carousel.aria-label-open-image', 'Open image preview')}
              aria-describedby={imageNameId}
              type="button"
              key={image.path}
              onClick={() => openPreview(index)}
              {...stylex.props(styles.imageButton)}
            >
              <img
                src={image.path}
                alt=""
                onError={() => handleImageError(image.path)}
                {...stylex.props(styles.imageGridImage)}
              />
              <p id={imageNameId} {...stylex.props(styles.imageGridName)}>
                {image.name}
              </p>
            </button>
          );
        })}
      </div>

      {selectedIndex !== null && (
        <OverlayContainer>
          <div role="presentation" {...stylex.props(styles.underlay)} onClick={closePreview} {...underlayProps} />
          <FocusScope contain autoFocus restoreFocus>
            {/* convenience method for keyboard users */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              data-testid="carousel-full-screen"
              ref={ref}
              {...overlayProps}
              {...dialogProps}
              onKeyDown={handleKeyDown}
              {...stylex.props(styles.overlay)}
            >
              <IconButton
                name="times"
                aria-label={t('carousel.close', 'Close')}
                size="xl"
                onClick={closePreview}
                xstyle={styles.close}
              />

              <IconButton
                size="xl"
                name="angle-left"
                aria-label={t('carousel.previous', 'Previous')}
                onClick={goToPrevious}
                data-testid="previous-button"
              />

              <div {...stylex.props(styles.imageContainer)} data-testid="carousel-full-image">
                <img
                  {...stylex.props(styles.imagePreview)}
                  src={validImages[selectedIndex].path}
                  alt={validImages[selectedIndex].name}
                  onError={() => handleImageError(validImages[selectedIndex].path)}
                />
              </div>

              <IconButton
                size="xl"
                name="angle-right"
                aria-label={t('carousel.next', 'Next')}
                onClick={goToNext}
                data-testid="next-button"
              />
            </div>
          </FocusScope>
        </OverlayContainer>
      )}
    </>
  );
};

const grid = spacing['--gf-spacing-grid-size'];

const styles = stylex.create({
  close: {
    color: colors['--gf-colors-text-primary'],
    position: 'fixed',
    top: `calc(${grid} * 2)`,
    right: `calc(${grid} * 2)`,
  },
  // Also resets the native button (the old clearButtonStyles).
  imageButton: {
    backgroundColor: 'transparent',
    color: colors['--gf-colors-text-primary'],
    borderStyle: 'none',
    padding: 0,
    textAlign: 'left',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    flex: '1',
  },
  imagePreview: {
    borderRadius: shape['--gf-shape-radius-lg'],
    maxWidth: '100%',
    maxHeight: '80vh',
    objectFit: 'contain',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
    gap: `calc(${grid} * 2)`,
    marginBottom: '20px',
  },
  imageGridImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    // `border: <color>` only sets the colour; the style stays none.
    borderColor: colors['--gf-colors-border-strong'],
    borderStyle: 'none',
    borderRadius: shape['--gf-shape-radius-default'],
    boxShadow: shadows['--gf-shadows-z1'],
  },
  imageGridName: {
    marginTop: `calc(${grid} * 0.5)`,
    marginRight: 0,
    marginBottom: `calc(${grid} * 0.5)`,
    marginLeft: 0,
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-text-primary'],
  },
  underlay: {
    position: 'fixed',
    zIndex: zIndex.modalBackdrop,
    inset: 0,
    backgroundColor: components['--gf-components-overlay-background'],
  },
  overlay: {
    alignItems: 'center',
    display: 'flex',
    gap: grid,
    height: 'fit-content',
    marginBottom: 'auto',
    marginTop: 'auto',
    paddingTop: `calc(${grid} * 2)`,
    paddingRight: `calc(${grid} * 2)`,
    paddingBottom: `calc(${grid} * 2)`,
    paddingLeft: `calc(${grid} * 2)`,
    position: 'fixed',
    inset: 0,
    zIndex: zIndex.modal,
  },
});
