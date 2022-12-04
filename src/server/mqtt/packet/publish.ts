import { isJson } from "@/utils/isjson";
import { deviceDataSchema } from "@/validation/devicedata";
import type { IPublishPacket, Packet } from "mqtt-packet";
import { generate } from "mqtt-packet";
import type { Socket } from "net";
import { prisma } from '@/server/db/client'
import { ee } from "@/server/trpc/router/realtime";

export const handleMqttPacketPublish = async (socket: Socket, packet: IPublishPacket) => {
    console.log(`PUBLISH`, packet);



    console.log(packet)

    if (!isJson(packet.payload.toString())) return;

    const payloadJSON = JSON.parse(packet.payload.toString());
    console.log(payloadJSON);

    // validate with zod.
    const parsed = await deviceDataSchema.parseAsync(payloadJSON).catch(err => {
        console.log('err');
    });

    if (!parsed) return;

    const uuid = parsed.uuid;
    if (!uuid) {
        console.log("Need a device uuid. Either in packet or saved on the connection.")
        return;
    }

    // check if the device uuid exists.
    const dbentry = await prisma.rdatasource.findFirst({
        where: { uuid: parsed.uuid }
    })

    if (!dbentry) {
        console.log('unknown device')
        // add it ?
        await prisma.rdatasource.create({
            data: {
                uuid,
                name: "",
                description: "",
                type: "",
                userid: ""
            }
        }).then(console.log)

    } else {
        console.log('known device!')
        await prisma.rdatasource.update({
            data: {
                updatedAt: new Date()
            },
            where: { uuid }
        })
    }

    //////

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

    socket.write(generate({
        cmd: 'puback',
        messageId: packet.messageId
    }))






}