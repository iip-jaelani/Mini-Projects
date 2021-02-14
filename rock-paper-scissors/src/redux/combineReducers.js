import { combineReducers } from "redux";
import AuthReducers from "./reducers/auth.reducers";

export default combineReducers({
	authReducers: AuthReducers,
});
