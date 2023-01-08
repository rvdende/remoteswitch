// https://learn.adafruit.com/using-ds18b20-temperature-sensor-with-circuitpython/hardware
#include "config.h"
#include <DallasTemperature.h>
#include <OneWire.h>
#define ONE_WIRE_BUS 5

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

float _sensor_temperature_reading_celcius = 0;

int sensor_temperature_getpin()
{
    return ONE_WIRE_BUS;
}

void sensor_temperature_setup()
{
    sensors.begin();
}

float sensor_temperature_read()
{
    sensors.requestTemperatures();
    _sensor_temperature_reading_celcius = sensors.getTempCByIndex(0);
    // SerialUse.println("Temperature: ");
    // SerialUse.println(_sensor_temperature_reading_celcius);
    return _sensor_temperature_reading_celcius;
}
