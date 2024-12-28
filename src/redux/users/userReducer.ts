import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { auth, createUserProfileDocument } from "../../firebase/firebase.utils";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { DocumentData, DocumentReference, getDoc } from "firebase/firestore";
interface UserState {
  currentUser: any | null;
  isSigningIn: boolean;
  signUpdone: boolean;
  error: string | null | undefined;
}
//create user account with email and password
interface userData {
  email: string;
  password: string;
}
export const createUserAccount = createAsyncThunk(
  "user/createUserAccountWithPassword",
  async ({ email, password, ...additionalData }: userData) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userRef: DocumentReference<DocumentData, DocumentData> | undefined =
      await createUserProfileDocument(user, additionalData);
    if (userRef) {
      const userSnapshot = await getDoc(userRef);
      return userSnapshot.data();
    } else {
      throw new Error("Failed to create user profile document");
    }
  }
);

export const loginWithEmailAndPassword = createAsyncThunk(
  "user/loginWithEmailAndPassword",
  async ({ email, password }: userData) => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    const userRef: DocumentReference<DocumentData, DocumentData> | undefined =
      await createUserProfileDocument(user.user, {});
    if (userRef) {
      const userSnapshot = await getDoc(userRef);
      const userData = { id: userSnapshot.id, ...userSnapshot.data() };
      return userData;
    } else {
      throw new Error("Failed to create user profile document");
    }
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  await auth.signOut();
});

const initialState: UserState = {
  currentUser: null,
  isSigningIn: false,
  signUpdone: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.isSigningIn = true;
      state.error = null;
    },
    signInSuccess: (state, action: PayloadAction<any | null>) => {
      state.isSigningIn = false;
      state.currentUser = action.payload;
      state.signUpdone = false;
      state.error = null;
    },
    signInFailure: (state, action: PayloadAction<string | null>) => {
      state.isSigningIn = false;
      state.error = action.payload;
    },
    signUpStart: (state) => {
      state.isSigningIn = true;
      state.error = null;
    },
    signUpSuccess: (state) => {
      state.isSigningIn = false;
      state.signUpdone = true;
    },
    signUpFailure: (state, action: PayloadAction<string | null>) => {
      state.isSigningIn = false;
      state.error = action.payload;
    },
    signUpEnd: (state) => {
      state.signUpdone = false;
    },
    signOutStart: () => {},
    signOutSuccess: (state, action: PayloadAction<any | null>) => {
      state.currentUser = action.payload;
    },
    signOutFailure: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUserAccount.fulfilled, (state, action) => {
      state.currentUser = action.payload;
      state.isSigningIn = false;
      state.error = null;
      state.signUpdone = true;
    });
    builder.addCase(createUserAccount.pending, (state) => {
      state.isSigningIn = true;
      state.error = null;
      state.signUpdone = false;
    });
    builder.addCase(createUserAccount.rejected, (state, action) => {
      state.error = action.error.message;
      state.currentUser = null;
    });
    builder.addCase(loginWithEmailAndPassword.fulfilled, (state, action) => {
      state.currentUser = action.payload;
      state.isSigningIn = false;
      state.error = null;
      state.signUpdone = false;
    });
    builder.addCase(loginWithEmailAndPassword.pending, (state) => {
      state.currentUser = null;
      state.error = null;
      state.signUpdone = false;
      state.isSigningIn = true;
    });
    builder.addCase(loginWithEmailAndPassword.rejected, (state, action) => {
      state.error = action.error.message;
      state.currentUser = null;
      state.isSigningIn = false;
      state.signUpdone = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.currentUser = null;
      state.isSigningIn = false;
      state.signUpdone = false;
      state.error = null;
    });
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
  signUpEnd,
} = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectIsSigningIn = (state: RootState) => state.user.isSigningIn;
export const selectSignUpDone = (state: RootState) => state.user.signUpdone;
export const selectError = (state: RootState) => state.user.error;

export default userSlice.reducer;
