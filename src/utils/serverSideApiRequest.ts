import Axios from 'axios'
import { signJwt } from "../security/jwt"

const defaultServices = {signJwt}

export const serviceUrls = {
	// ENV, VENDOR_STATUS_API_URL: URL to vendor status / streaming api, including path (default: http://localhost:3444/vendorStatusGraphQL)
	vendorStatusApiUrl: process.env["VENDOR_STATUS_API_URL"] || "http://localhost:3444/vendorStatusGraphQL",
}

interface IErrors {
	errors?: { message: string }[]
}
interface IDataWrapper<T> {
	data: {data: T} & IErrors
}

/** Making a request from service to another, signing a token and posting the graphQL */
export const serverSideApiRequest = <T>(url: string, variables: {[index: string]: any}, userId: string, query: string, services = defaultServices) =>
	services.signJwt("N/A", userId).
		then((token): Promise<IDataWrapper<T>> =>
			Axios.post(url, {
				query,
				token,
				variables,
			})
		)