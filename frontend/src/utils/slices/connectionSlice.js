import { createSlice } from '@reduxjs/toolkit'

const connectionSlice = createSlice({
    name: 'connection',
    initialState: null,
    reducers: {
        setConnection: (state, action) => action.payload, 
        removeConnection: () => null,
        removeOneConnection: (state, action) => {
            if (!state) return null;
            return state.filter(conn => conn.connectionId !== action.payload);
        },
    },
})

export const { setConnection, removeConnection, removeOneConnection } = connectionSlice.actions
export default connectionSlice.reducer
