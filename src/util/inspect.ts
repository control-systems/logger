/**
 * Checks if the given argument is a simple JavaScript object.
 * @param {any} obj - The object to test.
 * @returns {boolean} `true` if the argument is a plain object, otherwise `false`.
 */
export function isPlainObject(obj: any): boolean {
	return Object.prototype.toString.call(obj) === "[object Object]";
}

export function deepMerge(target: any, source: any): any {
	if (isPlainObject(target) && isPlainObject(source)) {
		for (const key in source) {
			if (isPlainObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				deepMerge(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}
	return target;
}
