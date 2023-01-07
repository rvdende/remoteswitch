// https://learn.adafruit.com/using-ds18b20-temperature-sensor-with-circuitpython/hardware
#include <DallasTemperature.h>
#include <OneWire.h>
#define ONE_WIRE_BUS 5

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void sensor_temperature_setup() {
  sensors.begin();
}

float sensor_temperature_read() {
    sensors.requestTemperatures();
    return sensors.getTempCByIndex(0);
}



