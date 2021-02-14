import { applyMiddleware, createStore, compose } from "redux";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
import combineReducers from "./combineReducers";
const { logger } = require("redux-logger");

const middleware = [thunk, promise];

if (process.env.NODE_ENV === "development") {
	middleware.push(logger);
}

const store = compose(applyMiddleware(...middleware))(createStore)(
	combineReducers
);

export default store;
