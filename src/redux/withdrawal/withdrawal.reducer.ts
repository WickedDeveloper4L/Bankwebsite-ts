import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleWithdrawals } from "../../firebase/firebase.utils";

interface WithdrawalState {
  isPaying: boolean;
  error: string | null;
  withdrawal: string | null | any;
}

export const processWithdrawal = createAsyncThunk(
  "withdrawal/processWithdrawal",
  async (data: any) => {
    const { user } = data;
    const response = await handleWithdrawals(user, data);
    return response;
  }
);

const initialState: WithdrawalState = {
  isPaying: false,
  withdrawal: null,
  error: null,
};

const withdrawalSlice = createSlice({
  name: "withdrawal",
  initialState,
  reducers: {
    withdrawalSuccess: (state, action: PayloadAction<any>) => {
      state.isPaying = false;
      state.withdrawal = action.payload;
    },
    withdrawalFailure: (state, action) => {
      state.isPaying = false;
      //   state.error = action.payload;
    },
    withdrawalStart: (state, action) => {
      state.isPaying = true;
      //   state.error = null;
    },
  },
});

export const { withdrawalFailure, withdrawalStart, withdrawalSuccess } =
  withdrawalSlice.actions;

export const selectWithdrawal = (state: RootState) =>
  state.withdrawal.withdrawal;
export const selectIsPaying = (state: RootState) => state.withdrawal.isPaying;
export const selectWithdrawalError = (state: RootState) =>
  state.withdrawal.error;
export default withdrawalSlice.reducer;
