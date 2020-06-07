import React, { Component } from "react";
import { UncontrolledAlert, Container, Modal, ModalBody } from "reactstrap";
import { connect } from "react-redux";
import { loginUser, checkRegisterUser } from "../../store/actions/usersActions";
import Photo from "../../assets/images/mainBig.png";
import PhotoDots from "../../assets/images/mainDots.svg";

class Authorize extends Component {
  state = {
    phone: "+7",
    password: "",
    firstName: "",
    lastName: "",
    loginModal: false,
    registerModal: false,
  };

  inputChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  toggleLoginModal = () => {
    this.setState({ loginModal: !this.state.loginModal });
  };

  toggleRegisterModal = () => {
    this.setState({ registerModal: !this.state.registerModal });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    if (e.target.name === "loginForm") {
      this.props.loginUser(this.state);
    } else {
      this.props.checkRegisterUser(this.state);
    }
  };

  render() {
    const { loginModal, registerModal } = this.state;
    return (
      <>
        <Container
          className="myContainer blackPurpleBG"
          style={{ position: "relative" }}
        >
          {/* Login Modal */}
          <Modal
            className="mainModal"
            isOpen={loginModal}
            toggle={this.toggleLoginModal}
            contentClassName="mainModalContent"
          >
            <ModalBody className="mainModalBody">
              <h3 className="mainModalTitle"> Заполните форму! </h3>
              <form onSubmit={this.onSubmitHandler} name="loginForm">
                <input
                  className="mainModalInput"
                  type="tel"
                  name="phone"
                  placeholder="Номер телефона"
                  value={this.state.phone}
                  onChange={this.inputChangeHandler}
                />
                <input
                  className="mainModalInput"
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  value={this.state.password}
                  onChange={this.inputChangeHandler}
                />
                {this.props.loginError ? (
                  <UncontrolledAlert color="danger">
                    {this.props.loginError.result}!
                  </UncontrolledAlert>
                ) : null}
                <input
                  className="mainModalButton"
                  type="submit"
                  value="Войти"
                />
              </form>
            </ModalBody>
          </Modal>

          {/* Registration Modal */}

          <Modal
            className="mainModal"
            isOpen={registerModal}
            toggle={this.toggleRegisterModal}
            contentClassName="mainModalContent"
          >
            <ModalBody className="mainModalBody">
              <h3 className="mainModalTitle"> Заполните форму! </h3>
              <form onSubmit={this.onSubmitHandler} name="registerForm">
                <input
                  className="mainModalInput"
                  type="text"
                  name="firstName"
                  placeholder="Имя"
                  value={this.state.firstName}
                  onChange={this.inputChangeHandler}
                />
                <input
                  className="mainModalInput"
                  type="text"
                  name="lastName"
                  placeholder="Фамилия"
                  value={this.state.lastName}
                  onChange={this.inputChangeHandler}
                />
                <input
                  className="mainModalInput"
                  type="tel"
                  name="phone"
                  placeholder="Номер телефона"
                  value={this.state.phone}
                  onChange={this.inputChangeHandler}
                />
                <input
                  className="mainModalInput"
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  value={this.state.password}
                  onChange={this.inputChangeHandler}
                />
                {this.props.checkRegisterError ? (
                  <UncontrolledAlert color="danger">
                    {this.props.checkRegisterError.result}!
                  </UncontrolledAlert>
                ) : null}
                <input
                  className="mainModalButton"
                  type="submit"
                  value="Войти"
                />
              </form>
            </ModalBody>
          </Modal>

          <div className="mainTitle">
            <h1 className="mainTitleText">
              Здравствуйте,
              <span className="mainTitleTextSub">Арендодатель!</span>
            </h1>
          </div>

          <div className="mainSubTitle">
            <h3 className="mainSubTitleText">
              Сделай свой бизнес легкоуправляемым и доверься программе как к
              лучшему специалисту
            </h3>
          </div>

          <div className="mainButtonsBlock">
            <button
              className="mainButtons mainButtonLeft"
              onClick={this.toggleLoginModal}
            >
              Войти
            </button>
            <button
              className="mainButtons mainButtonRight"
              onClick={this.toggleRegisterModal}
            >
              Создать аккаунт
            </button>
          </div>

          <img className="mainCenterImageDots" src={PhotoDots} alt="" />
          <img className="mainCenterImage" src={Photo} alt="" />
        </Container>
        <div className="mainRightPinkBackground" />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginError: state.users.loginError,
    checkRegisterError: state.users.checkRegisterError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (userData) => dispatch(loginUser(userData)),
    checkRegisterUser: (checkRegisterData) =>
      dispatch(checkRegisterUser(checkRegisterData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authorize);
