import { getUrlParam } from './getUrlParam.js';
let socket;
const handlers = new Map();
export function registerWebSocketHandler(type, handler) {
    if (handlers.has(type)) {
        throw new Error(`Already registered a WebSocketHandler for ${type}`);
    }
    handlers.set(type, handler);
}
registerWebSocketHandler('ping', (data) => {
    const { callback } = data;
    return Promise.resolve({ type: callback });
});
export function unregisterWebSocketHandler(type) {
    handlers.delete(type);
}
export function send(data) {
    socket.send(JSON.stringify(data));
}
export function addSocketListener() {
    // Create WebSocket connection.
    const here = new URL(window.location.href);
    socket = new WebSocket(`ws://${here.hostname}${here.port ? `:${here.port}` : ''}`);
    // Connection opened
    socket.addEventListener('open', (event) => {
        const user = getUrlParam('name');
        send({ type: 'addUser', user });
    });
    // Listen for messages
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        const handler = handlers.get(data.type);
        if (!handler) {
            return;
        }
        const promise = handler(data);
        if (promise) {
            promise.then(request => send(request));
        }
    });
}
//# sourceMappingURL=browserSockets.js.map