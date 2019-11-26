import { connectEvents as connectGpsEvents, gpsdToStreamedProps, gpsdLoop } from "./gpsdLoop"
import { connectEvents as connectArduinoEvents, arduinoToStreamedEvents } from "./arduinoReader"
import { Observable, Subject } from "rxjs";
import { merge } from "rxjs/operators";
import { sendStreamedProperty } from "./sendStreamedProperty";
const gpsd = require('node-gpsd')

// Create a loop that listens for gpsd events, filters using a scan and then converts these to WIQ-push events
// Create a loop that listens for serial events, and does the same, pushing as fill-level.
// Create a subscriber that takes these events, and pushes them to WIQ graphql using a signed token

// const gpsdSource = 

const getStartedWithGpsd = async () => {
	var listener = new gpsd.Listener({
		port: 2947,
		hostname: 'localhost',
		logger:  {
			info: function() {},
			warn: console.warn,
			error: console.error
		},
		parse: true
	});

	return await new Promise<Observable<SensorAgent.IStreamedProps>>(acc => {
		listener.connect(() => {
			console.log("Connected to gpsd")
			listener.watch()
			const gpsEvents$ = connectGpsEvents(listener)
			const events$ = gpsdLoop(gpsEvents$)
			acc(gpsdToStreamedProps(events$))
		})
	})
}

const getStartedWithArduino = () => {
	const ard$ = connectArduinoEvents()
	return arduinoToStreamedEvents(ard$)
}

export const main = async (args) => {
	const stream$ = await (args[2] === "--mock" ? async () => {
		const subject$ = new Subject<SensorAgent.IStreamedProps>()
		setTimeout(() => subject$.next({
			property: "mock",
			propertyType: "properties",
			timestamp: +new Date(),
			value: Math.round(Math.random() * 100).toString(),
		}), 1)
		return subject$
	} : async () => {
		const gpsd$ = await getStartedWithGpsd()
		const ard$ = getStartedWithArduino()

		return gpsd$.pipe(
			merge(ard$)
		)
	})()

	stream$.subscribe(e => {
		console.log(e)
		sendStreamedProperty(e)
	})
}

export default main