/**
 * Using the Notes, GMNotes, and Bio fields Asynchronous
 * In order to access the "notes", "gmnotes", or "bio" fields on Characters and Handouts, you must pass a callback function as the second argument to the get() function. Here's an example:
 *
 * var character = getObj("character", "-JMGkBaMgMWiQdNDwjjS");
 * character.get("bio", function(bio) {
 *     log(bio); //do something with the character bio here.
 * });
 * You can set the value of these fields as normal. Note that there is currently (as at 2016/05/09) a bug with these asynchronous fields, whereby setting them by passing values to createObj fails quietly, leaving the object in a strange state. You should only set these values using .set until this issue is resolved. Details on the Forum. There is also a bug (as of 2016/11/05) where attempting to set both the notes and gmnotes properties in the same set() call results in the second property in the call being set erroneously. Details on the Forum.
 */
export type BioGmNotesNotes = string;
