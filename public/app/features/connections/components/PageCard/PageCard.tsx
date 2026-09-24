
import { locationService } from '@grafana/runtime';
import { Icon, } from '@grafana/ui';

type PageCardProps = {
  title: string;
  description: string;
  icon: IconName;
  url: string;
  index: number;
};

export default function PageCard({ title, description, icon, url, index }: PageCardProps) {
  const styles = (getStyles);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      locationService.push(url);
    }
  };

  return (
    <div
      {...stylex.props(pageCardStyles.card)}
      role="button"
      tabIndex={0}
      onClick={() => locationService.push(url)}
      onKeyDown={onKeyDown}
    >
      <Icon name={icon} className={`${styles.logo} ${index % 2 === 0 ? styles.evenLogo : styles.oddLogo}`} />
      <div {...stylex.props(pageCardStyles.contentColumn)}>
        <h3 {...stylex.props(pageCardStyles.title)}>{title}</h3>
        <p {...stylex.props(pageCardStyles.description)}>{description}</p>
      </div>
    </div>
  );
}

