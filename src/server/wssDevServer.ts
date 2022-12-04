import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { createContext } from './trpc/context';
import { appRouter } from './trpc/router/_app';
// import { appRouter } from './routers/app';
// import { createContext } from './trpc';

import { MQTTServer } from './mqtt/mqttserver';

import fetch from 'node-fetch';

if (!global.fetch) {
    (global as any).fetch = fetch;
}

const wss = new ws.Server({
    port: 3001,
});
const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext
});

wss.on('connection', (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once('close', (err) => {
        console.log(`➖➖ Connection (${wss.clients.size})`);
        console.log(err);
    });
});

console.log('✅ WebSocket Server listening on ws://localhost:3001');


const mqtt = new MQTTServer();
console.log('✅ MQTT Server listening on mqtt://localhost:1883');

process.on('SIGTERM', () => {
    console.log('SIGTERM');
    handler.broadcastReconnectNotification();
    wss.close();
});