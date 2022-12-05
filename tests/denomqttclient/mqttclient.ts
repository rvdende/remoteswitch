import { Client } from 'https://deno.land/x/mqtt/deno/mod.ts'; // Deno (ESM)
// const { Client } = require('@jdiamond/mqtt'); // Node.js (CommonJS)
// import { Client } from 'https://unpkg.com/@jdiamond/mqtt-browser'; // Browsers (ESM)

const client = new Client({ url: 'mqtt://localhost:1883' }); // Deno and Node.js
// const client = new Client({ url: 'ws://test.mosquitto.org:8081' }); // Browsers

await client.connect();
console.log('connected?')


console.log("subscribing");
await client.subscribe('mqtt');
console.log("subscribed");

client.on('message', (topic: string, payload: string) => {
    console.log(topic, payload);
});

let id = 0;

interface PacketSchema {
    id?: number | undefined;
    uuid?: string | undefined;
    name: string;
    type?: string | undefined;
    description?: string | undefined;
    outputs: DataUnion[]
    inputs: DataUnion[]
}

type DataUnion = ({
    type: "number";
    description: string;
    name: string;
    value: number;
} | {
    type: "string";
    description: string;
    name: string;
    value: string;
} | {
    type: "boolean";
    description: string;
    name: string;
    value: boolean;
})



setInterval(async () => {
    id++;

    const data: PacketSchema = {
        id, // optional packet number. useful if you want replies to queries.
        uuid: "616781a7-4ab5-45e3-96cc-a97233b0df02", // must be on the first packet.. may be on every packet
        name: "Deno Mqtt Tester",
        description: "Deno MQTT Tester to try out mqtt.",
        type: "Deno MQTT",
        inputs: [{
            name: "Relay A",
            description: "Switch AC Power. True is on.",
            type: "boolean",
            value: false
        }],
        outputs: [{
            name: "temperature",
            description: "ambient air temperature",
            type: "number",
            value: Math.random() * 100
        }]
    }

    await client.publish('mqtt', JSON.stringify(data));
}, 1000)

// await client.disconnect();