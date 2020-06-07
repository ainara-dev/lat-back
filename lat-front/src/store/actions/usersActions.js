import axios from "../../axios-api";
import { push } from "connected-react-router";
import { NotificationManager } from "react-notifications";
import {
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  CHECK_REGISTER_USER_SUCCESS,
  CHECK_REGISTER_USER_ERROR,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS,
} from "./actionTypes";
import jwt from "jsonwebtoken";

const checkRegisterUserSuccess = (checkRegisterData) => {
  return { type: CHECK_REGISTER_USER_SUCCESS, checkRegisterData };
};

const checkRegisterUserError = (error) => {
  return { type: CHECK_REGISTER_USER_ERROR, error };
};

export const checkRegisterUser = (checkRegisterData) => {
  return (dispatch) => {
    if (checkRegisterData.password.length < 6) {
      dispatch(
        checkRegisterUserError({
          result: "Длина пароля не должна быть меньше 6",
        })
      );
    } else if (checkRegisterData.phone.length !== 12) {
      dispatch(
        checkRegisterUserError({
          result: "Длина номер телефона должна быть 12",
        })
      );
    } else {
      axios.post("/api/checkRegister", checkRegisterData).then(
        (response) => {
          dispatch(checkRegisterUserSuccess(checkRegisterData));
          dispatch(push("/direction"));
        },
        (error) => {
          if (error.response && error.response.data) {
            dispatch(checkRegisterUserError(error.response.data));
          } else {
            dispatch(
              checkRegisterUserError({ result: "Нет соединение с интернетом" })
            );
          }
        }
      );
    }
  };
};

const registerUserSuccess = (userData) => {
  return { type: REGISTER_USER_SUCCESS, userData };
};

const registerUserError = (error) => {
  return { type: REGISTER_USER_ERROR, error };
};

export const registerUser = (userData) => {
  return (dispatch) => {
    if (
      userData.directionType.apartment === false &&
      userData.directionType.office === false &&
      userData.directionType.boutique === false
    ) {
      NotificationManager.error("Выберите хотя бы одно направление");
    } else {
      axios
        .post("/api/getDirectionTypeID", userData.directionType)
        .then(
          (response) => {
            userData.directionTypeID = response.data.result;
          },
          (error) => {
            if (error.response && error.response.data) {
              dispatch(registerUserError(error.response.data));
            } else {
              dispatch(
                registerUserError({ result: "Нет соединение с интернетом" })
              );
            }
          }
        )
        .then((response) => {
          axios.post("/api/register", userData).then(
            (response) => {
              let jwtData = jwt.verify(response.data.token, "mySecretKey");
              let directionTypes = [];
              for (let direction in jwtData.directionTypes) {
                if (
                  direction === "apartment" &&
                  jwtData.directionTypes[direction] === true
                ) {
                  directionTypes.push(direction);
                }
                if (
                  direction === "office" &&
                  jwtData.directionTypes[direction] === true
                ) {
                  directionTypes.push(direction);
                }
                if (
                  direction === "boutique" &&
                  jwtData.directionTypes[direction] === true
                ) {
                  directionTypes.push(direction);
                }
              }

              let userData = {
                ...jwtData,
                directionTypes,
                token: response.data.token,
              };
              dispatch(registerUserSuccess(userData));
              dispatch(push("/"));
              NotificationManager.success("Register success");
            },
            (error) => {
              if (error.response && error.response.data) {
                dispatch(registerUserError(error.response.data));
              } else {
                dispatch(
                  registerUserError({ result: "Нет соединение с интернетом" })
                );
              }
            }
          );
        });
    }
  };
};

const loginUserSuccess = (userData) => {
  return { type: LOGIN_USER_SUCCESS, userData };
};
const loginUserError = (error) => {
  return { type: LOGIN_USER_ERROR, error };
};

export const loginUser = (userData) => {
  return (dispatch) => {
    axios.post("/api/login", userData).then(
      (response) => {
        let jwtData = jwt.verify(response.data.token, "mySecretKey");

        let directionTypes = [];
        for (let direction in jwtData.directionTypes) {
          if (
            direction === "apartment" &&
            jwtData.directionTypes[direction] === true
          ) {
            directionTypes.push(direction);
          }
          if (
            direction === "office" &&
            jwtData.directionTypes[direction] === true
          ) {
            directionTypes.push(direction);
          }
          if (
            direction === "boutique" &&
            jwtData.directionTypes[direction] === true
          ) {
            directionTypes.push(direction);
          }
        }

        let userData = {
          ...jwtData,
          directionTypes,
          token: response.data.token,
        };
        console.log("userData", userData);
        dispatch(loginUserSuccess(userData));
        dispatch(push("/"));
      },
      (error) => {
        if (error.response && error.response.data) {
          dispatch(loginUserError(error.response.data));
        } else {
          dispatch(loginUserError({ result: "Нет соединение с интернетом" }));
        }
      }
    );
  };
};

export const logoutUser = () => {
  return (dispatch, getState) => {
    dispatch({ type: LOGOUT_USER });
    NotificationManager.success("Успешно вышли с аккаунта");
    dispatch(push("/"));
  };
};

export const facebookLogin = (data) => {
  return (dispatch) => {
    axios.post("/users/facebookLogin", data).then(
      (response) => {
        dispatch(loginUserSuccess(response.data));
        dispatch(push("/"));
        NotificationManager.success("Logged in with facebook!");
      },
      (error) => {
        dispatch(loginUserError(error.response.data));
      }
    );
  };
};
