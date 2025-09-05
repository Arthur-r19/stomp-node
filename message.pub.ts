import { Client } from '@stomp/stompjs';
import WebSocket from 'ws';

const RABBIT_URL = process.env.RABBIT_URL || 'ws://localhost:15674/ws';
const DESTINATION = process.env.DESTINATION || '/topic/echo';
const LOGIN = process.env.RABBIT_LOGIN || 'guest';
const PASSCODE = process.env.RABBIT_PASSCODE || 'guest';
const args = process.argv.slice(2);
const MESSAGE = (args.length > 0 ? args.join(' ') : (process.env.MESSAGE || 'hello from publisher'));

const client = new Client({
  brokerURL: RABBIT_URL,
  connectHeaders: {
    login: LOGIN,
    passcode: PASSCODE,
  },
  webSocketFactory: () => new WebSocket(RABBIT_URL),
  debug: () => {}, //(str: string) => console.log('[stomp]', str),
  reconnectDelay: 0,
});

client.onConnect = () => {
  console.log(`[ok] conectado. Publicando em ${DESTINATION}`);
  client.publish({ destination: DESTINATION, body: MESSAGE });
  console.log(`[sent] ${MESSAGE}`);
  client.deactivate();
};

client.onStompError = (frame) => {
  console.error('[stomp-error] Command:', frame.command, 'Headers:', frame.headers, 'Body:', frame.body);
};

client.activate();


