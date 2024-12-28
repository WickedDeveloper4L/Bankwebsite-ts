import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./users/userReducer";
import withdrawalReducer from "./withdrawal/withdrawal.reducer";
export const store = configureStore({
  reducer: {
    user: userReducer,
    withdrawal: withdrawalReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
