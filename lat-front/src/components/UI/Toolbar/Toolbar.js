import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import {
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
} from "reactstrap";
import UserMenu from "./Menus/UserMenu";
import AnonymousMenu from "./Menus/AnonymousMenu";
import Logo from "../../../assets/images/logo.svg";
import RightTopImage from "../../../assets/images/loginRegisterRightTopImage.svg";

const Toolbar = ({ user, logout, page }) => {
  let content = (
    <Navbar color="dark" dark className="mb-3">
      <Container>
        <NavbarBrand tag={RouterNavLink} to="/" exact>
          Shop
        </NavbarBrand>
        <Nav className="ml-auto">
          <NavItem>
            <NavLink tag={RouterNavLink} to="/" exact>
              Products
            </NavLink>
          </NavItem>
          {user ? <UserMenu user={user} logout={logout} /> : <AnonymousMenu />}
        </Nav>
      </Container>
    </Navbar>
  );
  if (page === "login") {
    content = (
      <>
        <Container className="myContainer">
          <Navbar style={{ padding: 0 }}>
            <NavbarBrand
              tag={RouterNavLink}
              to="/"
              exact
              style={{ padding: 0 }}
            >
              <img className="w-100" src={Logo} alt="" />
            </NavbarBrand>
          </Navbar>
        </Container>
        <img
          className="loginRegisterRightTopImage"
          src={RightTopImage}
          alt=""
        />
      </>
    );
  } else if (page === "apartment") {
    content = (
      <>
        <Container
          className="myContainer"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Navbar style={{ padding: 0 }}>
            <NavbarBrand
              tag={RouterNavLink}
              to="/"
              exact
              style={{ padding: 0 }}
            >
              <img className="w-100" src={Logo} alt="" />
            </NavbarBrand>
          </Navbar>
          <div className="apartmentsMenuLinks">
            <RouterNavLink className="apartmentsMenuLinksText" to="/" exact>
              Главное
            </RouterNavLink>
            <RouterNavLink className="apartmentsMenuLinksText" to="/" exact>
              Квартиры
            </RouterNavLink>
            <RouterNavLink className="apartmentsMenuLinksText" to="/" exact>
              Уведомлении
            </RouterNavLink>
          </div>
          <button className="apartmentsExtBtn" onClick={() => logout()}>
            Выйти
          </button>
        </Container>
        {/*<img*/}
        {/*  className="loginRegisterRightTopImage"*/}
        {/*  src={RightTopImage}*/}
        {/*  alt=""*/}
        {/*/>*/}
      </>
    );
  }
  return <>{content}</>;
};

export default Toolbar;
