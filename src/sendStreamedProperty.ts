import {serverSideApiRequest, serviceUrls} from './utils/serverSideApiRequest'
import { Maybe } from 'monet'

const id = Maybe.fromFalsy(process.env.WIQ_ACCESS_POINT_ID)

export const sendStreamedProperty = (prop: SensorAgent.IStreamedProps) =>
	id.catchMap(() => {throw new Error("No WIQ access point id provided (WIQ_ACCESS_POINT_ID)")}).
		map(accessPointId =>
	serverSideApiRequest(serviceUrls.vendorStatusApiUrl, {id: accessPointId}, 'sensor-agent', `
	mutation($id: String!) {
		setAccessPointValues(input: {
			wait: true,
			payload: {
				accessPoint: {id: $id},
				timestamp: ${prop.timestamp},
				${prop.propertyType}Update: {
					mode: MERGE,
					props: [{
						key: "${prop.property}"
						value: "${prop.value}"
					}]
				}
			}
		}) {
		  nothingHere
		}
	}`)).some()