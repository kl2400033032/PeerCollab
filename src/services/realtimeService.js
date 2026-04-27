import { Client } from '@stomp/stompjs';

let client;

function getSocketBaseUrl() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  return apiBase.replace(/\/api\/?$/, '');
}

function getBrokerUrl() {
  const socketBaseUrl = getSocketBaseUrl();
  if (socketBaseUrl.startsWith('https://')) {
    return socketBaseUrl.replace('https://', 'wss://') + '/ws';
  }
  return socketBaseUrl.replace('http://', 'ws://') + '/ws';
}

export function connectRealtime(onConnect) {
  if (client?.active) {
    onConnect?.(client);
    return client;
  }

  client = new Client({
    brokerURL: getBrokerUrl(),
    reconnectDelay: 5000,
    debug: () => {},
    onConnect: () => onConnect?.(client),
  });

  client.activate();
  return client;
}

export function disconnectRealtime() {
  if (client?.active) {
    client.deactivate();
  }
}
