import { EventEmitter } from "events";
import { Observable, fromEvent } from "rxjs";
import { map } from "rxjs/operators";

import SerialPort = require('serialport');
import Readline = require('@serialport/parser-readline');

const serialPort = new SerialPort(process.env.ARD_SERIAL_PORT || '/dev/ttyACM0', {
	baudRate: 9600,
});

const piped = serialPort.pipe(new Readline({ delimiter: "\n" }));

export const arduinoEvents = new EventEmitter()

type IArduinoReading = {distance: number, unit: "cm"}
type IArduinoData = IArduinoReading | {error: string};

piped.on('data', (data: string) => {
	try {
		const parsed: IArduinoData = JSON.parse(data)
		if ("distance" in parsed) {
			arduinoEvents.emit("distance", parsed)
		} else {
			console.warn("Got issue from arduino", parsed.error)
		}
	} catch (e) {
		console.error("Failed to parse arduino data")
	}
});

export const connectEvents = (): Observable<IArduinoReading> =>
	fromEvent(arduinoEvents, "distance")

export const arduinoToStreamedEvents = (ardStream$: Observable<IArduinoReading>) =>
	ardStream$.pipe(
		map(reading => <SensorAgent.IStreamedProps>({
			property: "fillLevel",
			propertyType: "properties",
			value: Math.min(Math.max(0, 110 - reading.distance * 2), 100).toString(),
			timestamp: +new Date(),
		}))
	)