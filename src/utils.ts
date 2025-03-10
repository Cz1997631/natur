/**
 * @author empty916
 * @email [empty916@qq.com]
 * @create date 2019-08-09 17:13:15
 * @modify date 2019-08-09 17:13:15
 * @desc [description]
 */

import { isMemo } from "react-is";
import { State, StoreModule } from "./ts";

const hasOwn = Object.prototype.hasOwnProperty;
// export const ObjHasSameKeys = (obj1: Object, obj2: Object) => {
// 	if (!obj1 || !obj2) {
// 		return false;
// 	}
// 	if (Object.keys(obj1).length !== Object.keys(obj2).length) {
// 		return false;
// 	}
// 	for(let key in obj1) {
// 		if (hasOwn.call(obj1, key)) {
// 			if (!hasOwn.call(obj2, key)) {
// 				return false;
// 			}
// 		}
// 	}
// 	return true;
// }

type Obj = { [p: string]: any };
type anyFn = (...arg: any[]) => any;
type fnObj = { [p: string]: anyFn };
type mapsObj = { [p: string]: Array<any> | Function };

// 泛型 T 为对象类型 { [p: string]: any } 接收一个obj: any，返回值为obj 推断是否为T类型  返回值为boolean
export const isObj = <T = Obj>(obj: any): obj is T =>
	// 推断obj是否为对象类型并且不为null并且构造函数为{ [p: string]: any }
	typeof obj === "object" && obj !== null && obj.constructor === Object;

export const isFn = (arg: any): arg is anyFn => typeof arg === "function";
export const isFnObj = (obj: any): obj is fnObj => {
	if (isObj(obj)) {
		return Object.keys(obj).every((key) => isFn(obj[key]));
	}
	return false;
};
const isMapsObj = (obj: any): obj is mapsObj => {
	if (isObj(obj)) {
		return Object.keys(obj).every(
			(key) =>
				obj[key].constructor === Array ||
				obj[key].constructor === Function
		);
	}
	return false;
};

export const isPromise = <T>(obj: any): obj is Promise<T> =>
	obj && typeof obj.then === "function";
// export const isVoid = <T>(ar: T | void): ar is void => !ar;
export const isStoreModule = (obj: any): obj is StoreModule => {
	if (!isObj(obj) || !isFnObj(obj.actions)) {
		return false;
	}
	if (!!obj.maps && !isMapsObj(obj.maps)) {
		return false;
	}
	if (!!obj.watch && (!isFn(obj.watch) && !isFnObj(obj.watch))) {
		return false;
	}
	return true;
};

export const isDefaultStoreModule = (obj: any): obj is {default: StoreModule} => {
	if (obj?.default) {
		return isStoreModule(obj.default);
	}
	return false;
};
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
export function compose<A extends any[], R extends any>(
	...funcs: anyFn[]
): (...arg: A) => R {
	if (funcs.length === 0) {
		return ((arg: any) => arg) as any;
	}

	if (funcs.length === 1) {
		return funcs[0];
	}

	return funcs.reduce(
		(a, b) =>
			(...args) =>
				a(b(...args))
	);
}

function is(x: any, y: any) {
	// if (x === y) {
	// 	return x !== 0 || y !== 0 || 1 / x === 1 / y;
	// } else {
	// 	return x !== x && y !== y;
	// }
	return x === y;
}

export function isEqualWithDepthLimit(
	objA: any,
	objB: any,
	depthLimit: number = 3,
	depth: number = 1
): boolean {
	if (is(objA, objB)) return true;

	if (
		typeof objA !== "object" ||
		objA === null ||
		typeof objB !== "object" ||
		objB === null
	) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) return false;

	for (let i = 0; i < keysA.length; i++) {
		if (!hasOwn.call(objB, keysA[i])) {
			return false;
		}
		if (is(objA[keysA[i]], objB[keysB[i]])) {
			continue;
		}
		if (depth < depthLimit) {
			return isEqualWithDepthLimit(
				objA[keysA[i]],
				objB[keysB[i]],
				depthLimit,
				depth + 1
			);
		}
		if (depth === depthLimit && !is(objA[keysA[i]], objB[keysB[i]])) {
			return false
		}

	}
	return true;
}

/**
 * @param obj State
 * @param keyPath 'a.b[0].c'
 */
// 接收一个obj:State:any和一个keyPath:string 返回值为any
export function getValueFromObjByKeyPath(obj: State, keyPath: string): any {
	// 将keyPath中的[]替换为.并且去掉.返回一个数组
	const formatKeyArr = keyPath
		.replace(/\[/g, ".")
		.replace(/\]/g, "")
		.split(".");
	let value = obj;
	// 循环formatKeyArr数组
	for (let i = 0; i < formatKeyArr.length; i++) {
		// 如果value[formatKeyArr[i]]为undefined则返回undefined 否则将value[formatKeyArr[i]]赋值给value
		try {
			value = value[formatKeyArr[i]];
		} catch (error) {
			return undefined;
		}
	}
	// 返回value
	return value;
}

// 接收两个数组类型的参数 arr1和arr2 返回值为boolean
export function arrayIsEqual(arr1: Array<any>, arr2: Array<any>) {
	// 如果arr1和arr2的长度不相等则返回false
	if (arr1.length !== arr2.length) {
		return false;
	}
	for (let i = 0; i < arr1.length; i++) {
		// 如果arr1[i]和arr2[i]不相等则返回false
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}
	return true;
}

export function supportRef(nodeOrComponent: any): boolean {
	const type = isMemo(nodeOrComponent)
		? nodeOrComponent.type.type
		: nodeOrComponent.type;

	// Function component node
	if (typeof type === "function" && !type.prototype?.render) {
		return false;
	}

	// Class component
	if (
		typeof nodeOrComponent === "function" &&
		!nodeOrComponent.prototype?.render
	) {
		return false;
	}

	return true;
}
