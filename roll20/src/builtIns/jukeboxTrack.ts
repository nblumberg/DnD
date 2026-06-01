import { Roll20BaseObject } from "./roll20Objects";

export interface JukeboxTrack extends Roll20BaseObject {
  /**
   * Can be used to identify the object type or search for the object. Read-only.
   * @default "jukeboxtrack"
   */
  _type: "jukeboxtrack";

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
