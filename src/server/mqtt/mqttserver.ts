// http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718037
// https://docs.solace.com/MQTT-311-Prtl-Conformance-Spec/MQTT%20Control%20Packet%20format.htm#_Toc430864887

// todo check mqtt protocol version 3 or 4

import { EventEmitter } from "events"
import * as net from "net";
import { v4 as uuidv4 } from 'uuid';

import * as mqttpacket from 'mqtt-packet'
import { isJson } from "@/utils/isjson";
import { ee } from "../trpc/router/realtime";
import { prisma } from '@/server/db/client'
import { z } from "zod";
import { deviceDataSchema } from "@/validation/devicedata";
import { handleMqttPacket } from "./packet";
import type { Socket } from "net";

// interface ICorePacket {
//     id: string
// }

// interface IUser {
//     id: string
//     name: string
//     apikey?: string
// }



// interface MQTTClient {
//     id: string
//     socket: net.Socket
//     subscriptions: Subscription[]
//     apikey: string
// }


export interface SocketExtended extends Socket {
    id?: string
}

export class MQTTServer extends EventEmitter {
    server: net.Server;

    // connectedClients: MQTTClient[] = [];

    constructor() {
        super();
        this.server = net.createServer(this.handleClient);
        this.server.listen(1883);
    }

    handleClient = (socket: SocketExtended) => {
        const opts = { protocolVersion: 4 }; // default is 4. Usually, opts is a connect packet
        const parser = mqttpacket.parser(opts);

        socket.id = uuidv4();
        console.log('mqtt new socket client');

        socket.on('data', (data) => {
            parser.parse(data);
        })

        socket.on("close", (had_error) => {
            console.log(`mqtt client close had_error: ${had_error}`);
            socket.end();
            socket.destroy()
            //clearInterval(pinger);
            // this.removeClient(id);
        })

        socket.on("connect", () => { console.log(`mqtt client connect`); })
        socket.on("drain", () => { console.log(`mqtt client drain`); })
        socket.on("end", () => { console.log(`mqtt client end`); });
        // socket.on("error", (err) => { console.log(`mqtt client error: ${err.message}`); })
        socket.on("timeout", () => { console.log(`mqtt client timeout`); })

        // socket.on("lookup", (err, address, family, host) => {
        //     console.log(`mqtt client lookup ${{ err, address, family, host }}`);
        // })

        parser.on('packet', (packet) => {
            try {
                handleMqttPacket(socket, packet).catch(err => {
                    console.log(err.message);
                });
            } catch (err) { console.log(err); }
        });

    }

    /**
     * sends out packet to subscribed clients
     */
    // broadcast(apikey: string, packet: ICorePacket) {
    //     // console.log('MQTT clients connected:',this.connectedClients.length)
    //     for (const client of this.connectedClients) {
    //         // console.log('client.subscriptions:',client.subscriptions)                 
    //         for (const sub of client.subscriptions) {
    //             if (sub.apikey === apikey) {
    //                 console.log(`${new Date().toString()} sending mqtt`)
    //                 const send = true;
    //                 // if (sub.id) {
    //                 //     if (sub.id !== packet.id) { send = false; }
    //                 // }
    //                 if (send) {
    //                     const cleanpacket: any = JSON.parse(JSON.stringify(packet));
    //                     // delete cleanpacket._id;
    //                     delete cleanpacket.userid;
    //                     delete cleanpacket.timestamp;

    //                     console.log(`mqtt connected count: ${this.connectedClients.length} broadcasting to ${client.apikey} ${client.id} `)
    //                     client.socket.write(mqttpacket.generate({
    //                         cmd: 'publish',
    //                         topic: sub.apikey,
    //                         payload: Buffer.from(JSON.stringify(cleanpacket)),
    //                         qos: 0,
    //                         dup: false,
    //                         retain: false
    //                     }));
    //                 }
    //             }
    //         }
    //     }
    // }

    // addClient(client: MQTTClient) {
    //     let found = false;
    //     for (const c of this.connectedClients) {
    //         if (c.id === client.id) {
    //             found = true;
    //         }
    //     }
    //     if (found === false) {
    //         this.connectedClients.push(client);
    //         console.log(`mqtt adding client ${client.id} connected count after add: ${this.connectedClients.length}`);
    //     }
    // }

    // addSubscriptionsToUser(id: string, subscriptions: Subscription[]) {
    //     for (const client of this.connectedClients) {
    //         if (client.id == id) {
    //             for (const sub of subscriptions) {
    //                 if (client.subscriptions.indexOf(sub) == -1) {
    //                     client.subscriptions.push(sub);
    //                 }
    //             }
    //         }
    //     }
    // }

    // removeClient = (id: string) => {
    //     const filtered = this.connectedClients.filter(i => (i.id != id))
    //     this.connectedClients = filtered;
    //     console.log(`mqtt removed client ${id} connected count: ${this.connectedClients.length}`);
    // }
}
