import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState("Guest");
  const [userRoll, setUserRoll] = useState(null);

    // Function to update user state
    const updateUser = (newType, newRoll) => {
        setUserRoll(newRoll);
        setUserType(newType);
    };

    return (
        <UserContext.Provider value={{ userType, userRoll, updateUser, setUserType, setUserRoll }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
