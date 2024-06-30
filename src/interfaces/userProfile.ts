export interface IUserProfile {
    _id?: string;
    name: string;
    email: string;
    age: number;
    tags: string[];
}

export interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  profileToEdit?: IUserProfile | null;
}

export interface UserProfileState {
    profiles: IUserProfile[];
    isLoading: boolean;
    error: any;
}

// If you need a different interface for creating/updating profiles
export interface IUserProfileInput {
    name: string;
    email: string;
    age: number;
}