import React, { Component } from "react";
import { Container, Modal, ModalBody } from "reactstrap";
import { connect } from "react-redux";
import { createPremise, fetchPremises, fetchResidents } from "../../store/actions/actions";
import { Link } from "react-router-dom";
import PromoBG from "../../assets/images/apartmentsPromo.svg";
import PromoArrow from "../../assets/images/apartmentsArrow.svg";
import DotsLeft from "../../assets/images/apartmentsBodyLeftDots.svg";
import DotsRight from "../../assets/images/apartmentsBodyRightDots.svg";
import DotsBottom from "../../assets/images/apartmentsBottomrRigthDots.svg";
import TopChooseArrow from "../../assets/images/apartmentTopChooseArrow.svg";
import HouseIcon from "../../assets/images/apartmentHouseIcon.svg";
import AvatarIcon from "../../assets/images/apartmentsPromoNotifyAvatar.svg";
import NotifyArrow from "../../assets/images/apartmentsNotifyOthersArrow.svg";
import equal from "fast-deep-equal";

class Apartments extends Component {
  constructor(props) {
    super(props);
    const premiseInfo = props.premises.filter(
      (premise) => premise.ID.toString() === this.premiseID
    )[0];
    this.state = {
      notifyList: [2],
      isModalOpen: false,
      directionType: this.props.user.directionTypes[0],
      premiseInfo,
      premises: [],
      residentsPayLeft: []
    }
  }

  componentDidMount() {
    this.props.fetchPremises(this.props.user.id);
    this.props.onFetchResidents()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(!equal(prevProps.premises, this.props.premises)) {
      this.setState({premises: this.props.premises})
    } else if(this.props.premises.length > 0 && this.props.residents.length > 0 && !equal(prevProps.residents, this.props.residents)) {
      let residentsPayLeft = []
      console.log('Residents show ID', this.props.residents)
      this.props.premises.filter(premise => premise.userID == this.props.user.id)
        .forEach(premise => {
          this.props.residents.forEach(resident => {
            if(resident.ID == premise.residentID && resident.Payments.length > 0) {
              let paymentsLeft = []
              resident.Payments.forEach(payment => {
                const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                const firstDate = new Date(payment.month)
                const secondDate = new Date(firstDate.getFullYear(),  firstDate.getMonth()+1, 1);
                const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                if(diffDays < 4) {
                  payment.daysLeft = diffDays - 1
                  paymentsLeft.push(payment)
                }
              })
              if(paymentsLeft.length > 0) {
                paymentsLeft = paymentsLeft.sort((a, b) => a.daysLeft - b.daysLeft)
                resident.daysToNextMonth = paymentsLeft[0].daysLeft
                residentsPayLeft.push(resident)
              }
            }
          })
        })
      if(residentsPayLeft.length > 0) {
        residentsPayLeft.sort((a, b) => a.daysToNextMonth - b.daysToNextMonth)
        this.setState({residentsPayLeft})
      }
    }
  }

  toggleAddApartment = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  directionChangeHandler = (e) => {
    this.setState({ directionType: e.target.id });
  };

  inputChangeHandler = (e) => {
    const premiseInfo = { ...this.state.premiseInfo };
    premiseInfo[e.target.name] = e.target.value;
    this.setState({ premiseInfo });
  };

  submitFormHandler = (e) => {
    e.preventDefault();
    const premiseInfo = { ...this.state.premiseInfo };
    premiseInfo.price = parseInt(premiseInfo.price);
    premiseInfo.type = this.state.directionType;
    premiseInfo.id = this.props.user.id;
    this.props.createPremise(premiseInfo);
    this.toggleAddApartment()
  };

