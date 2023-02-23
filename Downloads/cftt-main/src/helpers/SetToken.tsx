/* eslint-disable require-jsdoc */
import Cookies from 'js-cookie';
import React, { Component } from "react";

class SetTokens {
    static setToken(accessToken: string) {
        Cookies.set('access-token', accessToken, {
            //expires: '',
            path: ''
        });
    }

    static removeTokens() {
        Cookies.remove('access-token', {
            path: ''
        });
    }

    static clearLocalStorage() {
        localStorage.clear();
    }
}

export default SetTokens;
