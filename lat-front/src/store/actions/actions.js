import {
  FETCH_RESIDENT_SUCCESS,
  FETCH_RESIDENT_ERROR,
  CREATE_PREMISE_SUCCESS,
  CREATE_PREMISE_ERROR,
  FETCH_PREMISES_SUCCESS,
  FETCH_PREMISES_ERROR,
  UPDATE_RESIDENT_SUCCESS,
  UPDATE_RESIDENT_ERROR,
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_ERROR,
  FETCH_PAYMENTS_SUCCESS,
  FETCH_PAYMENTS_ERROR,
  FETCH_RESIDENTS_SUCCESS,
  FETCH_RESIDENTS_ERROR
} from "./actionTypes";
import { push } from "connected-react-router";
import axios from "../../axios-api";

export const createPremiseSuccess = () => {
  return { type: CREATE_PREMISE_SUCCESS };
};

export const createPremiseError = (error) => {
  return { type: CREATE_PREMISE_ERROR, error };
};

export const createPremise = (premiseData) => {
  return (dispatch) => {
    axios.post("/api/createPremise", premiseData).then(
      (response) => {
        dispatch(createPremiseSuccess());
        dispatch(fetchPremisesSuccess(response.data.result))
      },
      (error) => {
        if (error.response && error.response.data) {
          dispatch(createPremiseError(error.response.data));
        } else {
          dispatch(
            createPremiseError({ result: "Нет соединение с интернетом" })
          );
        }
      }
    );
  };
};

export const fetchPremisesSuccess = (premises) => {
  return { type: FETCH_PREMISES_SUCCESS, premises };
};

export const fetchPremisesError = (error) => {
  return { type: FETCH_PREMISES_ERROR, error };
};

export const fetchPremises = (id) => {
  return (dispatch) => {
    axios
      .get("/api/getPremises", {
        params: { id },
      })
      .then(
        (response) => {
          dispatch(fetchPremisesSuccess(response.data.result));
        },
        (error) => {
          if (error.response && error.response.data) {
            dispatch(fetchPremisesError(error.response.data));
            dispatch(push("/"));
          } else {
            dispatch(
              fetchPremisesError({ result: "Нет соединение с интернетом" })
            );
          }
        }
      );
  };
};

export const fetchResidentSuccess = (resident) => {
  return { type: FETCH_RESIDENT_SUCCESS, resident };
};

export const fetchResidentError = (error) => {
  return { type: FETCH_RESIDENT_ERROR, error };
};

export const fetchResident = (residentID) => {
  return (dispatch) => {
    axios
      .get("/api/getResident", {
        params: { residentID },
      })
      .then(
        (response) => {
          dispatch(fetchResidentSuccess(response.data.result));
        },
        (error) => {
          if (error.response && error.response.data) {
            dispatch(fetchPremisesError(error.response.data));
          } else {
            dispatch(
              fetchResidentError({ result: "Нет соединение с интернетом" })
            );
          }
        }
      );
  };
};

export const updateResidentAndPriceSuccess = () => {
  return { type: UPDATE_RESIDENT_SUCCESS };
};

export const updateResidentAndPriceError = (error) => {
  return { type: UPDATE_RESIDENT_ERROR, error };
};

export const updateResidentAndPrice = (residentAndPrice) => (dispatch, getState) => {
  axios.put("/api/updateResidentAndPrice", residentAndPrice).then(
    (response) => {
      dispatch(updateResidentAndPriceSuccess());
      dispatch(fetchResidentSuccess(response.data.result.resident))

      let resultPremise = response.data.result.premise
      let premises = [...getState().premises.premises]
      let newPremises = premises.map(premise => {
        if (premise.ID === resultPremise.ID) {
          return resultPremise
        } else {
          return premise
        }
      })
      dispatch(fetchPremisesSuccess(newPremises))

    },
    (error) => {
      if (error.response && error.response.data) {
        dispatch(updateResidentAndPriceError(error.response.data));
      } else {
        dispatch(
          updateResidentAndPriceError({ result: "Нет соединение с интернетом" })
        );
      }
    }
  );
};

export const createPaymentSuccess = () => {
  return { type: CREATE_PAYMENT_SUCCESS}
}

export const createPaymentError = error => {
  return { type: CREATE_PAYMENT_ERROR, error }
}

export const createPayment = (payment) => dispatch => {
  axios.post('/api/createPayment', payment)
    .then(
      response => {
        dispatch(createPaymentSuccess())
        dispatch(fetchPaymentsSuccess(response.data.result.payments.reverse()))
        dispatch(fetchResidentSuccess(response.data.result.resident))
      },
      error => {
        if (error.response && error.response.data) {
          dispatch(createPaymentError(error.response.data));
        } else {
          dispatch(
            createPaymentError({ result: "Нет соединение с интернетом" })
          );
        }
      }
    )
}

export const fetchPaymentsSuccess = (payments) => {
  return { type: FETCH_PAYMENTS_SUCCESS, payments }
}

export const fetchPaymentsError = error => {
  return { type: FETCH_PAYMENTS_ERROR, error }
}

export const fetchPayments = residentID => dispatch => {
  axios.get('/api/getPayments', {
    params: { residentID }
  })
    .then(
      response => {
        dispatch(fetchPaymentsSuccess(response.data.result.reverse()))
      },
      error => {
        if (error.response && error.response.data) {
          dispatch(fetchPaymentsError(error.response.data));
        } else {
          dispatch(
            fetchPaymentsError({ result: "Нет соединение с интернетом" })
          );
        }
      }
    )
}

export const fetchResidentsSuccess = (residents) => {
  return { type: FETCH_RESIDENTS_SUCCESS, residents }
}

export const fetchResidentsError = (error) => {
  return { type: FETCH_RESIDENTS_ERROR, error }
}

export const fetchResidents = () => dispatch => {
  axios.get('/api/getResidents')
    .then(
      response => {
        dispatch(fetchResidentsSuccess(response.data.result))
      },
      error => {
        if (error.response && error.response.data) {
          dispatch(fetchPaymentsError(error.response.data));
        } else {
          dispatch(
            fetchResidentsError({ result: "Нет соединение с интернетом" })
          );
        }
      }
    )
}