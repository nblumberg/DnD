import { Id, IdList } from "./ids";
import { Roll20BaseObject } from "./roll20Objects";

export interface Hand extends Roll20BaseObject {
  /**
   * ID of the player to whom the hand belongs
   * @default ""
   * @readonly
   */
  parentid: Id;

  /** @readonly */
  type: "hand";

  /**
   * comma-delimited list of cards currently in the hand. Note that this is no longer read only. Ideally, it should only be adjusted with the card deck functions.
   * @default ""
   */
  currentHand: IdList;

  /**
   * when player opens hand, is the view 'bydeck' or 'bycard'?
   * @default "bydeck"
   */
  currentView: "bydeck" | "bycard";
}

type _Hand = Hand;
declare global {
  type Hand = _Hand;
}
