
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUserProfile } from '../interfaces/userProfile';

const baseUrl = process.env.REACT_APP_BASE_URL;
const basePath = process.env.REACT_APP_BASE_PATH;

const apiUrl = `${baseUrl}${basePath}`;

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
    endpoints: (builder) => ({
        getAllProfiles: builder.query<IUserProfile[], void>({
            query: () => 'users',
        }),
        getProfile: builder.query<IUserProfile, string>({
            query: (id) => `users/${id}`,
        }),
        createProfile: builder.mutation<IUserProfile, Partial<IUserProfile>>({
            query: (profile) => ({
                url: 'users',
                method: 'POST',
                body: profile,
            }),
            // update the cache after mutation
            async onQueryStarted(profile, { dispatch, queryFulfilled }) {
                try {
                    const { data: createdProfile } = await queryFulfilled;
                    const patchResult = dispatch(
                      api.util.updateQueryData('getAllProfiles', undefined, (draft) => {
                        draft.push(createdProfile);
                      })
                    );
                  } catch (error) {
                    console.error('Failed to create profile:', error);
                  }
            },
        }),
        updateProfile: builder.mutation<IUserProfile, Partial<IUserProfile>>({
            query: ({ _id, ...profile }) => ({
                url: `users/${_id}`,
                method: 'PUT',
                body: profile,
            }),
            async onQueryStarted({ _id, ...profile }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData('getAllProfiles', undefined, (draft) => {
                        const index = draft.findIndex((p) => p._id === _id);
                        if (index !== -1) draft[index] = { ...draft[index], ...profile };
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteProfile: builder.mutation<void, string>({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData('getAllProfiles', undefined, (draft) => {
                        return draft.filter((profile) => profile._id !== id);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetAllProfilesQuery,
    useGetProfileQuery,
    useCreateProfileMutation,
    useUpdateProfileMutation,
    useDeleteProfileMutation,
} = api;
