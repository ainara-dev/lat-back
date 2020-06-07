import { FETCH_CATEGORIES_SUCCESS } from "../actions/actionTypes";

const initialState = {
  allCategories: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES_SUCCESS:
      return { ...state, allCategories: action.categories };
    default:
      return state;
  }
};

export default reducer;
