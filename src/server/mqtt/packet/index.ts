import type { Packet } from 'mqtt-packet';
import { generate } from 'mqtt-packet'
import type { SocketExtended } from '../mqttserver';
import { handleMqttPacketConnect } from './connect';
import { handleMqttPacketPublish } from './publish';
import { handleMqttPacketSubscribe } from './subscribe';

export const handleMqttPacket = async (
    socket: SocketExtended,
    packet: Packet
) => {

    if (packet.cmd === "connect") {
        handleMqttPacketConnect(socket, packet);
        return;
    }



    if (packet.cmd == "subscribe") {
        handleMqttPacketSubscribe(socket, packet);
    }

    
    //// - - - - -
    if (packet.cmd == "pingreq") {
        // console.log('mqtt ping resp')
        // updates last seen and so on so we know the device is alive.

        // TODO update db entry lastSeen datetime if authed

        socket.write(generate({
            cmd: 'pingresp'
        }))
    }

    if (packet.cmd == "publish") {
        handleMqttPacketPublish(socket, packet);
    }

    return;
}