import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { Modal, Icon, Button, TextLink } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type CardGridItem } from '../CardGrid/CardGrid';

import './NoAccessModal.css';

export type NoAccessModalProps = {
  item: CardGridItem;
  isOpen: boolean;
  onDismiss: () => void;
};

export function NoAccessModal({ item, isOpen, onDismiss }: NoAccessModalProps) {
  return (
    <Modal
      xstyle={modalStyles.modal}
      contentClassName="gf-no-access-modal-content"
      contentXstyle={modalStyles.modalContent}
      title={<NoAccessModalHeader item={item} />}
      ariaLabel={item.name}
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <div>
        <div>
          {item.description && <div {...stylex.props(styles.description)}>{item.description}</div>}
          <div>
            <Trans i18nKey="connections.no-access-modal.links">Links</Trans>
            <br />
            <TextLink href={`https://grafana.com/grafana/plugins/${item.id}`} external>
              {item.name}
            </TextLink>
          </div>
        </div>
        <div {...stylex.props(styles.bottomSection)}>
          <div {...stylex.props(styles.warningIcon)}>
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
        <div {...stylex.props(styles.actionsSection)}>
          <Button onClick={onDismiss}>
            <Trans i18nKey="connections.no-access-modal.okay">Okay</Trans>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function NoAccessModalHeader({ item }: { item: CardGridItem }) {
  return (
    <div>
      <div {...stylex.props(styles.header)}>
        {item.logo && <img {...stylex.props(styles.headerLogo)} src={item.logo} alt={`logo of ${item.name}`} />}
        <h4 {...stylex.props(styles.headerTitle)}>{item.name}</h4>
      </div>
    </div>
  );
}

const modalStyles = stylex.create({
  modal: {
    width: '500px',
  },
  modalContent: {
    overflow: 'visible',
    color: colors['--gf-colors-text-secondary'],
  },
});

const styles = stylex.create({
  description: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
  bottomSection: {
    display: 'flex',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    paddingTop: spacing['--gf-spacing-x3'],
    marginTop: spacing['--gf-spacing-x3'],
  },
  actionsSection: {
    display: 'flex',
    justifyContent: 'end',
    marginTop: spacing['--gf-spacing-x3'],
  },
  warningIcon: {
    color: colors['--gf-colors-warning-main'],
    paddingRight: spacing['--gf-spacing-x1'],
    marginTop: spacing['--gf-spacing-x0-25'],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  headerTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  headerLogo: {
    marginRight: spacing['--gf-spacing-x2'],
    width: '32px',
    height: '32px',
  },
});
