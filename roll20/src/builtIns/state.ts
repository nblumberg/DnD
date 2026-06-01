/**
state
The state variable is an object in the global scope which is accessible to all scripts running in a game. You can access the state object from any function or callback at any time just by using the global variable named state. Additionally, the state object is persisted between executions of the Sandbox, so you can use it to store information you want to have in future runs of your script.

Note: You should use the state object to store information that is only needed by the API, since it is not sent to player computers and does not make your game file larger. Store values that are needed in-game in the Roll20 objects' properties.

Storable Types
The state object is only capable of persisting simple data types, as supported by the JSON standard.

Type	Examples	Description
Boolean	true false	The value true or false.
Number	123.5 10 1.23e20	Any number format supported by Javascript. Floating-Point or Integer.
String	'Hello Fantasy' "oh, and World"	A standard string of text.
Array	[ 1, 2, 3, 4 ] [ 'A','B','C'][1, 2, ['bob', 3], 10, 2.5]	An ordered collection of any of the types, including other arrays.
Object	{ key: 1, value: 'roll20' }	A simple key/value object with string keys and any of the types as a value, including other objects.
Warning: While functions will appear to work when stored in the state initially, they will disappear the first time the state is restored from persistence, such as on a sandbox restart.

Note: This includes Roll20 objects which you get from events or the functions findObjs(), getObj(), filterObjs(), createObj(), etc.
Important Reminders
The state object is shared between all of the scripts in a sandbox. To avoid breaking other scripts, it is important to follow a few simple guidelines:

Never assign directly to the root state object.
state = { break: 'all the things' };  // NEVER DO THIS!!!


Avoid using local variables named state in your scripts. While this will work, it will be confusing to later users of your scripts and could cause issues if the code is carelessly edited.
function turn(){
    var state = Campaign().get('turnorder');  // Bad Practice, Avoid it!
    // ...
}


Always place your properties beneath at least one namespace property. Be sure to use a sufficiently descriptive namespace property. Avoid names like script or settings. It's best to either use the name of your module or your own name or handle.
if( ! state.MyModuleNamespace ) {
    state.MyModuleNamespace = { module: 'my module', ok: 'this is fine!', count: 0 };
}
state.MyModuleNamespace.count++;
Example Usage
This is a working example that uses the state object appropriately.

on('ready',function() {
    "use strict";

    // Check if the namespaced property exists, creating it if it doesn't
    if( ! state.MyModuleNS ) {
        state.MyModuleNS = {
            version: 1.0,
            config: {
                color1: '#ff0000',
                color2: '#0000ff'
            },
            count: 0
        };
    }

    // Using the state properties to configure a message to the chat.
    sendChat(
        'Test Module',
        '<span style="color: '+state.MyModuleNS.config.color1+';">'+
            'State test'+
        '</span> '+
        '<span style="color: '+state.MyModuleNS.config.color2+';">'+
            'Script v'+state.MyModuleNS.version+' started '+(++state.MyModuleNS.count)+' times!'+
        '</span>'
    );
});
 */
export type State =
  | boolean
  | number
  | string
  | { [key: string]: State }
  | State[];

declare global {
  /**
   * state
   * The state variable is an object in the global scope which is accessible to all scripts running in a game. You can access the state object from any function or callback at any time just by using the global variable named state. Additionally, the state object is persisted between executions of the Sandbox, so you can use it to store information you want to have in future runs of your script.
   *
   * Note: You should use the state object to store information that is only needed by the API, since it is not sent to player computers and does not make your game file larger. Store values that are needed in-game in the Roll20 objects' properties.
   * @see State
   */
  const state: { [key: string]: State };
}