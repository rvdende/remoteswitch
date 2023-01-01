import { z } from "zod";

const dataGeneric = z.object({
  uid: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  value: z.string(),
});

// const dataUnion = z.discriminatedUnion("type", [
//     dataGeneric.extend({ type: z.literal("number"), value: z.number() }),
//     dataGeneric.extend({ type: z.literal("string"), value: z.string() }),
//     dataGeneric.extend({ type: z.literal("boolean"), value: z.boolean() }),
//     dataGeneric.extend({ type: z.string(), value: z.string() })
// ])

export const deviceDataSchema = z.object({
  id: z.number().optional(), // packet number
  uuid: z.string(), // unique identified
  type: z.string(), // type of datasource
  name: z.string(),
  description: z.string().optional(), // additional description
  outputs: dataGeneric.array(),
  inputs: dataGeneric.array(),
});

export const compareInputOutputs = (
  itemsExisting: (z.infer<typeof dataGeneric> & { id: string })[],
  itemsNew: z.infer<typeof dataGeneric>[]
) => {
  const toAdd = itemsNew.filter(
    (item) => itemsExisting.map((o) => o.name).indexOf(item.name) < 0
  );
  const toRemove = itemsExisting.filter(
    (item) => itemsNew.map((o) => o.name).indexOf(item.name) < 0
  );

  if (toAdd.length == 0 && toRemove.length === 0) return;

  return { toAdd, toRemove };
};
