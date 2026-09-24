import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { Badge, LinkButton, Stack, Text } from '@grafana/ui';

import { createRelativeUrl, isRelativeUrl } from '../utils/url';

interface EnrichmentItem {
  type: string;
  name?: string;
  exploreLink?: string;
  expr?: string;
  lines?: string[];
}

function isEnrichmentItem(value: unknown): value is EnrichmentItem {
  if (typeof value !== 'object' || value === null || !('type' in value)) {
    return false;
  }
  const obj: Record<string, unknown> = value;
  if (typeof obj.type !== 'string') {
    return false;
  }
  if (obj.exploreLink !== undefined && typeof obj.exploreLink !== 'string') {
    return false;
  }
  if (obj.lines !== undefined && (!Array.isArray(obj.lines) || !obj.lines.every((l) => typeof l === 'string'))) {
    return false;
  }
  return true;
}

interface AlertEnrichmentsProps {
  enrichments: Record<string, unknown>;
}

export function AlertEnrichments({ enrichments }: AlertEnrichmentsProps) {
  const rawItems = enrichments?.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return null;
  }

  // enrichments is typed as Record<string, unknown> from the API, so we validate each item at runtime
  const items = rawItems.filter(isEnrichmentItem);
  if (items.length === 0) {
    return null;
  }

  return (
    <Stack direction="column" gap={1}>
      <Text variant="bodySmall" color="secondary">
        <strong>
          <Trans i18nKey="alerting.notification-history.enrichments">Enrichments:</Trans>
        </strong>
      </Text>
      {items.map((item, idx) => (
        <EnrichmentItemView key={idx} item={item} />
      ))}
    </Stack>
  );
}

function EnrichmentItemView({ item }: { item: EnrichmentItem }) {

  // LinkButton renders an <a> tag so we need createRelativeUrl for subpath support
  const sanitizedLink = item.exploreLink ? textUtil.sanitizeUrl(item.exploreLink) : undefined;
  let exploreHref: string | undefined;
  if (sanitizedLink) {
    if (isRelativeUrl(sanitizedLink)) {
      exploreHref = createRelativeUrl(sanitizedLink);
    } else if (/^https?:\/\//i.test(sanitizedLink)) {
      exploreHref = sanitizedLink;
    }
  }

  if (item.type === 'logs') {
    return (
      <div {...stylex.props(alertEnrichmentsStyles.enrichmentItem)}>
        <Stack direction="column" gap={0.5}>
          <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between">
            <Badge color="blue" icon="gf-logs" text={t('alerting.notification-history.enrichment-type-logs', 'logs')} />
            {exploreHref && (
              <LinkButton size="sm" variant="secondary" icon="compass" href={exploreHref} target="_blank">
                <Trans i18nKey="alerting.notification-history.enrichment-explore">View in Explore</Trans>
              </LinkButton>
            )}
          </Stack>
          {item.lines && item.lines.length > 0 ? (
            <pre {...stylex.props(alertEnrichmentsStyles.logLines)}>
              {item.lines.map((line, i) => (
                <div key={i}>{line.trimEnd()}</div>
              ))}
            </pre>
          ) : (
            <Text variant="bodySmall" color="secondary" italic>
              <Trans i18nKey="alerting.notification-history.enrichment-no-logs">No log lines</Trans>
            </Text>
          )}
        </Stack>
      </div>
    );
  }

  return <Badge color="purple" text={item.type} />;
}

