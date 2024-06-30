import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IUserProfile } from "../../interfaces/userProfile";
import UserProfileForm from "../UserProfileForm/UserProfileForm";
import EditButton from "../ui/EditButton";
import DeleteButton from "../ui/DeleteButton";
import DeleteDialog from "../ui/DeleteDialog";
import Tag from "../Tags/Tag";
import Pagination from "../Pagination/Pagination";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useGetAllProfilesQuery, useDeleteProfileMutation } from "../../api/apiService";

const UserProfileList: React.FC = () => {
    console.log(`UserProfileList Component rendered `);

    const { data: profiles, error, isLoading } = useGetAllProfilesQuery();
    const [deleteProfile] = useDeleteProfileMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileToEdit, setProfileToEdit] = useState<IUserProfile | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [profileIdToDelete, setProfileIdToDelete] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    }, []);

    const filteredProfiles = useMemo(() => {
        if (!profiles) return [];
        return profiles.filter(profile => 
            profile.name.toLowerCase().includes(searchTerm) ||
            profile.email.toLowerCase().includes(searchTerm) ||
            profile.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }, [profiles, searchTerm]);
    
    const paginatedProfiles = useMemo(() => filteredProfiles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ), [filteredProfiles, currentPage, itemsPerPage]);

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

    const renderCount = useRef(0);

    useEffect(() => {
        renderCount.current += 1;
        console.log(`UserProfileList Component rendered ${renderCount.current} times`);
    }, []);

    if (isLoading) return <LoadingSpinner />;
    if (error) {
        const errorMessage = 'status' in error ? `Error: ${error.status}` : error.message;
        return <div>{errorMessage}</div>;
    }

    return (
        <div className="container mx-auto p-5 mt-8">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search profiles..."
                    onChange={handleSearch}
                    className="w-1/2 p-2 border border-gray-300 hover:border-gray-600 rounded-md"
                />
                <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ml-4">
                    Create New
                </button>
            </div>

            <div className="overflow-x-auto">

                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-800 text-gray-100 font-normal text-md">
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Age</th>
                            <th className="py-2 px-4 border-b">Tags</th>
                            <th className="py-2 px-4 border-b"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProfiles.map((profile) => (
                            <tr key={profile._id} className="text-center hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{profile.name}</td>
                                <td className="py-2 px-4 border-b">{profile.email}</td>
                                <td className="py-2 px-4 border-b">{profile.age}</td>
                                <td className="py-2 px-4 border-b">
                                    {profile.tags && profile.tags.map((tag, index) => (
                                        <Tag key={index} tag={tag} />
                                    ))}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <EditButton onHandleEdit={() => handleEdit(profile)} />
                                    <DeleteButton onHandleDelete={() => profile._id && handleDelete(profile._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination 
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
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

export default UserProfileList