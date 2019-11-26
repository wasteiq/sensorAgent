
/** Use in web when browser is not sure to support Object.entries */
export const toPairs = <T>(o: {[index: string]: T}) => typeof Object["entries"] === "function" ?
	Object["entries"](o) :
	Object.keys(o).map(k => [k, o[k]] as const)

/** Build object from tuples, like in lodash.  Could also support numbers and indices, but typing this is hard since the index
 * type must be either string or number, not an union. https://stackoverflow.com/a/49285826/2684980 */
export const fromPairs = <T>(arr: {reduce: (a: (x, y: readonly [string, T]) => {[index: string]: T}, b) => {[index: string]: T}}): {[index: string]: T} => arr.reduce((acc, val) => (acc[val[0]] = val[1], acc), {})
export const fromKeyValue = <T>(arr: {map: (a: (x: {key: string, value: T}) => readonly [string, T]) => (Iterable<readonly [string, T]>) | [string, T][]}) => fromPairs([...arr.map(x => [x.key, x.value])])

export const omit = <T, Y extends keyof T>(item: T, elms: Y[]): Omit<T, Y> => elms.reduce((x, y) => (({[y]: _d, ...rest}) => rest)(x), item) // <Omit<T, Y>>fromPairs(toPairs(item).filter(([key]) => elms.indexOf(<Y>key) === -1))

export const pick = <T extends object, U extends keyof T>(item: T, paths: Array<U>): Pick<T, U> => paths.filter(p => p in item).reduce((x, y) => ({...x, [y]: item[y]}), {}) as Pick<T, U>

/** Handles simple, non-circular/recursive objects. */
export const deepClone = <T extends Object>(item: T) => JSON.parse(JSON.stringify(item)) // Or, could use a recursive fromPairs/toPairs thing