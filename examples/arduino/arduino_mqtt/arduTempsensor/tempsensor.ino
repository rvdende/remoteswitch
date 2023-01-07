// https://learn.adafruit.com/using-ds18b20-temperature-sensor-with-circuitpython/hardware
#include <DallasTemperature.h>
#include <OneWire.h>
#define ONE_WIRE_BUS 5

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

const int NUM_READINGS = 10;  // Number of readings to average
float readings[NUM_READINGS];  // Array to store readings
int readIndex = 0;  // Index of the current reading
int numReadingsTaken = 0;  // Number of readings taken so far

void sensor_temperature_setup() {
  sensors.begin();
}

float sensor_temperature_read() {
    float tempC = smoothReading();
    return tempC;
}

float smoothReading() {
    // Request a temperature reading
    sensors.requestTemperatures();

    // Get the temperature from the sensor
    float temperature = sensors.getTempCByIndex(0);

    // Add the reading to the array and increment the index
    readings[readIndex] = temperature;
    readIndex = (readIndex + 1) % NUM_READINGS;
    numReadingsTaken++;

    // Calculate the average of the readings
    float sum = 0;
    int numReadingsToAverage = min(numReadingsTaken, NUM_READINGS);
    for (int i = 0; i < numReadingsToAverage; i++) {
        sum += readings[i];
    }
    float average = sum / numReadingsToAverage;
   
    return average;
}


