import { isJson } from "../../../utils/isjson";
import {
  compareInputOutputs,
  deviceDataSchema,
} from "../../../validation/devicedata";
import type { IPublishPacket } from "mqtt-packet";
import { generate } from "mqtt-packet";
import type { Socket } from "net";
import { prisma } from "../../db/client";
// import { realtimeEvents } from "@/server/trpc/router/datasource";
import { realtimeEvents } from "../../trpc/router/datasource";

export const handleMqttPacketPublish = async (
  socket: Socket,
  packet: IPublishPacket
) => {
  try {
    if (!isJson(packet.payload.toString())) return;

    const payloadJSON = JSON.parse(packet.payload.toString());

    // validate with zod.
    const parsedZod = deviceDataSchema.safeParse(payloadJSON);

    if (!parsedZod.success) {
      console.log("Zod parse failed.");
      console.log(parsedZod.error.format());
      return;
    }

    const parsed = parsedZod.data;
    if (!parsed) return;
    const uuid = parsed.uuid;
    if (!uuid) {
      console.log(
        "Need a device uuid. Either in packet or saved on the connection."
      );
      return;
    }

    // check if the device uuid exists.
    const dbentry = await prisma.rdatasource
      .findFirst({
        where: { uuid: parsed.uuid },
        include: {
          inputs: true,
          outputs: true,
        },
      })
      .catch((err) => {
        console.log(err.message);
      });

    const dbEntryPrepared = {
      uuid: parsed.uuid || "",
      name: parsed.name || "",
      description: parsed.description || "",
      type: parsed.type || "",
      inputs: {
        create: parsed.inputs.map((i) => {
          const input = {
            name: i.name,
            description: i.description,
            type: i.type,
            value: typeof i.value !== "string" ? `${i.value}` : i.value,
          };

          return input;
        }),
      },
      outputs: {
        create: parsed.outputs.map((i) => {
          const output = {
            name: i.name,
            description: i.description,
            type: i.type,
            value: typeof i.value !== "string" ? `${i.value}` : i.value,
          };

          return output;
        }),
      },
    };

    if (!dbentry) {
      console.log("unknown device adding!");
      // add it ?
      await prisma.rdatasource
        .create({
          data: dbEntryPrepared,
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      await prisma.rdatasource
        .update({
          data: {
            name: dbEntryPrepared.name,
            packetCount: { increment: 1 },
            dataRx: { increment: packet.payload.length },
            inputs: {
              updateMany: dbEntryPrepared.inputs.create.map((o) => {
                return {
                  where: { name: o.name },
                  data: { value: o.value },
                };
              }),
            },
            outputs: {
              updateMany: dbEntryPrepared.outputs.create.map((o) => {
                return {
                  where: { name: o.name },
                  data: { value: o.value },
                };
              }),
            },
          },
          where: { uuid },
        })
        .catch((err) => {
          console.log(err);
        });

      // check for new inputs or outputs.
      const inputdiff = compareInputOutputs(
        dbentry.inputs,
        dbEntryPrepared.inputs.create
      );
      const outputdiff = compareInputOutputs(
        dbentry.outputs,
        dbEntryPrepared.outputs.create
      );
      if (inputdiff || outputdiff)
        await prisma.rdatasource
          .update({
            where: { uuid },
            data: {
              inputs: inputdiff && {
                create: inputdiff.toAdd,
                deleteMany: inputdiff.toRemove.map((i) => ({ id: i.id })),
              },
              outputs: outputdiff && {
                create: outputdiff.toAdd,
                deleteMany: outputdiff.toRemove.map((i) => ({ id: i.id })),
              },
            },
          })
          .catch((err) => {
            console.log(err.message);
          });
      // done updating device db.
    }

    const dbentryFinal = await prisma.rdatasource
      .findFirst({
        where: { uuid: parsed.uuid },
        include: {
          users: {
            select: {
              email: true,
            },
          },
          inputs: true,
          outputs: true,
        },
      })
      .catch((err) => {
        console.log(err.message);
      });

    realtimeEvents.emit("datasource", dbentryFinal);

    if (packet.qos == 0) return;

    socket.write(
      generate({
        cmd: "puback",
        messageId: packet.messageId,
      })
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  } catch (err: Error) {
    if (err?.message) console.log(err.message);
  }
};
