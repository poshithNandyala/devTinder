
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        login: (state, action) => {
            // store token in localStorage for socket auth
            if (action.payload?.token) {
                localStorage.setItem('token', action.payload.token);
            }
            return action.payload;
        },
        logout: () => {
            localStorage.removeItem('token');
            return null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
