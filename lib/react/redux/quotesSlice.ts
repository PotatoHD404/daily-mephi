import { createSlice } from "redux";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface AuthState {
    authState: boolean;
}

// Initial state
const initialState: AuthState = {
    authState: false,
};

// Actual Slice
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        // Action to set the authentication status
        setAuthState(state: { authState: any; }, action: { payload: any; }) {
            state.authState = action.payload;
        },

        // Special reducer for hydrating the state. Special case for next-redux-wrapper
        extraReducers: {
            [HYDRATE]: (state: any, action: { payload: { auth: any; }; }) => {
                return {
                    ...state,
                    ...action.payload.auth,
                };
            },
        },

    },
});

export const { setAuthState } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth.authState;

export default authSlice.reducer;
