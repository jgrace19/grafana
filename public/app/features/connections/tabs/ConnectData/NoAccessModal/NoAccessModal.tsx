
import { Trans } from '@grafana/i18n';
import { Modal, Icon, Button, TextLink } from '@grafana/ui';

import { type CardGridItem } from '../CardGrid/CardGrid';


export type NoAccessModalProps = {
  item: CardGridItem;
  isOpen: boolean;
  onDismiss: () => void;
};

export function NoAccessModal({ item, isOpen, onDismiss }: NoAccessModalProps) {
  const styles = (getStyles);

  return (
    <Modal
      {...stylex.props(noAccessModalStyles.modal)}
      contentClassName={styles.modalContent}
      title={<NoAccessModalHeader item={item} />}
      ariaLabel={item.name}
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <div>
        <div>
          {item.description && <div {...stylex.props(noAccessModalStyles.description)}>{item.description}</div>}
          <div>
            <Trans i18nKey="connections.no-access-modal.links">Links</Trans>
            <br />
            <TextLink href={`https://grafana.com/grafana/plugins/${item.id}`} external>
              {item.name}
            </TextLink>
          </div>
        </div>
        <div {...stylex.props(noAccessModalStyles.bottomSection)}>
          <div {...stylex.props(noAccessModalStyles.warningIcon)}>
            <Icon name="exclamation-triangle" />
          </div>
          <div>
            <p>
              <Trans i18nKey="connections.no-access-modal.editor-warning">
                Editors cannot add new connections. You may check to see if it is already configured in{' '}
                <TextLink href="/connections/datasources">Data sources</TextLink>.
              </Trans>
            </p>
            <p>
              <Trans i18nKey="connections.no-access-modal.connection-contact-grafana-admin">
                To add a new connection, contact your Grafana admin.
              </Trans>
            </p>
          </div>
        </div>
        <div {...stylex.props(noAccessModalStyles.actionsSection)}>
          <Button onClick={onDismiss}>
            <Trans i18nKey="connections.no-access-modal.okay">Okay</Trans>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function NoAccessModalHeader({ item }: { item: CardGridItem }) {
  const styles = (getStyles);
  return (
    <div>
      <div {...stylex.props(noAccessModalStyles.header)}>
        {item.logo && <img {...stylex.props(noAccessModalStyles.headerLogo)} src={item.logo} alt={`logo of ${item.name}`} />}
        <h4 {...stylex.props(noAccessModalStyles.headerTitle)}>{item.name}</h4>
      </div>
    </div>
  );
}