  render() {
    const { isModalOpen, directionType, residentsPayLeft } = this.state;
    console.log('Props', this.props)
    console.log('State', this.state)
    return (
      <>
        <Container className="myContainer" style={{ position: "relative" }}>
          <div className="apartmentsPromo">
            {residentsPayLeft.length === 0 ? (
              <div className="apartmentsPromoText">
                <h1 className="apartmentsPromoTitle">
                  Здравствуйте,{" "}
                  <span className="apartmentsPromoTitlePart">
                    {this.props.user.firstName}!
                  </span>
                </h1>
                <span className="apartmentsPromoSubTitle">
                  Теперь управление бизнесом легко
                </span>
              </div>
            ) : (
              <div className="apartmentsPromoText2">
                <h1 className="apartmentsPromoTitle2">
                  Здравствуйте,{" "}
                  <span className="apartmentsPromoTitlePart">
                    {this.props.user.firstName}!
                  </span>
                </h1>
                <span className="apartmentsPromoSubTitle2">
                  Теперь управление бизнес ом легко
                </span>
                <div className="apartmentsPromoNotify">
                  <div className="apartmentsPromoNotifyAvatar">
                    <img src={AvatarIcon} alt="" />
                  </div>
                  <div className="apartmentsPromoNotifyResidentInfo">
                    <span className="apartmentsPromoNotifyFullName">
                      {residentsPayLeft[0].lastName + ' ' + residentsPayLeft[0].firstName}
                    </span>
                    <span className="apartmentsPromoNotifyTimeLeft">
                      Осталось {residentsPayLeft[0].daysToNextMonth < 2 ? `${residentsPayLeft[0].daysToNextMonth} день` : `${residentsPayLeft[0].daysToNextMonth} дня`} до оплаты аренды
                    </span>
                    <button className="apartmentsPromoNotifyCall">
                      Позвонить
                    </button>
                    <button className="apartmentsPromoNotifyCall">
                      Отправить смс
                    </button>
                  </div>
                  <div className="apartmentsPromoNotifyOthers">
                    Остальные {""}
                    <img src={NotifyArrow} alt="" />
                  </div>
                </div>
              </div>
            )}

            <img className="apartmentsPromoImage" src={PromoBG} alt="" />
            <img className="apartmentsPromoArrow" src={PromoArrow} alt="" />
          </div>
        </Container>
        <div className="apartmentsListBlock">
          <span className="apartmentsBackgroundLogo">L A T</span>
          <Container className="myContainer">
            <Modal
              className="mainModal"
              isOpen={isModalOpen}
              toggle={this.toggleAddApartment}
              contentClassName="mainModalContent"
            >
              <ModalBody className="mainModalBody">
                <h3 className="mainModalTitle">
                  Заполните информацию об арендаторе
                </h3>
                <form onSubmit={this.submitFormHandler}>
                  <input
                    className="mainModalInput"
                    type="text"
                    name="firstName"
                    placeholder="Имя арендатора"
                    onChange={this.inputChangeHandler}
                  />
                  <input
                    className="mainModalInput"
                    type="text"
                    name="lastName"
                    placeholder="Фамилия арендатора"
                    onChange={this.inputChangeHandler}
                  />
                  <input
                    className="mainModalInput"
                    type="tel"
                    name="phone"
                    placeholder="Номер телефона"
                    onChange={this.inputChangeHandler}
                  />
                  <input
                    className="mainModalInput"
                    type="number"
                    name="number"
                    placeholder="Номер квартиры"
                    onChange={this.inputChangeHandler}
                  />
                  <input
                    className="mainModalInput"
                    type="text"
                    name="address"
                    placeholder="Адрес квартиры"
                    onChange={this.inputChangeHandler}
                  />
                  <input
                    className="mainModalInput"
                    type="number"
                    name="price"
                    placeholder="Сумма(цена) за месяц"
                    onChange={this.inputChangeHandler}
                  />
                  <input
                    className="mainModalButton"
                    type="submit"
                    value="Добавить"
                  />
                </form>
              </ModalBody>
            </Modal>

            <div className="apartmentsTopChoose">
              {this.props.user.directionTypes.map((direction) => {
                let title = "Квартиры";
                if (direction === "office") {
                  title = "Офисы";
                } else if (direction === "boutique") {
                  title = "Бутики";
                }
                let className =
                  directionType === direction
                    ? "apartmentsTopChooseText apartmentsTopChooseTextUnderline"
                    : "apartmentsTopChooseText";
                return (
                  <span
                    key={direction}
                    id={direction}
                    className={className}
                    onClick={this.directionChangeHandler}
                  >
                    {title}
                  </span>
                );
              })}
              <div className="apartmentsTopChooseLineBox">
                <div className="apartmentsTopChooseLine" />
                <img
                  src={TopChooseArrow}
                  alt=""
                  className="apartmentTopChooseArrow"
                />
              </div>
            </div>

            <div className="apartmentsBottomChoose">
              {this.props.premises.length > 0 ? (
                this.props.premises
                  .filter(
                    (premise) => premise.type === this.state.directionType
                  )
                  .map((premise) => {
                    return (
                      <button
                        className="apartmentNumber"
                        key={premise.ID.toString()}
                      >
                        <Link
                          to={`/info/${premise.ID}`}
                          className="apartmentNumberLink"
                        >
                          <img
                            className="apartmentNumberIcon"
                            src={HouseIcon}
                            alt=""
                          />
                          <span className="apartmentNumberTitle">
                            Квартира #{premise.number}
                          </span>
                        </Link>
                      </button>
                    );
                  })

              ) : (
                <h3 className='apartmentsNumberEmpty'> Вы еще не добавили квартиру </h3>
              )}
              <div
                className="apartmentNumber apartmentsNumberAdd"
                onClick={this.toggleAddApartment}
              >
                <span className="apartmentNumberAddIcon">+</span>
                <span className="apartmentNumberAddText">Добавить</span>
              </div>
            </div>
          </Container>
        </div>

        <img className="apartmentsDotsLeft" src={DotsLeft} alt="" />
        <img className="apartmentsDotsRight" src={DotsRight} alt="" />
        <img className="apartmentsDotsBottom" src={DotsBottom} alt="" />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.premises.premiseError,
    user: state.users.user,
    premises: state.premises.premises,
    residents: state.residents.residents
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createPremise: (premiseData) => dispatch(createPremise(premiseData)),
    fetchPremises: (id) => dispatch(fetchPremises(id)),
    onFetchResidents: () => dispatch(fetchResidents())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Apartments);
