// 引入状态管理器
import { State } from './ts'
// 引入工具函数
import { getValueFromObjByKeyPath, arrayIsEqual } from './utils'

// 定义一个函数类型MapDepParser 接收两个参数s:State:any和p:any 返回值为any
type MapDepParser = (s: State, p: any) => any;

// 定义一个类MapCache
export default class MapCache {

	// 定义一个私有属性map 接收一个函数类型的参数 返回值为any
	private map: Function;
	private mapDepends: Array<Function> = [];
	private depCache: Array<any> = [];
	private getState: () => State;
	private shouldCheckDependsCache: boolean = true;
	private value: any;

	// 定义一个静态属性getValueFromState 接收一个函数类型的参数 返回值为MapDepParser 默认值为getValueFromObjByKeyPath 静态属性可以通过类名直接调用
	static getValueFromState: MapDepParser = getValueFromObjByKeyPath;

	// 定义一个构造器 接收两个参数getState:() => State:any和map:Array<string | Function> 返回值为void
	constructor(
		getState: () => State,
		map: Array<string | Function>,
	) {
		// 将getState赋值给私有属性getState
		this.getState = getState;
		const copyMap = map.slice();
		// 将copyMap的最后一个元素赋值给私有属性map，并且将数据类型强制转化为函数类型
		this.map = copyMap.pop() as Function;
		// 将copyMap的每一项都赋值给私有属性mapDepends
		this.mapDepends = copyMap.map(item => this.createGetDepByKeyPath(item));
	}
	static resetMapDepParser() {
		MapCache.getValueFromState = getValueFromObjByKeyPath;
	}
	static setMapDepParser(parser: MapDepParser) {
		MapCache.getValueFromState = parser;
	}
	createGetDepByKeyPath(keyPath: string | Function) {
		if (typeof keyPath !== 'function') {
			// 如果keyPath的数据类型不是函数类型则返回一个函数
			return (s: State) => {
				return MapCache.getValueFromState(s, keyPath);
			};
		}
		return keyPath;
	}
	shouldCheckCache() {
		this.shouldCheckDependsCache = true;
	}
	getDepsValue() {
		// 将mapDepends的每一项都执行一遍并且将getState()的返回值作为参数传入
		return this.mapDepends.map(dep => dep(this.getState()));
	}
	hasDepChanged() {
		if (this.shouldCheckDependsCache) {
			const newDepCache = this.getDepsValue();
			// 如果depCache和newDepCache不相等则返回true
			let depHasChanged = !arrayIsEqual(this.depCache, newDepCache);
			if (depHasChanged) {
				this.depCache = newDepCache;
			}
			this.shouldCheckDependsCache = false;
			return depHasChanged;
		}
		return false;
	}
	getValue() {
		if (this.hasDepChanged()) {
			this.value = this.map(...this.depCache);
		}
		return this.value;
	}

	destroy() {
		this.map = () => { };
		this.mapDepends = [];
		this.depCache = [];
		this.getState = () => ({});
	}
}
