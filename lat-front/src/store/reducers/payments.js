import {
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_ERROR,
  FETCH_PAYMENTS_SUCCESS,
  FETCH_PAYMENTS_ERROR
} from "../actions/actionTypes";

const initialState = {
  paymentError: null,
  payments: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PAYMENTS_SUCCESS:
      return {...state, paymentError: null, payments: action.payments}
    case FETCH_PAYMENTS_ERROR:
      return { ...state, paymentError: action.error };
    case CREATE_PAYMENT_SUCCESS:
      return { ...state, paymentError: null, payments: action.payments };
    case CREATE_PAYMENT_ERROR:
      return { ...state, paymentError: action.error };
    default:
      return state;
  }
};

export default reducer;
