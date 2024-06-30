import { IUserProfile } from '../interfaces/userProfile';
import apiClient, { handleApiError } from './apiClient';

export const getAllProfiles = async (): Promise<IUserProfile[]> => {
    try {
        const response = await apiClient.get(`/users`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        return []
    }
};

export const getProfile = async (id: string): Promise<IUserProfile[]> => {
    try {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        return []
    }
};

export const createProfile = async (profile: IUserProfile): Promise<IUserProfile> => {
    try {
        const response = await apiClient.post(`/users/`, profile);
        return response.data;
    } catch (error) {
        handleApiError(error);
        return {} as IUserProfile;
    }
};

export const updateProfile = async (profile: IUserProfile): Promise<IUserProfile> => {
    try {
        const response = await apiClient.put(`/users/${profile?._id}`, profile);
        return response.data;
    } catch (error) {
        handleApiError(error);
        return {} as IUserProfile;
    }
};

export const deleteProfile = async (id: string): Promise<IUserProfile> => {
    try {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        return {} as IUserProfile;
    }
};
