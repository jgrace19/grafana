import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { PluginType } from '@grafana/data';
import { Page } from 'app/core/components/Page/Page';
import { RoadmapLinks } from 'app/features/plugins/admin/components/RoadmapLinks';
import UpdateAllButton from 'app/features/plugins/admin/components/UpdateAllButton';
import UpdateAllModal from 'app/features/plugins/admin/components/UpdateAllModal';
import { useGetUpdatable } from 'app/features/plugins/admin/state/hooks';

import { AddNewConnection } from '../tabs/ConnectData/ConnectData';

export function AddNewConnectionPage() {
  const { isLoading: areUpdatesLoading, updatablePlugins } = useGetUpdatable();
  const updatableDSPlugins = updatablePlugins.filter((plugin) => plugin.type === PluginType.datasource);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const disableUpdateAllButton = updatableDSPlugins.length <= 0 || areUpdatesLoading;

  const onUpdateAll = () => {
    setShowUpdateModal(true);
  };

  const updateAllButton = (
    <UpdateAllButton
      disabled={disableUpdateAllButton}
      onUpdateAll={onUpdateAll}
      updatablePluginsLength={updatableDSPlugins.length}
    />
  );

  return (
    <Page
      navId={'connections-add-new-connection'}
      actions={updateAllButton}
      className={stylex.props(styles.pageContainer).className}
    >
      <Page.Contents>
        <AddNewConnection />
        <RoadmapLinks />
        <UpdateAllModal
          isOpen={showUpdateModal}
          isLoading={areUpdatesLoading}
          onDismiss={() => setShowUpdateModal(false)}
          plugins={updatableDSPlugins}
        />
      </Page.Contents>
    </Page>
  );
}

const styles = stylex.create({
  pageContainer: {
    height: '100vh',
    overflow: 'hidden',
  },
});
