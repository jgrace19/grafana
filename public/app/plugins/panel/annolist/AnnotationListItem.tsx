import * as stylex from '@stylexjs/stylex';
import { annotationListItemStyles } from './AnnotationListItem.stylex';

import { type MouseEvent } from 'react';

import { type AnnotationEvent, type DateTimeInput, type GrafanaTheme2, type PanelProps } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Card, RenderUserContentAsHTML, TagList, Tooltip } from '@grafana/ui';

import { type Options } from './panelcfg.gen';

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
    <Card noMargin {...stylex.props(annotationListItemStyles.card)} onClick={onItemClick}>
      <Card.Heading>
        <RenderUserContentAsHTML
          {...stylex.props(annotationListItemStyles.heading)}
          onClick={(e) => {
            e.stopPropagation();
          }}
          content={text}
        />
      </Card.Heading>
      {showTimeStamp && (
        <Card.Description {...stylex.props(annotationListItemStyles.timestamp)}>
          <TimeStamp formatDate={formatDate} time={time!} />
          {showTimeStampEnd && (
            <>
              <span {...stylex.props(annotationListItemStyles.time)}>-</span>
              <TimeStamp formatDate={formatDate} time={timeEnd!} />{' '}
            </>
          )}
        </Card.Description>
      )}
      {showAvatar && (
        <Card.Meta {...stylex.props(annotationListItemStyles.meta)}>
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
      <button onClick={onAvatarClick} {...stylex.props(annotationListItemStyles.avatar)}>
        <img src={avatarUrl} alt="avatar icon" />
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
    <span {...stylex.props(annotationListItemStyles.time)}>
      <span>{formatDate(time)}</span>
    </span>
  );
};

