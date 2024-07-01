// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { IUserProfile, UserProfileState } from '../../interfaces/userProfile';
// import { RootState } from '../../store/store';
// import { getAllProfiles } from '../../api/userApi';

// const initialState: UserProfileState = {
//     profiles: [],
//     isLoading: false,
//     error: undefined
// };

// export const fetchUsers = createAsyncThunk(
//     'users/fetchUsers',
//     async () => {
//       const response: any = await getAllProfiles()
//       return response;
//     }
//   )

// const userProfileSlice = createSlice({
//     name: 'userProfile',
//     initialState,
//     reducers: {
//         addUserProfile: (state, action: PayloadAction<any>) => {
//             state.profiles.push(action.payload);
//         },
//         editUserProfile: (state, action: PayloadAction<IUserProfile>) => {
//             const index = state.profiles.findIndex(profile => profile?._id === action.payload?._id);
//             if (index !== -1) {
//                 state.profiles[index] = action.payload;
//             }
//         },
//         deleteUserProfile: (state, action: PayloadAction<string>) => {
//             state.profiles = state.profiles.filter(profile => profile?._id !== action.payload);
//         },
//     },
//     extraReducers: (builder) => {
//         builder.addCase(fetchUsers.pending, state => {
//             state.isLoading = true;
//         });
//         builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<Array<any>>) => {
//             state.isLoading = false;
//             state.profiles = action.payload;
//         });
//         builder.addCase(fetchUsers.rejected, (state, action) => {
//             state.error = action.error.message;
//             state.profiles = [];
//             state.isLoading = false;
//         });
//     }
// });

// export const { addUserProfile, editUserProfile, deleteUserProfile } = userProfileSlice.actions;
// export const userProfileSelector = (state: RootState) => state.userProfile;
// export const userProfileReducer = userProfileSlice.reducer;
export {};