namespace SensorAgent {
	export interface IStreamedProps {
		property: string
		propertyType: "geoLocation" | "properties"
		value: string
		timestamp: number
	}
}