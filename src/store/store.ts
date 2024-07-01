import { configureStore } from '@reduxjs/toolkit';
// import { userProfileReducer } from '../features/userProfile/userProfileSlice';
import { api } from '../api/apiService';

export const store = configureStore({
  reducer: {
    // userProfile: userProfileReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck:false}).concat(api.middleware),
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;