const apiUrl = import.meta.env.VITE_API_URL;

// REGISTER FETCH
export const registerFetch = async (email, password) => {
    try {
        const data = {
            user: {
                email: email,
                password: password
            }
        };
        const response = await fetch(apiUrl + '/users', { // SET APPROPRIATE URL
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Register failed. Please check your credentials and try again.');
        }

        return response
    } catch (error) {
        return error;
    }
}

// LOGIN FETCH 
export const loginFetch = async (email, password) => {
    try {
        const data = { // ADAPTER LES BODY A TRANSMETTRE A L'API
            user: {
                email: email,
                password: password
            }
        };

        const response = await fetch(apiUrl + '/users/sign_in', { // SET APPROPRIATE URL
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials and try again.');
        }

        return response
    } catch (error) {
        return error
    }
}

// FORGOT PASSWORD FETCH 
export const forgotPasswordFetch = async (email) => {
    try {
        const data = {
            user: {
                email: email
            }
        };

        const response = await fetch(apiUrl + '/users/password', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Forgot password failed. Please check your credentials and try again.');
        }

        return response
    } catch (error) {
        return error
    }
}

// RESET PASSWORD FETCH 
export const resetPasswordFetch = async (token, password, password_confirmation) => {
    try {
        const data = {
            user: {
                reset_password_token: token,
                password: password,
                password_confirmation: password_confirmation
            }
        };
        console.log('data:', JSON.stringify(data))
        const response = await fetch(apiUrl + '/users/password', {
            //mode: 'no-cors',
            method: 'PATCH', // MAJUSCULE !!!
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Reset password failed. Please check your credentials and try again.');
        }

        return response
    } catch (error) {

        return error
    }
}

