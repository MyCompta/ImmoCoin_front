import Cookies from 'js-cookie'

// CHECK IF USER IS LOGGED IN
export const isLogged = () => {
    return Cookies.get('auth_token') ? true : false
};

// GET AUTH TOKEN
export const AUTH_TOKEN = Cookies.get('auth_token');

