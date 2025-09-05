import { Client } from '@stomp/stompjs';
import WebSocket from 'ws';

// RabbitMQ Web STOMP (porta 15674)
const RABBIT_URL = 'ws://localhost:15674/ws';
const ECHO_IN = '/topic/echo';
const ECHO_OUT = '/topic/echo.reply';

const client = new Client({
  brokerURL: RABBIT_URL,
  connectHeaders: {
    login: 'guest',
    passcode: 'guest',
  },
  webSocketFactory: () => new WebSocket(RABBIT_URL),
  debug: (str: string) => console.log('[stomp]', str),
  reconnectDelay: 5000,
});

client.onConnect = (frame: any) => {
  console.log('[ok] conectado ao RabbitMQ via STOMP');

  client.subscribe(ECHO_IN, (message: any) => {
    const body = message.body;
    // evita eco infinito
    if (message.headers['x-echoed'] === '1') return;

    client.publish({
      destination: ECHO_OUT,
      body,
      headers: { 'x-echoed': '1', 'correlation-id': message.headers['message-id'] },
    });

    console.log(`[echo] ${body}`);
  });

  console.log(`[ok] escutando ${ECHO_IN} e publicando eco em ${ECHO_OUT}`);
};

client.activate();
