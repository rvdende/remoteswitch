import type { Packet } from "mqtt-packet";
import { generate } from "mqtt-packet";
import type { SocketExtended } from "../mqttserver";
import { handleMqttPacketPublish } from "./publish";
import { handleMqttPacketSubscribe } from "./subscribe";
import { realtimeEvents } from "../../trpc/router/datasource";

export const handleMqttPacket = async (
  socket: SocketExtended,
  packet: Packet
) => {
  if (packet.cmd === "connect") {
    console.log(`${new Date().toISOString()} new device connected on mqtt.`);

    realtimeEvents.on("send", (data) => {
      if (data.uuid === packet.clientId) {
        if (socket.writable)
          socket.write(
            generate({
              cmd: "publish",
              topic: "mqtt",
              payload: JSON.stringify(data),
              qos: 0,
              dup: false,
              retain: false,
            })
          );
      }
    });

    socket.write(
      generate({
        cmd: "connack",
        returnCode: 0,
        sessionPresent: true,
      })
    );
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

    socket.write(
      generate({
        cmd: "pingresp",
      })
    );
  }

  if (packet.cmd == "publish") {
    handleMqttPacketPublish(socket, packet);
  }

  return;
};
