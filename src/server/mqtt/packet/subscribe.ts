import { isJson } from "@/utils/isjson";
import type { ISubscribePacket, Packet } from "mqtt-packet";
import { generate } from "mqtt-packet";
// import type { Socket } from "net";
import type { SocketExtended } from "../mqttserver";

export interface Subscription {
    /** apikey to authenticate subscription */
    apikey: string
    /** id of the device to subscribe to */
    id?: string
}

export const handleMqttPacketSubscribe = async (
    socket: SocketExtended,
    packet: ISubscribePacket
) => {
    console.log('MQTT SUBSCRIBE', packet)
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
            const new_sub: Subscription = { apikey: sub.topic, id: socket.id };
            new_subscriptions.push(new_sub)
        }
        count++;
        if (count == packet.subscriptions.length) {

            // this.addSubscriptionsToUser(id, new_subscriptions);

            socket.write(generate({
                cmd: 'suback',
                messageId: packet.messageId,
                granted: [0]
            }));
        }
    }
}