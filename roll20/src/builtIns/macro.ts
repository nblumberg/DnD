import { Id, IdList } from "./ids";
import { APIObject, CreatableRoll20Object } from "./roll20Objects";

export interface Macro extends APIObject, CreatableRoll20Object {
  /**
   * The ID of the player that created this macro. Read-only.
   * @readonly
   */
  readonly playerid: Id;

  /**
   * Read only
   * @readonly
   */
  readonly type: "macro";

  /**
   * The text of the macro.
   * @default ""
   */
  action: string;

  /**
   * Is this macro a token action that should show up when tokens are selected?
   * @default false
   */
  istokenaction: boolean;

  /**
   * The macro's name.
   * @default ""
   */
  name: string;

  /**
   * Comma-delimited list of player IDs who may view the macro in addition to the player that created it.
   * All Players is represented by having 'all' in the list.
   * @default ""
   */
  visibleto: IdList;
}

type _Macro = Macro;
declare global {
  type Macro = _Macro;
}
