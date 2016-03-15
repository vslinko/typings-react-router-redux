/// <reference path="typings/main.d.ts" />

import {History, Location, LocationDescriptor} from "history";
import {IMiddleware, IStore, IAction, IReducer} from "redux";

declare module reactRouterRedux {
    /**
     * An action type that you can listen for in your reducers to be notified of route updates. Fires after any changes to history.
     */
    export const LOCATION_CHANGE: string;

    /**
     * Router action
     */
    export interface RouterAction extends IAction {
        /**
         * New location
         */
        payload: Location;
    }

    /**
     * Redux router internal state. Useful if you're overriding own reducer
     */
    export interface IRouterState {
        locationBeforeTransitions: Location;
    }

    /**
     * History syncing options
     */
    interface ISyncHistoryOptions<TState> {
        /**
         * When false, the URL will not be kept in sync during time travel.
         * This is useful when using persistState from Redux DevTools and not wanting to maintain the URL state when restoring state.
         * @default true
         */
        adjustUrlOnReplay?: boolean;
        /**
         * A selector function to obtain the history state from your store.
         * Useful when not using the provided routerReducer to store history state. Allows you to use wrappers, such as Immutable.js.
         * @default state => state.routing
         */
        selectLocationState?: (state: TState) => IRouterState;
    }

    /**
     * @export
     * @template TState
     * @param {History} history History singleton from react-router
     * @param {IStore<TState>} store Application store
     * @param {ISyncHistoryOptions<TState>} options Syncing options
     */
    export function syncHistoryWithStore<TState>(history: History, store: IStore<TState>, options?: ISyncHistoryOptions<TState>): History;

	/**
	 * A reducer function that keeps track of the router state. You must add this reducer to your app reducers when creating the store.
	 * It will return a location property in state. If you use combineReducers, it will be nested under wherever property you add it to (state.routing in the example above).
	 * Warning: It is a bad pattern to use react-redux's connect decorator to map the state from this reducer to props on your Route components. This can lead to infinite loops and performance problems. react-router already provides this for you via this.props.location.
	 *
	 * @export
	 * @param {Location} state (description)
	 * @param {IAction} action (description)
	 * @returns {Location} (description)
	 */
	export function routerReducer(state: IRouterState, action: RouterAction): IRouterState;


    /**
     * A middleware you can apply to your Redux store to capture dispatched actions created by the action creators.
     * It will redirect those actions to the provided history instance.
     */
    export function routerMiddleware<TState>(history: History): IMiddleware<TState>;

    // Action types interfaces. These are deprecated
    /**
     * @deprecated
     */
    interface IRoutePushAction {
        (nextLocation: LocationDescriptor): IAction;
    }

    /**
     * @deprecated
     */
    interface IRouteReplaceAction {
        (nextLocation: LocationDescriptor): IAction;
    }

    /**
     * @deprecated
     */
    interface IRouteGoAction {
        (n: number): IAction;
    }

    /**
     * @deprecated
     */
    interface IRouteGoForwardAction {
        (): IAction;
    }

    /**
     * @deprecated
     */
    interface IRouteGoBackAction {
        (): IAction;
    }

    /**
     * @deprecated
     */
	export interface IRouteActions {
		push: IRoutePushAction;
		replace: IRouteReplaceAction;
		go: IRouteGoAction;
		goForward: IRouteGoForwardAction;
		goBack: IRouteGoBackAction;
	}

	/**
	 * An object that contains all the actions creators you can use to manipulate history:
	 * @deprecated
	 * @export
	 */
	export const routerActions: IRouteActions;

    /**
     * This action type will be dispatched by the history actions below.
     * If you're writing a middleware to watch for navigation events, be sure to
     * look for actions of this type.
     * @export
     */
    export const CALL_HISTORY_METHOD: string;

    // separate actions
    /**
     * @deprecated
     */
    export const push: IRoutePushAction;
    /**
     * @deprecated
     */
    export const replace: IRouteReplaceAction;
    /**
     * @deprecated
     */
    export const go: IRouteGoAction;
    /**
     * @deprecated
     */
    export const goForward: IRouteGoForwardAction;
    /**
     * @deprecated
     */
    export const goBack: IRouteGoBackAction;

}

export = reactRouterRedux;
