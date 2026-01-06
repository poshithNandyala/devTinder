import { createSlice } from '@reduxjs/toolkit'

const connectionSlice = createSlice({
    name: 'connection',
    initialState: null,
    reducers: {
        setConnection: (state, action) => action.payload, 
        removeConnection: () => null,
    },
})

export const { setConnection, removeConnection } = connectionSlice.actions
export default connectionSlice.reducer
