import { z } from "zod";



const dataGeneric = z.object({ name: z.string(), description: z.string() })

const dataUnion = z.discriminatedUnion("type", [
    dataGeneric.extend({ type: z.literal("number"), value: z.number() }),
    dataGeneric.extend({ type: z.literal("string"), value: z.string() }),
    dataGeneric.extend({ type: z.literal("boolean"), value: z.boolean() }),
])

export const deviceDataSchema = z.object({
    id: z.number().optional(),  // packet number
    uuid: z.string(),    // unique identified
    type: z.string(), // type of datasource
    name: z.string(),
    description: z.string().optional(), // additional description
    outputs: dataUnion.array(),
    inputs: dataUnion.array(),
})