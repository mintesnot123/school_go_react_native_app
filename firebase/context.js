import React, { useEffect, useState } from "react";
import firebase from "./firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [language, setLanguage] = useState("eng");
  const changeLanguage = () => {
    if (language === "eng") {
      setLanguage("bah");
    } else {
      setLanguage("eng");
    }
  };

  useEffect(() => {
    firebase.auth.onAuthStateChanged((user) => {
      console.log("new user detected", user);
      if (user) {
        firebase
          .getUser(user.uid)
          .then((value) => {
            setUser({
              email: user.email,
              uid: user.uid,
              role: value.data().role,
            });
          })
          .catch((error) => {
            console.log("get user error : ", error);
          });
      } else {
        setUser(null);
        console.log("Auth State Changed failed");
      }
      if (!loaded) {
        setLoaded(true);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loaded, language, changeLanguage }}>
      {children}
    </AuthContext.Provider>
  );
};
