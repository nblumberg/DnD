import { Id } from "./ids";
import { APIObject } from "./roll20Objects";

export interface Card extends APIObject {
  /**
   * ID of the deck
   * @readonly
   */
  deckid: Id;

  /** @readonly */
  type: "card";

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
