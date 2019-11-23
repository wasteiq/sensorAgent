import {Observable, fromEvent} from 'rxjs'
import {filter, scan, map} from 'rxjs/operators'
import {getDistance} from 'geolib'
import {Some} from 'monet'

export interface ITPV {
	time?: string // Iso UTC timestamp
	lat?: number
	lon?: number
}

const minMovement = parseFloat(process.env["MIN_MOVEMENT"] || "1")

interface IEmitter {
	addListener(event: "TPV", h: (e: ITPV) => void): void
	removeListener(event: "TPV", h: (e: ITPV) => void): void
}

export const connectEvents = (emitter: IEmitter): Observable<ITPV> =>
	fromEvent(emitter, "TPV")

interface IProcessedTPV {
	timestamp: number
	latitude: number
	longitude: number
}

export const gpsdLoop = (stream$: Observable<ITPV>) =>
	stream$.pipe(
		filter(x => typeof x.lon === "number"),
		map(({time, lat, lon}) => ({
			timestamp: Date.parse(time),
			latitude: lat,
			longitude: lon, 
		})),
		scan((x, y) =>
			Some(x.isChange === "INIT" || (getDistance(x.cur, y, 0.1) > minMovement)).
				map(isChange => isChange ? {cur: y, isChange: true} : {cur: x.cur, isChange: false}).
				some(),
			<{cur?: IProcessedTPV, isChange: true | false | "INIT"}>{isChange: "INIT"}),
		filter(({isChange}) => isChange ? true : false),
		map(({cur}) => cur)
	)