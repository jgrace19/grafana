import clsx from 'clsx';

import { } from '@grafana/ui';

interface Props {
  sanitizedHTML: string;
}

export const Changelog = ({ sanitizedHTML }: Props) => {
  const styles = (getStyles);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedHTML ?? 'No changelog was found' }}
      {...mergeStylexClassName(stylex.props(changelogStyles.changelog, ), undefined)}
    ></div>
  );
};

