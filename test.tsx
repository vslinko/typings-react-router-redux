/// <reference path="typings/main.d.ts" />
/// <reference path="react-router-redux.d.ts" />


import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware, IActionGeneric, IAction, bindActionCreators } from 'redux'
import { Provider, connect } from 'react-redux'
import { Router, Route, browserHistory, Link } from 'react-router'
import { routeReducer, syncHistoryWithStore, routerMiddleware } from './react-router-redux'
import { Location } from "history";

interface IState {
	location: Location;
	message: string;
	changes: number;
}

const CHANGE_MESSAGE = "CHANGE_MESSAGE";

function changeMessage(message: string): IActionGeneric<string> {
	return {
		type: CHANGE_MESSAGE,
		payload: message
	};
}

function messageReducer(state: string = "No Message", action: IActionGeneric<string>): string {
	switch (action.type) {
		case CHANGE_MESSAGE: return action.payload;
	}

	return state;
}

function changeReducer(state: number = 0, action: IAction): number {
	switch (action.type) {
		case CHANGE_MESSAGE: return state + 1;
	}

	return state;
}

const rootReducer = combineReducers<IState>({
	location: routeReducer,
	message: messageReducer,
	changes: changeReducer
});

// Sync dispatched route actions to the history
const reduxRouterMiddleware = routerMiddleware<IState>(browserHistory)
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware)(createStore)

const store = createStoreWithMiddleware(rootReducer);
const history = syncHistoryWithStore(browserHistory, store);

class App extends React.Component<{}, {}>{
	render() {
		return (
			<div>
				<Link to="nessage">To Message</Link>
				<Link to="count">To Count</Link>
			</div>
		);
	}
}

interface IFooProps {
	fooMessage?: string;
	changeMessage?: (message: string) => any;
}

@connect((s: IState) => ({ fooMessage: s.message }), d => ({ changeMessage: bindActionCreators(changeMessage, d) }))
class Foo extends React.Component<IFooProps, {}>{
	handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		const input = this.refs["message"] as HTMLInputElement;
		this.props.changeMessage(input.value);
		input.value = "";
	}

	render() {
		return (
			<div>
				<Link to="/">Root</Link>
				<form action="" onSubmit={e => this.handleSubmit(e) }>
					<input type="text" ref="message"/>
					<button type="submit"></button>
				</form>
				<h1>Message: {this.props.fooMessage}</h1>
			</div>
		);
	}
}

interface IBarProps {
	count: number;
}

@connect((s: IState) => ({ count: s.changes }))
class Bar extends React.Component<IBarProps, {}>{
	render() {
		return (
			<div>
				<Link to="/">Root</Link>
				<h1>{this.props.count}</h1>
			</div>
		)
	}
}

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}>
				<Route path="message" component={Foo}/>
				<Route path="count" component={Bar}/>
			</Route>
		</Router>
	</Provider>,
	document.getElementById('mount')
)