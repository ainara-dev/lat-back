import {
  CREATE_PREMISE_ERROR,
  FETCH_PREMISES_SUCCESS,
  FETCH_PREMISES_ERROR,
} from "../actions/actionTypes";

const initialState = {
  premiseError: null,
  premises: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PREMISE_ERROR:
      return { ...state, premiseError: action.error, premises: action.premises };
    case FETCH_PREMISES_SUCCESS:
      return { ...state,  premiseError: null, premises: action.premises };
    case FETCH_PREMISES_ERROR:
      return { ...state, premiseError: action.error };
    default:
      return state;
  }
};

export default reducer;
