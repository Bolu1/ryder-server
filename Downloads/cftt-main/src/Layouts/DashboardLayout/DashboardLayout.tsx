import React, { useReducer } from "react";
import logo from "assets/images/logo.png";
import "./dashboardLayout.scss";
import { sideBarRoutes } from "./sidebarLinks";
import { BellRinging, Logout, X } from "tabler-icons-react";
import { Link } from "react-router-dom";
import Modal from "utilComponents/Modal";
import { Animated } from "react-animated-css";
import { history } from "helpers";
import { connect } from "react-redux";
import userIcon from "assets/images/user.png";
import PermissionWrapper from "utilComponents/PermissionWrapper";

const DashboardLayout = (props: any): JSX.Element => {
  const initialState = {
    showModal: false,
  };
  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    initialState
  );
  const { showModal } = state;
  const { user } = props;

  const handleModalToggle = () => {
    setState({ showModal: !showModal });
  };

  const handleLogout = () => {
    history.push("/login");
  };

  const getMatch = (item: any) => {
    if (window.location.pathname.match(item)) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Modal title="Logout" show={showModal} toggle={handleModalToggle}>
        <>
          <div className="text-center">
            <Animated
              animationIn="rotateIn"
              animationOut="zoomOutDown"
              animationInDuration={1400}
              animationOutDuration={1400}
              isVisible={true}
            >
              <div>
                <X size={70} strokeWidth={3} color={"#bc1d2c"} />
              </div>
            </Animated>
            <h4 className="my-3">Are you sure you want to Logout?</h4>
            <hr />
            <button
              type="button"
              className="btn w-100"
              style={{ background: "#0654DF", color: "white" }}
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          </div>
        </>
      </Modal>
      <div className="sidebar">
        <div className="logo-details">
          <div className="px-2">
            <img src={logo} />
          </div>
        </div>
        <div className="d-flex align-content-between flex-wrap px-3 overflow-auto sidebar-nav-content">
          <div className="user-account mt-4 pt-2 d-flex align-items-center">
            <div className="avatar">
              <img
                src={user?.avatar ? user?.avatar : userIcon}
                alt="user avatar"
              />
            </div>
            <div className="user-name px-2">
              <h6 className="m-0 name">{user?.full_name}</h6>
              <span className="small email">{user?.email}</span>
            </div>
          </div>
          {sideBarRoutes.map((route, index) => {
            return (
              <>
                <div className="w-100 sidebar-section-title py-2 mt-3">
                  {route?.title}
                </div>
                {route.children.map((routeChild, _i) => {
                  return (
                    <>
                      {user?.full_name && (
                        <div className="w-100 sidebar-section-link py-2 px-2 ">
                          <PermissionWrapper
                            permission={routeChild?.permission}
                          >
                            <Link
                              to={routeChild.path}
                              className={`sidebar-navlink ${
                                getMatch(routeChild?.match)
                                  ? "text-primary"
                                  : ""
                              }`}
                            >
                              {routeChild?.icon} {routeChild?.text}
                            </Link>
                          </PermissionWrapper>
                        </div>
                      )}

                      {!user?.full_name && (
                        <>
                          {routeChild?.path === "/settings" && (
                            <div className="w-100 sidebar-section-link py-2 px-2 ">
                              <Link
                                to={routeChild.path}
                                className={`sidebar-navlink ${
                                  getMatch(routeChild?.match)
                                    ? "text-primary"
                                    : ""
                                }`}
                              >
                                {routeChild?.icon} {routeChild?.text}
                              </Link>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  );
                })}
              </>
            );
          })}
          <div className="w-100 sidebar-section-link py-2 px-2 ">
            <span
              className="pointer sidebar-navlink"
              onClick={() => handleModalToggle()}
            >
              <Logout /> Logout
            </span>
          </div>
        </div>
      </div>
      <section className="home-section">
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 px-3">
          <div className="d-flex justify-content-end w-100">
            <BellRinging size={30} strokeWidth={1} color={"#000000"} />
          </div>
        </nav>
        <div className="mt-5 px-4">{props.children}</div>
      </section>
    </>
  );
};
function mapStateToProps(appState: any) {
  return {
    user: appState?.reducer?.userObject,
  };
}
export default connect(mapStateToProps)(DashboardLayout);
