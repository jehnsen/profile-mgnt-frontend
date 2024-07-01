import React from 'react';
import { IUserProfile } from "../../interfaces/userProfile";
import Tag from "../Tags/Tag";
import EditButton from "../ui/EditButton";
import DeleteButton from "../ui/DeleteButton";
import Pagination from "../Pagination/Pagination";

interface UserProfileTableProps {
    profiles: IUserProfile[];
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    handleEdit: (profile: IUserProfile) => void;
    handleDelete: (id: string) => void;
}

const UserProfileTable: React.FC<UserProfileTableProps> = ({
    profiles,
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    handleEdit,
    handleDelete,
}) => {
    const paginatedProfiles = profiles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
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
    );
};

export default UserProfileTable;
