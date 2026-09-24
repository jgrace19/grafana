import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { serviceAccountTokensTableStyles } from './ServiceAccountTokensTable.stylex';
import type { JSX } from 'react';

import { dateTimeFormat, type GrafanaTheme2, type TimeZone, dateTimeFormatTimeAgo } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { DeleteButton, Icon, Tooltip, useTheme2 } from '@grafana/ui';
import { type ApiKey } from 'app/types/apiKeys';

interface Props {
  tokens: ApiKey[];
  timeZone: TimeZone;
  tokenActionsDisabled?: boolean;
  onDelete: (token: ApiKey) => void;
}

export const ServiceAccountTokensTable = ({ tokens, timeZone, tokenActionsDisabled, onDelete }: Props): JSX.Element => {
  const theme = useTheme2();

  const styles = getStyles(theme);

  return (
    <table {...mergeStylexClassName(stylex.props(serviceAccountTokensTableStyles.section, 'filter-table'), undefined)}>
      <thead>
        <tr>
          <th>
            <Trans i18nKey="serviceaccounts.service-account-tokens-table.name">Name</Trans>
          </th>
          <th>
            <Trans i18nKey="serviceaccounts.service-account-tokens-table.expires">Expires</Trans>
          </th>
          <th>
            <Trans i18nKey="serviceaccounts.service-account-tokens-table.created">Created</Trans>
          </th>
          <th>
            <Trans i18nKey="serviceaccounts.service-account-tokens-table.last-used-at">Last used at</Trans>
          </th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {tokens.map((key) => {
          return (
            <tr key={key.id} className={serviceAccountTokensTableStyles.tableRow(key.hasExpired || key.isRevoked)}>
              <td>{key.name}</td>
              <td>
                <TokenExpiration timeZone={timeZone} token={key} />
              </td>
              <td>{formatDate(timeZone, key.created)}</td>
              <td>{formatLastUsedAtDate(timeZone, key.lastUsedAt)}</td>
              <td className="width-1 text-center">{key.isRevoked && <TokenRevoked />}</td>
              <td>
                <DeleteButton
                  aria-label={t(
                    'serviceaccounts.service-account-tokens-table.aria-label-delete-button',
                    'Delete service account token {{key}}',
                    { key: key.name }
                  )}
                  size="sm"
                  onConfirm={() => onDelete(key)}
                  disabled={tokenActionsDisabled}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

function formatLastUsedAtDate(timeZone: TimeZone, lastUsedAt?: string): string {
  if (!lastUsedAt) {
    return 'Never';
  }
  return dateTimeFormat(lastUsedAt, { timeZone });
}

function formatDate(timeZone: TimeZone, expiration?: string): string {
  if (!expiration) {
    return 'No expiration date';
  }
  return dateTimeFormat(expiration, { timeZone });
}

function formatSecondsLeftUntilExpiration(secondsUntilExpiration: number): string {
  const expirationTime = Date.now() + secondsUntilExpiration * 1000;
  const daysFormat = dateTimeFormatTimeAgo(expirationTime, { timeZone: 'browser' });
  return `Expires ${daysFormat}`;
}

const TokenRevoked = () => {

  return (
    <span {...stylex.props(serviceAccountTokensTableStyles.hasExpired)}>
      <Trans i18nKey="serviceaccounts.token-revoked.revoked-label">Revoked</Trans>
      <span {...stylex.props(serviceAccountTokensTableStyles.tooltipContainer)}>
        <Tooltip
          content={t(
            'serviceaccounts.token-revoked.content-token-publicly-exposed-please-rotate',
            'This token has been publicly exposed. Please rotate this token'
          )}
        >
          <Icon name="exclamation-triangle" {...stylex.props(serviceAccountTokensTableStyles.toolTipIcon)} />
        </Tooltip>
      </span>
    </span>
  );
};

interface TokenExpirationProps {
  timeZone: TimeZone;
  token: ApiKey;
}

const TokenExpiration = ({ timeZone, token }: TokenExpirationProps) => {

  if (!token.expiration) {
    return (
      <span {...stylex.props(serviceAccountTokensTableStyles.neverExpire)}>
        <Trans i18nKey="serviceaccounts.token-expiration.never">Never</Trans>
      </span>
    );
  }
  if (token.secondsUntilExpiration) {
    return (
      <span {...stylex.props(serviceAccountTokensTableStyles.secondsUntilExpiration)} title={formatDate(timeZone, token.expiration)}>
        {formatSecondsLeftUntilExpiration(token.secondsUntilExpiration)}
      </span>
    );
  }
  if (token.hasExpired) {
    return (
      <span {...stylex.props(serviceAccountTokensTableStyles.hasExpired)} title={formatDate(timeZone, token.expiration)}>
        <Trans i18nKey="serviceaccounts.token-expiration.expired-label">Expired</Trans>
        <span {...stylex.props(serviceAccountTokensTableStyles.tooltipContainer)}>
          <Tooltip
            content={t('serviceaccounts.token-expiration.content-this-token-has-expired', 'This token has expired')}
          >
            <Icon name="exclamation-triangle" {...stylex.props(serviceAccountTokensTableStyles.toolTipIcon)} />
          </Tooltip>
        </span>
      </span>
    );
  }
  return <span>{formatDate(timeZone, token.expiration)}</span>;
};

