import React, { Component } from "react";
import { Container } from "reactstrap";
import { connect } from "react-redux";
import DirectionBox from "../../components/DirectionBox/DirectionBox";
import { registerUser } from "../../store/actions/usersActions";
import ImageDirectionLeft from "../../assets/images/directionLeft.svg";
import ImageDirectionDots from "../../assets/images/directionDots.svg";
import ImgContentLeft from "../../assets/images/directionContentLeft.svg";
import ImgContentCenter from "../../assets/images/directionContentCenter.svg";
import ImgContentRight from "../../assets/images/directionContentRight.svg";

class Direction extends Component {
  state = {
    apartment: false,
    office: false,
    boutique: false,
  };

  boxChangeColorHandler = (directionName) => {
    this.setState({ [directionName]: !this.state[directionName] });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    this.props.registerUser({
      directionType: this.state,
      ...this.props.checkRegisterData,
    });
  };

  render() {
    return (
      <>
        <div className="directionLeftPinkBackground" />
        <Container className="myContainer" style={{ position: "relative" }}>
          <h1 className="directionTitle">Выберите ваше направление</h1>
          <div className="directionContent">
            <DirectionBox
              title="Аренда квартиры"
              directionName="apartment"
              changeColor={this.boxChangeColorHandler}
              imgSrc={ImgContentLeft}
              isClicked={this.state.apartment}
            />
            <DirectionBox
              title="Аренда офисов"
              directionName="office"
              changeColor={this.boxChangeColorHandler}
              imgSrc={ImgContentCenter}
              isClicked={this.state.office}
            />
            <DirectionBox
              title="Аренда бутиков"
              directionName="boutique"
              changeColor={this.boxChangeColorHandler}
              imgSrc={ImgContentRight}
              isClicked={this.state.boutique}
            />
          </div>
          <button
            className="directionContinueBtn"
            onClick={this.onSubmitHandler}
          >
            Дальше
          </button>
          <img
            className="directionLeftImageDots"
            src={ImageDirectionDots}
            alt="dots"
          />
          <img
            className="directionLeftImage"
            src={ImageDirectionLeft}
            alt="people"
          />
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    checkRegisterData: state.users.checkRegisterData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerUser: (userData) => dispatch(registerUser(userData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Direction);
