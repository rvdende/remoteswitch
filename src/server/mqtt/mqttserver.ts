import { EventEmitter } from "events";
import * as net from "net";
import { v4 as uuidv4 } from "uuid";
import * as mqttpacket from "mqtt-packet";
import { handleMqttPacket } from "./packet";
import type { Socket } from "net";

export interface SocketExtended extends Socket {
  id?: string;
}

export class MQTTServer extends EventEmitter {
  server: net.Server | undefined;

  constructor() {
    super();
    this.server = net.createServer(this.handleClient);
    this.server.listen(1883);
  }

  close() {
    if (this.server) this.server.close();
    delete this.server;
  }

  handleClient = (socket: SocketExtended) => {
    const opts = { protocolVersion: 4 }; // default is 4. Usually, opts is a connect packet
    const parser = mqttpacket.parser(opts);

    socket.id = uuidv4();
    console.log("mqtt new socket client");

    socket.on("data", (data) => {
      parser.parse(data);
    });

    socket.on("close", (had_error) => {
      console.log(`mqtt client close had_error: ${had_error}`);
      socket.end();
      socket.destroy();
    });

    socket.on("connect", () => {
      console.log(`mqtt client connect`);
    });
    socket.on("drain", () => {
      console.log(`mqtt client drain`);
    });
    socket.on("end", () => {
      console.log(`mqtt client end`);
    });
    // socket.on("error", (err) => { console.log(`mqtt client error: ${err.message}`); })
    socket.on("timeout", () => {
      console.log(`mqtt client timeout`);
    });

    parser.on("packet", (packet) => {
      try {
        handleMqttPacket(socket, packet).catch((err) => {
          console.log(err.message);
        });
      } catch (err) {
        console.log(err);
      }
    });
  };
}
