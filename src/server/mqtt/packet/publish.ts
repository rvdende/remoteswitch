import { isJson } from "@/utils/isjson";
import { deviceDataSchema } from "@/validation/devicedata";
import type { IPublishPacket, Packet } from "mqtt-packet";
import { generate } from "mqtt-packet";
import type { Socket } from "net";
import { prisma } from '@/server/db/client'
import { ee } from "@/server/trpc/router/realtime";
import { Rdatasource, Rinput, Routput } from "@prisma/client";
import { realtimeEvents } from "@/server/trpc/router/datasource";

export const handleMqttPacketPublish = async (socket: Socket, packet: IPublishPacket) => {

    try {

        // console.log(packet)

        if (!isJson(packet.payload.toString())) return;

        const payloadJSON = JSON.parse(packet.payload.toString());
        // console.log(payloadJSON);

        // validate with zod.
        const parsedZod = await deviceDataSchema.safeParse(payloadJSON);

        if (!parsedZod.success) {
            console.log('Zod parse failed.');

            console.log(parsedZod.error.format());

            return;
        }

        const parsed = parsedZod.data;

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
        }).catch(err => {
            console.log(err.message);
        })

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
            }).catch(err => {
                console.log(err.message);
            })

        } else {
            console.log('known device!')
            await prisma.rdatasource.update({
                data: {
                    packetCount: { increment: 1 },
                    dataRx: { increment: packet.payload.length },
                    inputs: {
                        updateMany: dbEntryPrepared.inputs.create.map(o => {
                            return {
                                where: { name: o.name },
                                data: { value: o.value }
                            }
                        })
                    },
                    outputs: {
                        updateMany: dbEntryPrepared.outputs.create.map(o => {
                            return {
                                where: { name: o.name },
                                data: { value: o.value }
                            }
                        })
                    }
                },
                where: { uuid }
            }).catch(err => {
                console.log(err.message);
            })
        }

        const dbentryFinal = await prisma.rdatasource.findFirst({
            where: { uuid: parsed.uuid },
            include: {
                users: {
                    select: {
                        email: true
                    }
                },
                inputs: true,
                outputs: true
            }
        }).catch(err => {
            console.log(err.message);
        })
        
        realtimeEvents.emit('datasource', dbentryFinal);

        if (packet.qos == 0) return;

        socket.write(generate({
            cmd: 'puback',
            messageId: packet.messageId
        }))


    } catch (err: any) {
        console.log(err.message);
    }



}