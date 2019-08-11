/**
 * @author empty916
 * @email [empty916@qq.com]
 * @create date 2019-08-09 17:13:03
 * @modify date 2019-08-09 17:13:03
 * @desc [description]
 */
import React from 'react';
declare type TReactComponent<P, C> = React.FC<P> | React.ComponentClass<P, C>;
declare const Inject: {
    (...moduleNames: (string | number)[]): <P, C>(WrappedComponent: TReactComponent<P, C>, LoadingComponent?: React.FunctionComponent<{}> | React.ComponentClass<{}, {}> | undefined) => TReactComponent<P, C>;
    setLoadingComponent(LoadingComponent: TReactComponent<{}, {}>): TReactComponent<{}, {}>;
};
export default Inject;
