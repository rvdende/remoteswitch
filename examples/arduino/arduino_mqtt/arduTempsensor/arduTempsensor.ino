#include "config.h" // EDIT YOUR UUID KEY. Copy config.example.h.
#include <ArduinoJson.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <Arduino.h>

#define CONFIG_SERVER "192.168.1.192"           // DEV
// #define CONFIG_SERVER "remoteswitch.net"     // PROD
#define CONFIG_MQTTPORT 1883
// TODO - make this a config option eeprom
#define CONFIG_NAME "Pool Sensor"
#define CONFIG_TYPE "Arduino MQTT Temperature Sensor"
#define CONFIG_DESCRIPTION "Rouan temperature sensor"

EthernetClient ethClient;
PubSubClient client(ethClient);

long lastHeartbeat = 0;
volatile bool shouldsendstate = true;

// DEVICE
const char *name = CONFIG_NAME;
const char *uuid = CONFIG_UUID;
const char *type = CONFIG_TYPE;
const char *mqttServer = CONFIG_SERVER;
const int mqttPort = CONFIG_MQTTPORT;
volatile bool shouldSendUpdate = false;
long lastReconnectAttempt = 0;

const byte pinLED = 13;
// const byte pin_relayB = 12;
// const byte pin_relayC = 11;
// const byte pin_relayD = 9;

/// INPUT 1
StaticJsonDocument<200> input1;
// StaticJsonDocument<200> input2;
// StaticJsonDocument<200> input3;
// StaticJsonDocument<200> input4;

// OUTPUTS
StaticJsonDocument<200> output1;

void setupInputOutputs() {
    

    input1["uid"] = "input_led";
    input1["name"] = "LED";
    input1["type"] = "boolean";
    input1["value"] = "false"; 
    input1["description"] = "Pin number is " + String(pinLED);

    output1["uid"] = "output_relay_a";
    output1["name"] = "Temperature";
    output1["type"] = "number";

    sensor_temperature_setup();
    float celcius = sensor_temperature_read();
    SerialUSB.println(celcius);
    output1["value"] = String(celcius); 
    output1["description"] = "Pin number is " + String(pinLED);
  
    // input2["uid"] = "input_relay_b";
    // input2["name"] = "RelayB";
    // input2["type"] = "boolean";
    // input2["value"] = "false"; 
    // input2["description"] = "Pin number is " + String(pin_relayB);

    // input3["uid"] = "input_relay_c";
    // input3["name"] = "RelayC";
    // input3["type"] = "boolean";
    // input3["value"] = "false"; 
    // input3["description"] = "Pin number is " + String(pin_relayC);

    // input4["uid"] = "input_relay_d";
    // input4["name"] = "RelayD";
    // input4["type"] = "boolean";
    // input4["value"] = "false"; 
    // input4["description"] = "Pin number is " + String(pin_relayD);
}

void setup()
{
  Serial.begin(115200);
  delay(1000);
  SerialUSB.println(CONFIG_NAME);
  SerialUSB.println(CONFIG_UUID);
  SerialUSB.println("bootup");

  setupInputOutputs(); 
  client_setup();
  pinMode(pinLED, OUTPUT);
//   pinMode(pin_relayB, OUTPUT);
//   pinMode(pin_relayC, OUTPUT);
//   pinMode(pin_relayD, OUTPUT);
}

void loop()
{
  device_loop();
  mqtt_loop();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


void device_loop()
{
    // bool state_relayA = input1["value"].as<String>() == "true";
    // bool state_relayB = input2["value"].as<String>() == "true";
    digitalWrite(pinLED, input1["value"].as<String>() == "true");
    // digitalWrite(pin_relayB, input2["value"].as<String>() == "true");
    // digitalWrite(pin_relayC, input3["value"].as<String>() == "true");
    // digitalWrite(pin_relayD, input4["value"].as<String>() == "true");

    if (millis() - lastHeartbeat > 3000)
    {
        lastHeartbeat = millis();

        // do stuff
        float celcius = sensor_temperature_read();
        SerialUSB.println(celcius);
        output1["value"] = String(celcius);

        shouldsendstate = true;
    }

    if (shouldsendstate == true) {
        shouldsendstate = false;
        sendState();
    }
}


boolean reconnect()
{
    if (client.connect(uuid))
    {
        sendState();
    }
    else
    {
        client_setup(); // reconnect ethernet
    }
    return client.connected();
}

void client_setup()
{
    //Serial.println(F("nautilus_setup.."));
    client.setBufferSize(1024); // https://pubsubclient.knolleary.net/api#setBufferSize
    byte mac[] = {0x90, 0xA2, 0xDA, 0x0D, 0x75, 0x98};
    Ethernet.begin(mac);
    // auto link = Ethernet.linkStatus();
    // Serial.print(link);
    // MQTT START
    client.setServer(mqttServer, mqttPort);
    client.setCallback(handleMessages);
    lastReconnectAttempt = 0;
}


void mqtt_loop()
{
    if (!client.connected())
    {
        long now = millis();
        if (now - lastReconnectAttempt > 5000)
        {

            SerialUSB.println("MQTT not connected");
            lastReconnectAttempt = now;
            // Attempt to reconnect
            if (reconnect())
            {
                //Serial.println("Connected.");
                lastReconnectAttempt = 0;
            }
        }
    }
    else
    {
        // Client connected
        client.loop();
        // update server
        if (shouldSendUpdate)
        {
            SerialUSB.println("MQTT connected");
            shouldSendUpdate = false;
            sendState();
        }
    }
}


void handleMessages(char *topic, byte *payload, unsigned int length)
{
    DynamicJsonDocument incomingjson(1024);
    DeserializationError error = deserializeJson(incomingjson, payload, length);
    
    if (error)
    {
        SerialUSB.println(error.c_str());
        return;
    }
    
    // serializeJsonPretty(incomingjson, SerialUSB);

    if (incomingjson.containsKey("uid"))
    {
      if (incomingjson["uid"].as<String>() == input1["uid"].as<String>()) {
        input1["value"] = incomingjson["value"].as<String>();
      }

    //   if (incomingjson["uid"].as<String>() == input2["uid"].as<String>()) {
    //     input2["value"] = incomingjson["value"].as<String>();
    //   }

    //   if (incomingjson["uid"].as<String>() == input3["uid"].as<String>()) {
    //     input3["value"] = incomingjson["value"].as<String>();
    //   }
    //   if (incomingjson["uid"].as<String>() == input4["uid"].as<String>()) {
    //     input4["value"] = incomingjson["value"].as<String>();
    //   }
      sendState();
    }

}

void sendState()
{    
    DynamicJsonDocument doc(1024);
    JsonObject root = doc.to<JsonObject>();
    root["uuid"] = uuid;
    root["name"] = name;
    root["type"] = type;
    root["description"] = CONFIG_DESCRIPTION;

    JsonArray inputs = root.createNestedArray("inputs");
    inputs.add(input1);
    // inputs.add(input2);
    // inputs.add(input3);
    // inputs.add(input4);
    
    JsonArray outputs = root.createNestedArray("outputs");
    outputs.add(output1);

    char textbuffer[1024];
    size_t length = serializeJson(doc, textbuffer);
    SerialUSB.println(textbuffer);

    // serializeJsonPretty(doc, SerialUSB);


    client.publish("mqtt", textbuffer, length);
}
