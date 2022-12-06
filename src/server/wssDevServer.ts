import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { createContext } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
// import { appRouter } from './routers/app';
// import { createContext } from './trpc';

import { MQTTServer } from '@/server/mqtt/mqttserver';

import fetch from 'node-fetch';
import { delay } from '@/utils/delay';


if (!global.fetch) {
    (global as any).fetch = fetch;
}

let mqtt: MQTTServer;
let wss : ws.Server<ws.WebSocket>;
let handler: any;

async function start() {
    console.log("---------- STARTING SERVER 1 ------------")
    await delay(1000);
    console.log("---------- STARTING SERVER 3 ------------")
    wss = new ws.Server({
        port: 3001,
    });
    handler = applyWSSHandler({
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

    mqtt = new MQTTServer();
    console.log('✅ MQTT Server listening on mqtt://localhost:1883');



    
}

process.on('SIGTERM', () => {
    console.log('======================== SIGTERM ============================');
    handler.broadcastReconnectNotification();
    wss.close();
    mqtt.close();
});

process.on("exit", () => {
    console.log("-===-=-=-=-=_+_+_+-=-=-=-=-=-=")
    // handler.broadcastReconnectNotification();
    wss.close();
    mqtt.close();
    console.log("-===-=-=-=-= EXIT 1=-=-=-=-=-=-=")
})

start();