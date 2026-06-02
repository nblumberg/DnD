import { Id } from "./ids";
import { APIObject } from "./roll20Objects";

export interface JukeboxTrack extends APIObject {
  /**
   * Can be used to identify the object type or search for the object. Read-only.
   * @default "jukeboxtrack"
   * @readonly
   */
  type: "jukeboxtrack";

  /**
   * Should the track be looped? Set to true if so.
   * @default false
   */
  loop: boolean;

  /**
   * Boolean used to determine whether or not the track is playing. Setting this to "true" and softstop to "false" plays a track.
   * @default false
   */
  playing: boolean;

  /**
   * Boolean used to determine whether or not a non-looped track has finished at least once. This must be set to "false" to ensure that a track will play.
   * @default false
   */
  softstop: boolean;

  /**
   * The visible label for the track in the jukebox tab.
   * @default ""
   */
  title: string;

  /**
   * The volume level of the track. Note that this must be set to an integer (not a string), or you may break functionality. Values from 0-100 (percentage).
   * @default 30
   */
  volume: number;
}

type _JukeboxTrack = JukeboxTrack;
declare global {
  type JukeboxTrack = _JukeboxTrack;
  
  /**
   * The play function takes in the Folder ID (get it from the "_jukeboxfolder" property in the Campaign object) of the playlist, and will begin playing that playlist for everyone in the game.
   * @param {Id} playlist the Folder ID (get it from the "_jukeboxfolder" property in the Campaign object) of the playlist you want to play.
   * @returns {void}
   * @example
   * var playlists = JSON.parse(Campaign().get('jukeboxfolder')),
   *     myPlaylist = _.find(playlists, (folder) => _.isObject(folder) && folder.n === myPlaylistName);
   * playJukeboxPlaylist(myPlaylist.id);
   */
  function playJukeboxPlaylist(playlist: Id): void;

  /**
   * The stop function does not require any arguments, and will stop any playlist that is currently playing.
   * @example stopJukeboxPlaylist();
   */
  function stopJukeboxPlaylist(): void;
}
