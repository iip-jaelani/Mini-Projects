import { CREATE_ROOM } from "../constants";

export const createRoom = (data) => {
	return (dispatch) => {
		dispatch({ type: `${CREATE_ROOM}_FULL_FIELD`, payload: data });
	};
};
