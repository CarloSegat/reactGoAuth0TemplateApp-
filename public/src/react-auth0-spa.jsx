import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions // client id and domain
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [authClient, setAuthClient] = useState({});
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      console.log("everytime the outer compoennt of the app is mounted/unmounted this is called")
      const authFromHook = await createAuth0Client(initOptions);
      setAuthClient(authFromHook);
      console.log("auth0Client inside", authClient)
      console.log("auth0FromHook", authFromHook)


      console.log(window.location.search)
      if (window.location.search.includes("code=")) {
        const { appState } = await authFromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await authFromHook.isAuthenticated();
      console.log("isAuthenticated", isAuthenticated)
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await authFromHook.getUser();
        const accessToken = await authFromHook.getTokenSilently();
        localStorage.setItem("access_token", accessToken);
        console.log("authFromHook", authFromHook)
        setUser(user);
      }
      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await authClient.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await authClient.getUser();
    console.log("auth0Client", user)
    setUser(user);
    setIsAuthenticated(true);
  };


  const handleRedirectCallback = async () => {
    setLoading(true);
    await authClient.handleRedirectCallback();
    const user = await authClient.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };


  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => {authClient.getIdTokenClaims(...p)},
        loginWithRedirect: (...p) => authClient.loginWithRedirect(...p),
        getTokenSilently: (...p) => authClient.getTokenSilently(...p),
        getTokenWithPopup: (...p) => authClient.getTokenWithPopup(...p),
        logout: (...p) => authClient.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
