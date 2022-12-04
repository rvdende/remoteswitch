// http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718037
// https://docs.solace.com/MQTT-311-Prtl-Conformance-Spec/MQTT%20Control%20Packet%20format.htm#_Toc430864887

// todo check mqtt protocol version 3 or 4

import { EventEmitter } from "events"
import * as net from "net";
import { v4 as uuidv4 } from 'uuid';

import * as mqttpacket from 'mqtt-packet'
import { isJson } from "@/utils/isjson";
import { ee } from "../trpc/router/realtime";

interface ICorePacket {
    id: string
}

interface IUser {
    id: string
    name: string
    apikey?: string
}

export interface Subscription {
    /** apikey to authenticate subscription */
    apikey: string
    /** id of the device to subscribe to */
    id?: string
}

interface MQTTClient {
    id: string
    socket: net.Socket
    subscriptions: Subscription[]
    apikey: string
}

export class MQTTServer extends EventEmitter {
    server: net.Server;

    connectedClients: MQTTClient[] = [];

    constructor() {
        super();
        this.server = net.createServer(this.handleClient);
        this.server.listen(1883);
    }

    handleClient = (socket: net.Socket) => {
        const opts = { protocolVersion: 4 }; // default is 4. Usually, opts is a connect packet
        const parser = mqttpacket.parser(opts);

        const id = uuidv4();
        console.log('mqtt new socket client');

        socket.on('data', (data) => {
            parser.parse(data);
        })

        socket.on("close", (had_error) => {
            console.log(`mqtt client close had_error: ${had_error}`);
            socket.end();
            socket.destroy()
            //clearInterval(pinger);
            this.removeClient(id);
        })

        socket.on("connect", () => { console.log(`mqtt client connect`); })
        socket.on("drain", () => { console.log(`mqtt client drain`); })
        socket.on("end", () => { console.log(`mqtt client end`); });
        socket.on("error", (err) => { console.log(`mqtt client error: ${err.message}`); })
        socket.on("timeout", () => { console.log(`mqtt client timeout`); })

        socket.on("lookup", (err, address, family, host) => {
            console.log(`mqtt client lookup ${{ err, address, family, host }}`);
        })

        parser.on('packet', async packet => {
            if (packet.cmd == "connect") {
                console.log(`packet`, packet)

                // deny
                // socket.write(mqttpacket.generate({
                //     cmd: "connack",
                //     returnCode: 4,
                //     sessionPresent: false
                // }))



                const client: MQTTClient = {
                    id,
                    socket,
                    subscriptions: [],
                    apikey: "test"
                }

                // keep track of client
                this.addClient(client);

                socket.write(mqttpacket.generate({
                    cmd: 'connack',
                    returnCode: 0,
                    sessionPresent: true
                }));
            }

            //// - - - - -
            if (packet.cmd == "subscribe") {
                let count = 0;
                const new_subscriptions: Subscription[] = [];

                for (const sub of packet.subscriptions) {
                    const subraw = sub.topic;
                    if (isJson(subraw)) {
                        const new_sub: Subscription = JSON.parse(subraw);
                        if (new_sub.apikey) {
                            new_subscriptions.push(new_sub)
                        }
                    } else {
                        const new_sub: Subscription = { apikey: sub.topic, id };
                        new_subscriptions.push(new_sub)
                    }
                    count++;
                    if (count == packet.subscriptions.length) {

                        this.addSubscriptionsToUser(id, new_subscriptions);

                        socket.write(mqttpacket.generate({
                            cmd: 'suback',
                            messageId: packet.messageId,
                            granted: [0]
                        }));
                    }
                }
            }
            //// - - - - -
            if (packet.cmd == "pingreq") {
                // console.log('mqtt ping resp')
                // updates last seen and so on so we know the device is alive.

                // TODO update db entry lastSeen datetime if authed

                socket.write(mqttpacket.generate({
                    cmd: 'pingresp'
                }))
            }

            if (packet.cmd == "publish") {
                console.log(packet)

                if (!isJson(packet.payload.toString())) return;

                const payloadJSON = JSON.parse(packet.payload.toString());

                console.log(payloadJSON);

                ee.emit('add', payloadJSON);
                // if (isJson(packet.payload)) {
                //     const corepacket: ICorePacket = JSON.parse(packet.payload.toString());
                //     corepacket.userid = authed_user.userid

                //     if (!thisconnectionApikey) return;

                //     let result = await handleCorePacket(
                //         thisconnectionApikey, // authed_user.apikey[0],
                //         corepacket,
                //         this.props.db,
                //         this.props,
                //         'mqtt'
                //     ).catch(err => {
                //         console.log(err);
                //     });
                //     if (result) {
                //         // console.log('PUBLISH SUCCESS', corepacket);
                //         last_packet = corepacket;
                //         if (packet.qos > 0) {
                //             socket.write(mqttpacket.generate({
                //                 cmd: 'puback',
                //                 messageId: packet.messageId
                //             }))
                //         }
                //     }
                // } else {
                //     console.log('not valid corepacket? ', packet.payload.toString())
                // }

                if (packet.qos == 0) return;

                socket.write(mqttpacket.generate({
                    cmd: 'puback',
                    messageId: packet.messageId
                }))

            }

        })

    }

    /**
     * sends out packet to subscribed clients
     */
    broadcast(apikey: string, packet: ICorePacket) {
        // console.log('MQTT clients connected:',this.connectedClients.length)
        for (const client of this.connectedClients) {
            // console.log('client.subscriptions:',client.subscriptions)                 
            for (const sub of client.subscriptions) {
                if (sub.apikey === apikey) {
                    console.log(`${new Date().toString()} sending mqtt`)
                    const send = true;
                    // if (sub.id) {
                    //     if (sub.id !== packet.id) { send = false; }
                    // }
                    if (send) {
                        const cleanpacket: any = JSON.parse(JSON.stringify(packet));
                        // delete cleanpacket._id;
                        delete cleanpacket.userid;
                        delete cleanpacket.timestamp;

                        console.log(`mqtt connected count: ${this.connectedClients.length} broadcasting to ${client.apikey} ${client.id} `)
                        client.socket.write(mqttpacket.generate({
                            cmd: 'publish',
                            topic: sub.apikey,
                            payload: Buffer.from(JSON.stringify(cleanpacket)),
                            qos: 0,
                            dup: false,
                            retain: false
                        }));
                    }
                }
            }
        }
    }

    addClient(client: MQTTClient) {
        let found = false;
        for (const c of this.connectedClients) {
            if (c.id === client.id) {
                found = true;
            }
        }
        if (found === false) {
            this.connectedClients.push(client);
            console.log(`mqtt adding client ${client.id} connected count after add: ${this.connectedClients.length}`);
        }
    }

    addSubscriptionsToUser(id: string, subscriptions: Subscription[]) {
        for (const client of this.connectedClients) {
            if (client.id == id) {
                for (const sub of subscriptions) {
                    if (client.subscriptions.indexOf(sub) == -1) {
                        client.subscriptions.push(sub);
                    }
                }
            }
        }
    }

    removeClient = (id: string) => {
        const filtered = this.connectedClients.filter(i => (i.id != id))
        this.connectedClients = filtered;
        console.log(`mqtt removed client ${id} connected count: ${this.connectedClients.length}`);
    }
}
