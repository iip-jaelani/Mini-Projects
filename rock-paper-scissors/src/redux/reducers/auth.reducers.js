import { CREATE_ROOM } from "../constants";

const initialState = {
  myRoom: {}
};

const AuthReducers = (state = initialState, action) => {
  switch (action.type) {
    case `${CREATE_ROOM}_FULL_FIELD`:
      return {
        ...state,
        myRoom: action.payload
      };
    default:
      return {
        ...state
      };
  }
};

export default AuthReducers;
