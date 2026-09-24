import * as stylex from '@stylexjs/stylex';

import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type SkeletonComponent, attachSkeleton } from '@grafana/ui/unstable';

import { type Playlist } from '../../api/clients/playlist/v1';

import { PlaylistCard } from './PlaylistCard';

interface Props {
  setStartPlaylist: (playlistItem: Playlist) => void;
  setPlaylistToDelete: (playlistItem: Playlist) => void;
  playlists: Playlist[];
}

const PlaylistPageListComponent = ({ playlists, setStartPlaylist, setPlaylistToDelete }: Props) => {
  return (
    <ul {...stylex.props(styles.list)}>
      {playlists.map((playlist) => (
        <li {...stylex.props(styles.listItem)} key={playlist.metadata?.name}>
          <PlaylistCard
            playlist={playlist}
            setStartPlaylist={setStartPlaylist}
            setPlaylistToDelete={setPlaylistToDelete}
          />
        </li>
      ))}
    </ul>
  );
};

const PlaylistPageListSkeleton: SkeletonComponent = ({ rootProps }) => {
  return (
    <div data-testid="playlist-page-list-skeleton" {...stylex.props(styles.list)} {...rootProps}>
      <PlaylistCard.Skeleton />
      <PlaylistCard.Skeleton />
      <PlaylistCard.Skeleton />
    </div>
  );
};

export const PlaylistPageList = attachSkeleton(PlaylistPageListComponent, PlaylistPageListSkeleton);

const styles = stylex.create({
  list: {
    display: 'grid',
    gap: spacing['--gf-spacing-x1'],
  },
  listItem: {
    listStyle: 'none',
  },
});
