import * as stylex from '@stylexjs/stylex';
import { type MouseEvent } from 'react';

import { type AnnotationEvent, type DateTimeInput, type PanelProps } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Card, RenderUserContentAsHTML, TagList, Tooltip } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type Options } from './panelcfg.gen';
import './AnnotationListItem.css';

interface Props extends Pick<PanelProps<Options>, 'options'> {
  annotation: AnnotationEvent;
  formatDate: (date: DateTimeInput, format?: string) => string;
  onClick: (annotation: AnnotationEvent) => void;
  onAvatarClick: (annotation: AnnotationEvent) => void;
  onTagClick: (tag: string, remove?: boolean) => void;
}

export const AnnotationListItem = ({ options, annotation, formatDate, onClick, onAvatarClick, onTagClick }: Props) => {
  const { showUser, showTags, showTime } = options;
  const { text = '', login, email, avatarUrl, tags, time, timeEnd } = annotation;
  const onItemClick = () => {
    onClick(annotation);
  };
  const onLoginClick = () => {
    onAvatarClick(annotation);
  };
  const showAvatar = login && showUser;
  const showTimeStamp = time && showTime;
  const showTimeStampEnd = timeEnd && timeEnd !== time && showTime;

  return (
    <Card noMargin className="gf-annolist-card" onClick={onItemClick}>
      <Card.Heading>
        <RenderUserContentAsHTML
          className="gf-annolist-heading"
          onClick={(e) => {
            e.stopPropagation();
          }}
          content={text}
        />
      </Card.Heading>
      {showTimeStamp && (
        <Card.Description className="gf-annolist-timestamp">
          <TimeStamp formatDate={formatDate} time={time!} />
          {showTimeStampEnd && (
            <>
              <span {...stylex.props(styles.time)}>-</span>
              <TimeStamp formatDate={formatDate} time={timeEnd!} />{' '}
            </>
          )}
        </Card.Description>
      )}
      {showAvatar && (
        <Card.Meta className="gf-annolist-meta">
          <Avatar email={email} login={login!} avatarUrl={avatarUrl} onClick={onLoginClick} />
        </Card.Meta>
      )}
      {showTags && tags && (
        <Card.Tags>
          <TagList tags={tags} onClick={(tag) => onTagClick(tag, false)} />
        </Card.Tags>
      )}
    </Card>
  );
};

interface AvatarProps {
  login: string;
  onClick: () => void;
  avatarUrl?: string;
  email?: string;
}

const Avatar = ({ onClick, avatarUrl, login, email }: AvatarProps) => {
  const onAvatarClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick();
  };
  const tooltipContent = (
    <span>
      <Trans i18nKey="annolist.annotation-list-item.tooltip-created-by">
        Created by:
        <br /> {{ email }}
      </Trans>
    </span>
  );

  return (
    <Tooltip content={tooltipContent} theme="info" placement="top">
      <button onClick={onAvatarClick} {...stylex.props(styles.avatar)}>
        <img src={avatarUrl} alt="avatar icon" {...stylex.props(styles.avatarImg)} />
      </button>
    </Tooltip>
  );
};

interface TimeStampProps {
  time: number;
  formatDate: (date: DateTimeInput, format?: string) => string;
}

const TimeStamp = ({ time, formatDate }: TimeStampProps) => {
  return (
    <span {...stylex.props(styles.time)}>
      <span>{formatDate(time)}</span>
    </span>
  );
};

const styles = stylex.create({
  time: {
    marginLeft: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
  },
  avatar: {
    borderStyle: 'none',
    backgroundColor: 'inherit',
    backgroundImage: 'inherit',
    margin: 0,
    padding: spacing['--gf-spacing-x0-5'],
  },
  avatarImg: {
    borderRadius: shape['--gf-shape-radius-circle'],
    width: spacing['--gf-spacing-x2'],
    height: spacing['--gf-spacing-x2'],
  },
});
