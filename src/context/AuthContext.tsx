/* eslint-disable curly */
import React, { createContext, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import cafeApi from '../api/cafeApi';
import { Usuario, LoginResponse, LoginData, RegisterData } from '../interfaces/appInterfaces';
import { AuthState, authReducer } from './authReducer';
import { useEffect } from 'react';

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: (registerData: RegisterData) => void;
    signIn: (loginData: LoginData) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: '',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

    const [state, dispatch] = useReducer(authReducer, authInitialState);

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');

        if (!token) return dispatch({ type: 'notAuthenticated' });

        const resp = await cafeApi.get('/auth');

        if (resp.status !== 200) {
            return dispatch({ type: 'notAuthenticated' });
        }

        await AsyncStorage.setItem('token', resp.data.token);

        dispatch({
            type: 'signUp',
            payload: {
                user: resp.data.usuario,
                token: resp.data.token,
            },
        });

    };


    const signUp = async ({ nombre, correo, password }: RegisterData) => {
        try {

            const { data } = await cafeApi.post<LoginResponse>('/usuarios', { nombre, correo, password });

            dispatch({
                type:'signUp',
                payload: {
                    user: data.usuario,
                    token: data.token,
                },
            });

            await AsyncStorage.setItem('token', data.token);

        } catch (error) {
            console.log(error);
            dispatch({
                type: 'addError',
                payload: 'Información incorrecta',
            });
        }
    };

    const signIn = async ({ correo, password }: LoginData) => {

        try {

            const { data } = await cafeApi.post<LoginResponse>('/auth/login', { correo, password });
            dispatch({
                type: 'signUp',
                payload: {
                    user: data.usuario,
                    token: data.token,
                },
            });

            await AsyncStorage.setItem('token', data.token);


        } catch (error) {
            dispatch({
                type: 'addError',
                payload: 'Información incorrecta',
            });
        }

    };

    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({
            type: 'logout',
        });
    };

    const removeError = () => {
        dispatch({
            type: 'removeError',
        });
    };


    return (
        <AuthContext.Provider
            value={{
                ...state,
                signUp,
                signIn,
                logOut,
                removeError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
