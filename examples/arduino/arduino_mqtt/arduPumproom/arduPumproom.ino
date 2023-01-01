#include <ArduinoJson.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <Arduino.h>

#define CONFIG_SERVER "192.168.1.192"
// #define CONFIG_SERVER "remoteswitch.net"
#define CONFIG_MQTTPORT 1883
#define CONFIG_UUID "fgh4738fhdasfnsdifh8frh342f"
// TODO - make this a config option eeprom
#define CONFIG_NAME "Arduino Relay Controller"
#define CONFIG_TYPE "Arduino MQTT Ethernet Relay Controller"

EthernetClient ethClient;
PubSubClient client(ethClient);

const byte pin_relayA = 13;
const byte pin_relayB = 7;
volatile bool state_relayA = false;
volatile bool state_relayB = false;
volatile bool control_relayA = false;
volatile bool control_relayB = false;
long lastHeartbeat = 0;
volatile bool shouldsendstate = true;

// DEVICE
const char *name = CONFIG_NAME;
const char *uuid = CONFIG_UUID;
const char *type = CONFIG_TYPE;
// CONNECTION
const char *mqttServer = CONFIG_SERVER;
const int mqttPort = CONFIG_MQTTPORT;

// make random for each device!

// INTERNAL STATE
volatile bool shouldSendUpdate = false;
long lastReconnectAttempt = 0;

// INPUTS

/// INPUT 1
 StaticJsonDocument<200> input1;

// OUTPUTS

void updateInputOutputs() {
    input1["uid"] = "input_relay_a";
    input1["name"] = "RelayA";
    input1["type"] = "boolean";
    input1["value"] = state_relayA ? "true" : "false";
    input1["description"] = "Desc";
}

void setup()
{
  updateInputOutputs();
  delay(1500);
  Serial.begin(115200);
  delay(1500);
  SerialUSB.println(CONFIG_NAME);
  SerialUSB.println(CONFIG_UUID);
  SerialUSB.println("bootup");
  
  nautilus_setup();
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
    //Serial.println(F("Connecting to MQTT..."));
    // char mqttPassword[64];
    // const char *first = "key-";
    // strcpy(mqttPassword, first);
    // strcat(mqttPassword, apikey);

    if (client.connect(uuid))
    {
        sendState();
        // subscribe();
        //Serial.println("C1");
    }
    else
    {
        //Serial.print("C0");
        //Serial.print(client.state());
        nautilus_setup(); // reconnect ethernet
    }
    return client.connected();
}

void nautilus_setup()
{
    //Serial.println(F("nautilus_setup.."));
    client.setBufferSize(1024); // https://pubsubclient.knolleary.net/api#setBufferSize
    byte mac[] = {0x90, 0xA2, 0xDA, 0x0D, 0x75, 0x96};
    Ethernet.begin(mac);
    // auto link = Ethernet.linkStatus();
    // Serial.print(link);
    // MQTT START
    client.setServer(mqttServer, mqttPort);
    client.setCallback(handleMessages);
    lastReconnectAttempt = 0;
}


// void subscribe()
// {
//     //Serial.println(F("Subscribing.."));
//     DynamicJsonDocument doc(96);
//     JsonObject root = doc.to<JsonObject>();
//     root["apikey"] = apikey;
//     root["id"] = id; // remove to subscribe to all devices
//     char output[96];
//     serializeJson(doc, output);
//     client.subscribe(output);
// }

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

    // int winddir = analogRead(A1);
    // winddirection = winddir;
    //// Serial.print("winddir");
    //// Serial.println(winddirection);
    // delay(1000);
}

// MQTT

// MQTT
void handleMessages(char *topic, byte *payload, unsigned int length)
{
    DynamicJsonDocument incomingjson(1024);
    DeserializationError error = deserializeJson(incomingjson, payload, length);
    
    if (error)
    {
        SerialUSB.println(error.c_str());
        return;
    }
    
    serializeJsonPretty(incomingjson, SerialUSB);

    if (incomingjson.containsKey("uid"))
    {
        SerialUSB.println("UID parsing..");
        String uid = incomingjson["uid"].as<String>();
        String uid1 = input1["uid"].as<String>();        
        SerialUSB.println(uid);
        SerialUSB.println(uid1);
        if (uid == uid1) 
        {
            SerialUSB.println("Found matching UID");
            String value = incomingjson["value"].as<String>();
            if (value == "true")
            {
                state_relayA = true;
            }
            else
            {
                state_relayA = false;
            }
        }
        
        updateInputOutputs();
        sendState();
    }

    // if (incomingjson.containsKey("data"))
    // {
    //     JsonObject data = incomingjson["data"];
    //     if (data.containsKey("control_relayA"))
    //     {
    //         state_relayA = !state_relayA;
    //         shouldSendUpdate = true;
    //     }
    //     if (data.containsKey("control_relayB"))
    //     {
    //         state_relayB = !state_relayB;
    //         shouldSendUpdate = true;
    //     }
    // }
    /*
    for (int i = 0; i < length; i++)
    {
        Serial.print((char)payload[i]);
        inData[i] = (char)payload[i];
    }
    Serial.println();
    // parse json
    String inSerialString = inData;
    
    StaticJsonDocument<200> requestDoc;
    DeserializationError error = deserializeJson(requestDoc, inData);
    JsonObject request = requestDoc.as<JsonObject>();

    // Test if parsing succeeds.
    if (error)
    {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.c_str());
        return;
    }

    // PROCESS INCOMING CONTROL COMMANDS
    if (request.containsKey("data"))
    {
        JsonObject data = request["data"];
        if (data.containsKey("relay_control"))
        {
            //relay_state = !relay_state;
            shouldSendUpdate = true;
        }
    }*/
}

//////////////
// SEND STATE

// void sendState()
// {
//     shouldsendstate = false;
//     JsonObject root = doc.to<JsonObject>();
//     root["id"] = id;
//     // root["type"] = type;
//     JsonObject data = root.createNestedObject("data");
//     // data["test"] = "test";
//     data["wind_deg"] = wind_deg;
//     data["wind_ms"] = wind_ms;
//     data["rain_mm"] = rain_mm;
//     // data["rainamount"] = rainamount;
//     char textbuffer[96];
//     size_t length = serializeJson(doc, textbuffer);
//     Serial.println(textbuffer);
//     client.publish(apikey, textbuffer, length);
// }


void sendState()
{    
    DynamicJsonDocument doc(512);
    JsonObject root = doc.to<JsonObject>();
    root["uuid"] = uuid;
    root["name"] = name;
    root["type"] = type;

    JsonArray inputs = root.createNestedArray("inputs");

    // INPUT 1
    // StaticJsonDocument<200> input1;
    // input1["uid"] = input1_uid;
    // input1["name"] = "RelayA";
    // input1["type"] = "boolean";
    // input1["value"] = state_relayA ? "true" : "false";
    // input1["description"] = "Desc";

    inputs.add(input1);
   
    
    JsonArray outputs = root.createNestedArray("outputs");
    
    //JsonObject data = root.createNestedObject("data");
    // data["test"] = "test";
    //data["state_relayA"] = state_relayA;
    //data["state_relayB"] = state_relayB;
    // data["rainamount"] = rainamount;
    char textbuffer[512];
    size_t length = serializeJson(doc, textbuffer);
    SerialUSB.println(textbuffer);

    // serializeJsonPretty(doc, SerialUSB);


    client.publish("mqtt", textbuffer, length);
}
