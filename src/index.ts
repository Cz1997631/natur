/**
 * @author empty916
 * @email [empty916@qq.com]
 * @create date 2019-08-09 17:12:57
 * @modify date 2019-08-09 17:12:57
 * @desc [description]
 */
import MapCache from "./MapCache";
// 用于创建一个容器或注入器
export { default as createInject } from "./inject";
export { createUseInject } from "./useInject";
// 用于创建状态管理器  函数接收一个 reducer 函数作为参数，并返回一个具有状态管理功能的对象，也称为 store。
export { default as createStore } from "./createStore";
export { createUseStore } from './useStore'
export { NaturBaseFactory } from './NaturBaseFactory'
export { NaturContext, Provider, ProviderProps } from './context'
export {
	ModuleEvent,
	AllModuleEvent,
	Listener,
	AllListener,
    ListenerAPI,
	WatchAPI,
	AllWatchAPI,
	WatchEvent,
	AllWatchEvent,
	State,
	States,
	Action,
	Actions,
	StoreMap,
	Maps,
	InjectMaps,
	StoreModule,
	InjectStoreModule,
	InjectStoreModules,
	LazyStoreModules,
	Modules,
	GlobalResetStatesOption,
	ModuleName,
	MiddlewareActionRecordAPI as MiddlewareActionRecord,
	MiddlewareNextAPI as MiddlewareNext,
	MiddlewareParamsAPI as MiddlewareParams,
	Middleware,
	InterceptorActionRecordAPI as InterceptorActionRecord,
	InterceptorNextAPI as InterceptorNext,
	InterceptorParamsAPI as InterceptorParams,
	Interceptor as Interceptor,
	Store,
	ModuleType,
	GenMapsType,
	GenActionsType,
	GenerateStoreType,
} from './ts';
export { ThunkParams } from "./middlewares";
export const setMapDepParser = MapCache.setMapDepParser;
export const resetMapDepParser = MapCache.resetMapDepParser;
