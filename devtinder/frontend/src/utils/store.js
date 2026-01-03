import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import feedReducer from './slices/feedSlice'
import connectionReducer from './slices/connectionSlice'
import requestReducer from './slices/requestSlice'

const store = configureStore({
    reducer: {
        // Add your reducers here
        user: userReducer,
        feed: feedReducer,
        connection: connectionReducer,
        request: requestReducer,
    },
})

export default store;
