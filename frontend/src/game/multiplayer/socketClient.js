// webSocket connection logic -> network cable wrapper.

/* open the WebSocket
send messages in the right format
parse incoming JSON
expose event hooks
hide raw WebSocket ugliness from the rest of the app
 */

// raw socket API -> nicer frontend API
export function createSocketClient({
  url,
  onOpen,
  onClose,
  onError,
  onMessage
}) {
  let socket = null;
  let status = 'disconnected';

  function connect() {
    if (socket && (status === 'connecting' || status === 'connected')) {
      return;
    }

    status = 'connecting';
    socket = new WebSocket(url);

    socket.addEventListener('open', () => {
      status = 'connected';
      onOpen?.();
    });

    socket.addEventListener('close', (event) => {
      status = 'disconnected';
      onClose?.(event);
    });

    socket.addEventListener('error', (event) => {
      onError?.(event);
    });

    socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        onMessage?.(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error, event.data);
      }
    });
  }

  function send(event, data = {}) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not open. Cannot send event:', event);
      return;
    }

    socket.send(
      JSON.stringify({
        event,
        data
      })
    );
  }

  function authenticate(token) {
    send('auth', { token });
  }

  function disconnect() {
    if (!socket) {
      return;
    }

    socket.close();
    socket = null;
    status = 'disconnected';
  }

  function getStatus() {
    return status;
  }

  function getSocket() {
    return socket;
  }

  return {
    connect,
    send,
    authenticate,
    disconnect,
    getStatus,
    getSocket
  };
}