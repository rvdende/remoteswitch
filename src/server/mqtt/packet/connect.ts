import type { Packet } from "mqtt-packet";
import { generate } from "mqtt-packet";
import type { Socket } from "net";
import type { SocketExtended } from "../mqttserver";

export const handleMqttPacketConnect = async (socket: SocketExtended, packet: Packet) => {
    console.log(`packet`, packet);
    console.log('id',socket.id);
    // deny
    // socket.write(mqttpacket.generate({
    //     cmd: "connack",
    //     returnCode: 4,
    //     sessionPresent: false
    // }))

    // const client: MQTTClient = {
    //     id,
    //     socket,
    //     subscriptions: [],
    //     apikey: "test"
    // }

    // keep track of client
    // this.addClient(client);

    socket.write(generate({
        cmd: 'connack',
        returnCode: 0,
        sessionPresent: true
    }));

}