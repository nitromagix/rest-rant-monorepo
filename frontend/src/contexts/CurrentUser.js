import { createContext, useState, useEffect } from "react";

export const CurrentUser = createContext();

function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getLoggedInUser = async () => {
      const response = await fetch(
        "http://localhost:5000/authentication/token",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const responseJson = await response.json();
      const user = responseJson.user;
      // console.log(responseJson.random)
      setCurrentUser(user);
    };
    getLoggedInUser();
  }, []);

  // window.setCurrentUser = setCurrentUser;

  return (
    <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUser.Provider>
  );
}

export default CurrentUserProvider;
