import { Id, IdList } from "./ids";
import { CreatableRoll20Object, Roll20BaseObject } from "./roll20Objects";

export interface Macro extends Roll20BaseObject, CreatableRoll20Object {
  /**
   * The ID of the player that created this macro. Read-only.
   */
  _playerid: Id;

  /**
   * Read only
   */
  _type: "macro";

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
