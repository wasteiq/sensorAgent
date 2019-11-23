import * as Chai from 'chai'
import { EventEmitter } from 'events'
import { connectEvents, ITPV, gpsdLoop } from '../src/gpsdLoop'
import { Subject } from 'rxjs'

Chai.should()

describe("gpsdLoop", () => {
	it("should filter and deal with events", async () => {
		/* This is no good for tests, sequence would never complete:
		const emitter = new EventEmitter()
		const subject = connectEvents(emitter) */

		const subject$ = new Subject<ITPV>()
		const result$ = gpsdLoop(subject$)

		let resArray = []
		
		const done = result$.forEach(x => resArray.push(x))
		subject$.next({}),
		subject$.next({lat: 60.42699, lon: 5.29377, time: "2019-01-01T00:00:00.000Z"}),
		subject$.next({lat: 60.426991, lon: 5.293771, time: "2019-01-01T00:00:01.000Z"}),
		subject$.next({lat: 60.42698, lon: 5.29376, time: "2019-01-01T00:00:02.000Z"}),

		subject$.complete()

		await done
		resArray.should.deep.equal([{
			timestamp: 1546300800000,
			latitude: 60.42699,
			longitude: 5.29377,
		}, {
			timestamp: 1546300802000,
			latitude: 60.42698,
			longitude: 5.29376,
		}])
	})
})