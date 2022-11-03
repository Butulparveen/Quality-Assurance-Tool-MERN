//SJSU CMPE 138 Spring 2022 TEAM3 

import React, {useState, useEffect, createContext} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';


export const AuthContext =  createContext();

const ProvideAuth = props => {
    const [user, setUser] = useState(props.value.user);
    const [authState, setAuthState] = useState(props.value.authState);

    const updateLocalStorage = (user, token) => {
        window.localStorage.setItem('user', JSON.stringify(user));
    }

    const logout = () => {
        window.localStorage.removeItem('user');
        setAuthState(false);
    }

    useEffect(()=>{
        // getAuthentication();
    }, []);


    return (
        <AuthContext.Provider value={{isAuthenticated: authState, user, setUser, setAuthState, updateLocalStorage, logout}}>
            {props.children}
        </AuthContext.Provider>
    );
}


export default ProvideAuth;