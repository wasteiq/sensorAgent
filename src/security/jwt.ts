import memoize = require('lodash.memoize')
import * as jwt from 'jsonwebtoken'
import * as fs from 'mz/fs';
import * as path from 'path'
import { pick } from '../utils/objects';

// In WIQ - a public key with the name `sensor-agent.key.pub` must be installed in `keys` folder (using docker)
const audience = 'sensor-agent'

const timestampify = (unix) => Math.round(unix / 1000)

interface IKeyDataAlg {
	algorithm
}

interface IKeyData extends Partial<IKeyDataAlg> {
	key
}

const getKeyAndOptions = memoize(async (): Promise<IKeyData> => {
	try {
		const key = await fs.readFile(path.join(__dirname, "../../../keys/jwtPrivate.key"))
		return {
			key,
			algorithm: "RS256",
		}
	} catch {
		// ENV, JWT_SUPPRESS_MAIN_KEY_SIGN_WARNING - don't show an error when signing with the main key, if set to "true"
		const suppressSignWarning = (process.env.JWT_SUPPRESS_MAIN_KEY_SIGN_WARNING || "false") === "true"
		if (!suppressSignWarning) {
			throw new Error(`Signing JWT with main secret, not supported`)
		}
	}
})

const algOption: (keyof IKeyData)[] = ["algorithm"]

export const signJwt = async (userName: string, id: string, expired = false) => {
	const keyData = await getKeyAndOptions()
	return <string><any>jwt.sign(<object>{
		sub: id,
		...(expired ? {iat: timestampify(+new Date() - 10000), exp: timestampify(+new Date())} : null)
	}, keyData.key, {audience, ...<IKeyDataAlg>(pick(keyData, algOption))})
}

