import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IUserProfile } from "../../interfaces/userProfile";
import UserProfileForm from "../UserProfileForm/UserProfileForm";
import DeleteDialog from "../ui/DeleteDialog";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useGetAllProfilesQuery, useDeleteProfileMutation } from "../../api/apiService";
import SearchBox from "../Searchbox/Searchbox";
import UserProfileTable from "./UserProfileTable";

const UserProfileList: React.FC = () => {
    const { data: profiles, error, isLoading } = useGetAllProfilesQuery();
    const [deleteProfile] = useDeleteProfileMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileToEdit, setProfileToEdit] = useState<IUserProfile | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [profileIdToDelete, setProfileIdToDelete] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
        // Reset to first page when search term changes
        setCurrentPage(1);  
    };

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        // Reset to first page when search is cleared
        setCurrentPage(1);  
    }, []);

    const filteredProfiles = useMemo(() => {
        if (!profiles) return [];
        return profiles.filter(profile => 
            profile.name.toLowerCase().includes(searchTerm) ||
            profile.email.toLowerCase().includes(searchTerm) ||
            profile.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }, [profiles, searchTerm]);

    const totalPages = useMemo(() => Math.ceil(filteredProfiles.length / itemsPerPage), [filteredProfiles, itemsPerPage]);

    const handleEdit = useCallback((profile: IUserProfile) => {
        setProfileToEdit(profile);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((id: string) => {
        setProfileIdToDelete(id);
        setIsConfirmModalOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        const response = await deleteProfile(profileIdToDelete);
        if (response) {
            setProfileIdToDelete('');
            setIsConfirmModalOpen(false);
        }
    }, [deleteProfile, profileIdToDelete]);

    if (isLoading) return <LoadingSpinner />;
    if (error) {
        const errorMessage = 'status' in error ? `Error: ${error.status}` : error.message;
        return <div>{errorMessage}</div>;
    }
    
    return (
        <div className="container mx-auto p-5 mt-8">
            <div className="flex justify-between items-center mb-4">
                <SearchBox 
                    searchTerm={searchTerm} 
                    handleSearch={handleSearch} 
                    clearSearch={clearSearch} 
                />
                <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ml-4">
                    Create New
                </button>
            </div>

            <UserProfileTable
                profiles={filteredProfiles}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />

            <UserProfileForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                profileToEdit={profileToEdit}
            />
            <DeleteDialog
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this profile?"
            />
        </div>
    );
};

export default UserProfileList;
