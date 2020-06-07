import {
  FETCH_RESIDENT_SUCCESS,
  FETCH_RESIDENT_ERROR,
  UPDATE_RESIDENT_SUCCESS,
  UPDATE_RESIDENT_ERROR,
  FETCH_RESIDENTS_SUCCESS,
  FETCH_RESIDENTS_ERROR
} from "../actions/actionTypes";

const initialState = {
  residentError: null,
  resident: null,
  residents: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RESIDENTS_SUCCESS:
      return { ...state, residents: action.residents, residentError: null }
    case FETCH_RESIDENTS_ERROR:
      return { ...state, residentError: action.error }
    case FETCH_RESIDENT_SUCCESS:
      return { ...state, resident: action.resident, residentError: null };
    case FETCH_RESIDENT_ERROR:
      return { ...state, residentError: action.error };
    case UPDATE_RESIDENT_SUCCESS:
      return { ...state, residentError: null };
    case UPDATE_RESIDENT_ERROR:
      return { ...state, residentError: action.error };
    default:
      return state;
  }
};

export default reducer;
