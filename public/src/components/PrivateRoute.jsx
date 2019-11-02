import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      // if you navigate to /profile without being logged in you get asked to log in!
      // to test this use window.history, as typing int he url make a request to the server.
      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: { targetUrl: path }
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect, path]); 
  // "dependency list is a way of making local vars available in the anonymous function

  const render = props =>
    isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

// enforcing argument types
PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
};

export default PrivateRoute;
