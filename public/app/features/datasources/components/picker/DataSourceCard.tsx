import clsx from 'clsx';

import { type DataSourceInstanceSettings, type GrafanaTheme2 } from '@grafana/data';
import { Card, Icon, TagList, useTheme2 } from '@grafana/ui';

interface DataSourceCardProps {
  ds: DataSourceInstanceSettings;
  onClick: () => void;
  selected: boolean;
  description?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (ds: DataSourceInstanceSettings) => void;
}

export function DataSourceCard({
  ds,
  onClick,
  selected,
  description,
  isFavorite = false,
  onToggleFavorite,
  ...htmlProps
}: DataSourceCardProps) {
  const theme = useTheme2();
  const styles = getStyles(theme, ds.meta.builtIn);

  return (
    <Card
      key={ds.uid}
      noMargin
      onClick={onClick}
      {...mergeStylexClassName(stylex.props(dataSourceCardStyles.card, , selected ? styles.selected : undefined), undefined)}
      {...htmlProps}
    >
      <Card.Heading {...stylex.props(dataSourceCardStyles.heading)}>
        <div {...stylex.props(dataSourceCardStyles.headingContent)}>
          <span {...stylex.props(dataSourceCardStyles.name)}>
            {ds.name} {ds.isDefault ? <TagList tags={['default']} /> : null}
          </span>
          <div {...stylex.props(dataSourceCardStyles.rightSection)}>
            <small {...stylex.props(dataSourceCardStyles.type)}>{description || ds.meta.name}</small>
            {onToggleFavorite && !ds.meta.builtIn && (
              <Icon
                key={(isFavorite ? 'favorite' : 'star') + '-' + ds.uid}
                name={isFavorite ? 'favorite' : 'star'}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(ds);
                }}
                {...stylex.props(dataSourceCardStyles.favoriteButton)}
              />
            )}
          </div>
        </div>
      </Card.Heading>
      <Card.Figure {...stylex.props(dataSourceCardStyles.logo)}>
        <img src={ds.meta.info.logos.small || undefined} alt={`${ds.meta.name} Logo`} />
      </Card.Figure>
    </Card>
  );
}

// Get styles for the component
