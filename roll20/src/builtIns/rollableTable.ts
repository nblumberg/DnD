import { AvatarImgSrc } from "./avatarImgSrc";
import { Id } from "./ids";
import { CreatableRoll20Object, Roll20BaseObject } from "./roll20Objects";

export interface RollableTable extends Roll20BaseObject, CreatableRoll20Object {
  /** @readonly */
  type: "rollabletable";

  /**
   * The name of the table.
   */
  name: string;

  /**
   * @default true
   */
  showplayers: boolean;
}

export interface TableItem extends Roll20BaseObject, CreatableRoll20Object {
  /**
   * ID of the table this item belongs to. Read-only.
   * @readonly
   */
  rollabletableid: Id;

  /** @readonly */
  type: "tableitem";

  /**
   * URL to an image used for the table item. See the note about avatar and imgsrc restrictions below.
   * @see AvatarImgSrc
   * @default ""
   */
  avatar: AvatarImgSrc;

  name: string;

  /**
   * Weight of the table item compared to the other items in the same table. Simply put, an item with weight 3 is three times more likely to be selected when rolling on the table than an item with weight 1.
   * @default 1
   */
  weight: number;
}

type _RollableTable = RollableTable;
type _TableItem = TableItem;
declare global {
  type RollableTable = _RollableTable;
  type TableItem = _TableItem;
}
