import { Roll20BaseObject } from "./roll20Objects";

export interface Deck extends Roll20BaseObject {
  /**
   * what internal card sequencer index is used to advance the deck when drawing cards.
   * @default -1
   */
  _cardSequencer: number;
  /**
   * a comma-delimited list of cards which are currently in the deck (including those which have been played to the tabletop/hands). Changes when the deck is shuffled.
   * @default ""
   */
  _currentDeck: string;
  /**
   * the current index of our place in the deck, 'what card will be drawn next?'
   * @default -1
   */
  _currentIndex: number;
  /**
   * show the current card on top of the deck.
   * @default true
   */
  _currentCardShown: boolean;

  /**
   * what's the current discard pile for this deck? comma-delimited list of cards. These are cards which have been removed from play and will not be put back into the deck on a shuffle until a recall is performed.
   * @default ""
   */
  _discardPile: string;

  /**
   * @default "deck"
   */
  _type: "deck";

  /**
   * the 'back' of the cards for this deck.
   * @default ""
   */
  avatar: string;

  /**
   * how are cards from this deck played to the tabletop? 'faceup' or 'facedown'.
   * @default "faceup"
   */
  cardsplayed: "faceup" | "facedown";

  /**
   * what's the default height for cards played to the tabletop?
   * @default ""
   */
  defaultheight: string;

  /**
   * what's the default width for cards played to the tabletop?
   * @default ""
   */
  defaultwidth: string;

  /**
   * what type of discard pile does this deck have? 'none' = no discard pile, 'choosebacks' = allow players to see backs of cards and choose one, 'choosefronts' = see fronts and choose, 'drawtop' = draw the most recently discarded card, 'drawbottom' = draw the oldest discarded card.
   * @default "none"
   */
  discardpilemode:
    | "none"
    | "choosebacks"
    | "choosefronts"
    | "drawtop"
    | "drawbottom";

  /**
   * can the GM see the fronts of cards when looking in each player's hand?
   * @default false
   */
  gm_seefrontofcards: boolean;

  /**
   * can the GM see the number of cards in each player's hand?
   * @default true
   */
  gm_seenumcards: boolean;

  /**
   * are there an 'infinite' number of cards in this deck?
   * @default false
   */
  infinitecards: boolean;

  /**
   * name of the deck.
   * @default ""
   */
  name: string;

  /**
   * can players see the fronts of cards when looking in other player's hands?
   * @default false
   */
  players_seefrontofcards: boolean;

  /**
   * can players see the number of cards in other player's hands?
   * @default true
   */
  players_seenumcards: boolean;

  /**
   * can players draw cards?
   * @default true
   */
  playerscandraw: boolean;

  /**
   * show the deck to the players.
   * @default true
   */
  showplayers: boolean;

  /**
   * show the deck on the gameboard (is the deck currently visible?)
   * @default false
   */
  shown: boolean;
}

type _Deck = Deck;
declare global {
  type Deck = _Deck;
}
