import {createContext} from 'react';

function empty() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    role: null,
    orgId: null,
    login: empty,
    logout: empty,
    isAuthenticated: false
});