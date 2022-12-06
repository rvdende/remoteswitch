import { Client } from 'https://deno.land/x/mqtt/deno/mod.ts'; // Deno (ESM)
// const { Client } = require('@jdiamond/mqtt'); // Node.js (CommonJS)
// import { Client } from 'https://unpkg.com/@jdiamond/mqtt-browser'; // Browsers (ESM)


interface PacketSchema {
    id?: number | undefined;
    uuid?: string | undefined;
    name: string;
    type?: string | undefined;
    description?: string | undefined;
    outputs: InputOutputData[]
    inputs: InputOutputData[]
}

type InputOutputData = {
    type: string;
    description: string;
    name: string;
    value: string;
}


const delay = (time: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, time);
    })
}

const createDevice = async (options: {
    name: string;
    uuid: string;
    inputs: () => InputOutputData[];
    outputs: () => InputOutputData[];
}) => {
    await delay(Math.random() * 2000);

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


    // type DataUnion = ({
    //     type: "number";
    //     description: string;
    //     name: string;
    //     value: number;
    // } | {
    //     type: "string";
    //     description: string;
    //     name: string;
    //     value: string;
    // } | {
    //     type: "boolean";
    //     description: string;
    //     name: string;
    //     value: boolean;
    // })



    setInterval(async () => {
        id++;

        const data: PacketSchema = {
            id, // optional packet number. useful if you want replies to queries.
            uuid: options.uuid || "616781a7-4ab5-45e3-96cc-a97233b0df02", // must be on the first packet.. may be on every packet
            name: options.name || "Deno Mqtt Tester",
            description: "Deno MQTT Tester to try out mqtt.",
            type: "Deno MQTT",
            inputs: options.inputs(),
            outputs: options.outputs(),
        }

        await client.publish('mqtt', JSON.stringify(data));
    }, 500)

    // await client.disconnect();
}


createDevice({
    uuid: "616781a7-4ab5-45e3-96cc-a97233b0df02", // must be on the first packet.. may be on every packet
    name: "Braam Solar Controller",
    inputs: () => {
        return [{
            name: "Relay A",
            description: "Switch AC Power. True is on.",
            type: "boolean",
            value: "false"
        }]
    },
    outputs: () => {
        return []
    },
})

createDevice({
    uuid: "234567834567dftgyhjn", // must be on the first packet.. may be on every packet
    name: "Rouan Pool Controller",
    inputs: () => {
        return [{
            name: "Filter Pump",
            description: "Relay A",
            type: "boolean",
            value: "false"
        },
        {
            name: "Overflow Pump",
            description: "Relay B",
            type: "boolean",
            value: "false"
        }]
    },
    outputs: () => {
        return [{
            name: "Temperature Sensor",
            description: "ambient air temperature",
            type: "number",
            value: `${(Math.random() + 37).toFixed(2)}°C`
        },
        // {
        //     name: "RelayB 1",
        //     description: "Switch State",
        //     type: "boolean",
        //     value: `${Math.random() > 0.5}`
        // },
        // {
        //     name: "RelayB 2",
        //     description: "Switch State",
        //     type: "boolean",
        //     value: `${Math.random() > 0.5}`
        // }
        ]

    },
})

