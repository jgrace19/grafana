
import { } from '@grafana/ui';
import { type SkeletonComponent, attachSkeleton } from '@grafana/ui/unstable';

import { type Playlist } from '../../api/clients/playlist/v1';

import { PlaylistCard } from './PlaylistCard';

interface Props {
  setStartPlaylist: (playlistItem: Playlist) => void;
  setPlaylistToDelete: (playlistItem: Playlist) => void;
  playlists: Playlist[];
}

const PlaylistPageListComponent = ({ playlists, setStartPlaylist, setPlaylistToDelete }: Props) => {
  const styles = (getStyles);
  return (
    <ul {...stylex.props(playlistPageListStyles.list)}>
      {playlists.map((playlist) => (
        <li {...stylex.props(playlistPageListStyles.listItem)} key={playlist.metadata?.name}>
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
  const styles = (getStyles);
  return (
    <div data-testid="playlist-page-list-skeleton" {...stylex.props(playlistPageListStyles.list)} {...rootProps}>
      <PlaylistCard.Skeleton />
      <PlaylistCard.Skeleton />
      <PlaylistCard.Skeleton />
    </div>
  );
};

export const PlaylistPageList = attachSkeleton(PlaylistPageListComponent, PlaylistPageListSkeleton);

