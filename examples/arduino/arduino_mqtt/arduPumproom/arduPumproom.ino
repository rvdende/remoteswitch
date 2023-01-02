#include "config.h" // EDIT YOUR UUID KEY. Copy config.example.h.
#include <ArduinoJson.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <Arduino.h>

// #define CONFIG_SERVER "192.168.1.192"
#define CONFIG_SERVER "remoteswitch.net"
#define CONFIG_MQTTPORT 1883
// TODO - make this a config option eeprom
#define CONFIG_NAME "Arduino Relay Controller"
#define CONFIG_TYPE "Arduino MQTT Ethernet Relay Controller"
#define CONFIG_DESCRIPTION "Rouan pool pump controller prototype"

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

const byte pin_relayA = 13;
const byte pin_relayB = 7;

/// INPUT 1
StaticJsonDocument<200> input1;
StaticJsonDocument<200> input2;
// OUTPUTS

void setupInputOutputs() {
    input1["uid"] = "input_relay_a";
    input1["name"] = "RelayA";
    input1["type"] = "boolean";
    input1["value"] = "false"; // state_relayA ? "true" : "false";
    input1["description"] = "Pin number is " + String(pin_relayA);
  
    input2["uid"] = "input_relay_b";
    input2["name"] = "RelayB";
    input2["type"] = "boolean";
    input2["value"] = "false"; // state_relayB ? "true" : "false";
    input2["description"] = "Pin number is " + String(pin_relayB);
}

void setup()
{
  setupInputOutputs();
  delay(1500);
  Serial.begin(115200);
  delay(1500);
  SerialUSB.println(CONFIG_NAME);
  SerialUSB.println(CONFIG_UUID);
  SerialUSB.println("bootup");
  
  client_setup();
  pinMode(pin_relayA, OUTPUT);
  pinMode(pin_relayB, OUTPUT);
}

void loop()
{
  device_loop();
  mqtt_loop();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


void device_loop()
{
    bool state_relayA = input1["value"].as<String>() == "true";
    bool state_relayB = input2["value"].as<String>() == "true";
    digitalWrite(pin_relayA, state_relayA);
    digitalWrite(pin_relayB, state_relayB);

    if (millis() - lastHeartbeat > 3000)
    {
        lastHeartbeat = millis();
        // do stuff
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
    byte mac[] = {0x90, 0xA2, 0xDA, 0x0D, 0x75, 0x97};
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

      if (incomingjson["uid"].as<String>() == input2["uid"].as<String>()) {
        input2["value"] = incomingjson["value"].as<String>();
      }

      sendState();
    }

}

void sendState()
{    
    DynamicJsonDocument doc(512);
    JsonObject root = doc.to<JsonObject>();
    root["uuid"] = uuid;
    root["name"] = name;
    root["type"] = type;
    root["description"] = CONFIG_DESCRIPTION;

    JsonArray inputs = root.createNestedArray("inputs");
    inputs.add(input1);
    inputs.add(input2);
    
    JsonArray outputs = root.createNestedArray("outputs");
    

    char textbuffer[512];
    size_t length = serializeJson(doc, textbuffer);
    SerialUSB.println(textbuffer);

    // serializeJsonPretty(doc, SerialUSB);


    client.publish("mqtt", textbuffer, length);
}
