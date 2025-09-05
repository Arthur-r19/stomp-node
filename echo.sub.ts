import { Client, IMessage } from '@stomp/stompjs';
import WebSocket from 'ws';

const RABBIT_URL = process.env.RABBIT_URL || 'ws://localhost:15674/ws';
const DESTINATION = process.env.DESTINATION || '/topic/echo';
const LOGIN = process.env.RABBIT_LOGIN || 'guest';
const PASSCODE = process.env.RABBIT_PASSCODE || 'guest';

const client = new Client({
  brokerURL: RABBIT_URL,
  connectHeaders: {
    login: LOGIN,
    passcode: PASSCODE,
  },
  webSocketFactory: () => new WebSocket(RABBIT_URL),
  debug: () => {}, //(str: string) => console.log('[stomp]', str),
  reconnectDelay: 5000,
});

client.onConnect = () => {
  console.log(`[ok] conectado ao RabbitMQ via STOMP. Assinando ${DESTINATION}`);

  client.subscribe(DESTINATION, (message: IMessage) => {
    console.log(`[recv] ${message.body}`);
  });
};

client.onStompError = (frame) => {
  console.error('[stomp-error] Command:', frame.command, 'Headers:', frame.headers, 'Body:', frame.body);
};

client.activate();


