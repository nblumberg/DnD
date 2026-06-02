import { Character } from "./character";
import { Id } from "./ids";

declare global {
  /**
   * Gets the value of an attribute, using the default value from the character sheet if the attribute is not present. value_type is an optional parameter, which you can use to specify "current" or "max".
   * getAttrByName will only get the value of the attribute, not the attribute object itself. If you wish to reference properties of the attribute other than "current" or "max", or if you wish to change properties of the attribute, you must use one of the other functions above, such as findObjs.
   *
   * For repeating sections, you can use the format repeating_section_$n_attribute, where n is the repeating row number (starting with zero). For example, repeating_spells_$2_name will return the value of name from the third row of repeating_spells.
   *
   * You can achieve behavior equivalent to getAttrByNamewith the following:
   *
   * // current and max are completely dependent on the attribute and game system
   * // in question; there is no function available for determining them automatically
   * function myGetAttrByName(character_id,
   *                          attribute_name,
   *                          attribute_default_current,
   *                          attribute_default_max,
   *                          value_type) {
   *     attribute_default_current = attribute_default_current || '';
   *     attribute_default_max = attribute_default_max || '';
   *     value_type = value_type || 'current';
   *
   *     var attribute = findObjs({
   *         type: 'attribute',
   *         characterid: character_id,
   *         name: attribute_name
   *     }, {caseInsensitive: true})[0];
   *     if (!attribute) {
   *         attribute = createObj('attribute', {
   *             characterid: character_id,
   *             name: attribute_name,
   *             current: attribute_default_current,
   *             max: attribute_default_max
   *         });
   *     }
   *
   *     if (value_type == 'max') {
   *         return attribute.get('max');
   *     } else {
   *         return attribute.get('current');
   *     }
   * }
   *
   * @param {Id} character_id The ID of the character whose attribute you want to get.
   * @param {keyof Character} attribute_name The name of the attribute you want to get.
   * @param {("current" | "max")} value_type The type of value you want to get.
   * @returns {string | number} The value of the attribute.
   */
  function getAttrByName<K extends keyof Character>(
    character_id: Id,
    attribute_name: K,
    value_type?: "current" | "max"
  ): Character[K];
}
