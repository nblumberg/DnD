import { AvatarImgSrc } from "./avatarImgSrc";
import { BioGmNotesNotes } from "./bioGmNotesNotes";
import { IdList } from "./ids";
import { APIObject, CreatableRoll20Object } from "./roll20Objects";

/**
 * Note: The API does not have access to the folder hierarchy. API created handouts will be placed at the root level.
 */
export interface Handout extends APIObject, CreatableRoll20Object {
  /**
   * A JSON string containing an array of pin objects associated with parts of this handout
   * @default "[]"
   * @readonly
   */
  readonly pins: string;

  /**
   * Read-only identifier for the object type
   * @readonly
   */
  readonly type: "handout";

  /**
   * @default false
   */
  archived: boolean;

  /**
   * URL to an image used for the handout. See the note about avatar and imgsrc restrictions below.
   * @see AvatarImgSrc
   */
  avatar: AvatarImgSrc;

  /**
   * Comma-delimited list of player IDs who can control and edit this handout.
   * All Players is represented by having 'all' in the list.
   * @default ""
   */
  controlledby: IdList;

  /**
   * Contains the text only the GM sees
   * @see BioGmNotesNotes
   */
  gmnotes: BioGmNotesNotes;

  /**
   * Comma-delimited list of player ID who can see this handout. Use "all" to display to all players.
   * All Players is represented by having 'all' in the list.
   * @default ""
   */
  inplayerjournals: IdList;

  /**
   * Display name for the handout
   * @default "Mysterious Note"
   */
  name: string;

  /**
   * Contains the text in the handout. See the note below about using Notes and GMNotes.
   * @see BioGmNotesNotes
   * @default ""
   */
  notes: BioGmNotesNotes;
}

type _Handout = Handout;
declare global {
  type Handout = _Handout;
}
