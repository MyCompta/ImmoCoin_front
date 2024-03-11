import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'


const initialState = {
  isLogged: !!Cookies.get('auth_token')
}

export const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isLogged = true
    },
    logout: (state) => {
      state.isLogged = false
    },
  },
})

export const { login, logout } = authReducer.actions

export default authReducer.reducer