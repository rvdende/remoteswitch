import { Client } from 'https://deno.land/x/mqtt/deno/mod.ts'; // Deno (ESM)
// const { Client } = require('@jdiamond/mqtt'); // Node.js (CommonJS)
// import { Client } from 'https://unpkg.com/@jdiamond/mqtt-browser'; // Browsers (ESM)

const client = new Client({ url: 'mqtt://localhost:1883' }); // Deno and Node.js
// const client = new Client({ url: 'ws://test.mosquitto.org:8081' }); // Browsers

await client.connect();
console.log('connected?')


// console.log("subscribing");
// await client.subscribe('mqtt');
// console.log("subscribed");

client.on('message', (topic: string, payload: string) => {
  console.log(topic, payload);
});

console.log('publish')

console.log('done');

let id = 0;

setInterval(async () => {
  id++;
  await client.publish('mqtt', JSON.stringify({
    id,
    uuid: "616781a7-4ab5-45e3-96cc-a97233b0df02",
    data: { temperature: Math.random()*100 }
  }));
}, 1000)

// await client.disconnect();