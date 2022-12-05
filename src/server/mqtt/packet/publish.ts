import { isJson } from "@/utils/isjson";
import { deviceDataSchema } from "@/validation/devicedata";
import type { IPublishPacket, Packet } from "mqtt-packet";
import { generate } from "mqtt-packet";
import type { Socket } from "net";
import { prisma } from '@/server/db/client'
import { ee } from "@/server/trpc/router/realtime";
import { Rdatasource, Rinput, Routput } from "@prisma/client";

export const handleMqttPacketPublish = async (socket: Socket, packet: IPublishPacket) => {
    console.log(`PUBLISH`, packet);



    // console.log(packet)

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
        where: { uuid: parsed.uuid },
        include: {
            inputs: true,
            outputs: true
        }
    })

    console.log(dbentry);

    const dbEntryPrepared = {
        uuid: parsed.uuid || "",
        name: parsed.name || "",
        description: parsed.description || "",
        type: parsed.type || "",
        inputs: {
            create: parsed.inputs.map(i => {
                const input = {
                    name: i.name,
                    description: i.description,
                    type: i.type,
                    value: (typeof i.value !== "string") ? `${i.value}` : i.value,
                }

                return input;
            })
        },
        outputs: {
            create: parsed.outputs.map(i => {
                const output = {
                    name: i.name,
                    description: i.description,
                    type: i.type,
                    value: (typeof i.value !== "string") ? `${i.value}` : i.value,
                }

                return output;
            })
        },
    }

    if (!dbentry) {
        console.log('unknown device')
        // add it ?
        await prisma.rdatasource.create({
            data: dbEntryPrepared,
        }).then(console.log)

    } else {
        console.log('known device!')
        await prisma.rdatasource.update({
            data: {
                packetCount: { increment: 1 },
                dataRx: { increment: packet.payload.length },
                inputs: {
                    updateMany: dbEntryPrepared.inputs.create.map( o => {
                        return { 
                            where: { name: o.name},
                            data: { value: o.value }
                        }
                    })
                },
                outputs: {
                    updateMany: dbEntryPrepared.outputs.create.map( o => {
                        return { 
                            where: { name: o.name},
                            data: { value: o.value }
                        }
                    })
                }
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