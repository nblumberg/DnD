import { Id } from "./ids";
import { Roll20BaseObject } from "./roll20Objects";

export interface Card extends Roll20BaseObject {
  /**
   * ID of the deck
   */
  _deckid: Id;

  _type: "card";

  /**
   * Front of the card
   */
  avatar: string;

  /**
   * Override card back image
   */
  card_back: string;

  /**
   * Name of the card
   */
  name: string;
}

type _Card = Card;
declare global {
  type Card = _Card;
}
