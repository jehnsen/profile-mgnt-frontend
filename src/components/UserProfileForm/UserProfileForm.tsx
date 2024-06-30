import React, { useEffect, useState } from 'react';
import { IUserProfile, ModalFormProps } from "../../interfaces/userProfile";
import { useCreateProfileMutation, useUpdateProfileMutation } from "../../api/apiService";
import SuccessMessage from '../ui/Success';

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose, profileToEdit }) => {
  const initialProfileState: IUserProfile = {
    name: "",
    email: "",
    age: 0,
    tags: [],
  };

  const [profile, setProfile] = useState<IUserProfile>(initialProfileState);
  const [tagInput, setTagInput] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [createProfile] = useCreateProfileMutation();
  const [updateProfile] = useUpdateProfileMutation();

  useEffect(() => {
    setIsSuccess(false);
    if (profileToEdit) {
      setProfile(profileToEdit);
    } else {
      setProfile(initialProfileState);
    }
  }, [profileToEdit]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!profile.name) newErrors.name = "Name is required";
    if (!profile.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(profile.email)) newErrors.email = "Email is invalid";
    if (!profile.age) newErrors.age = "Age is required";
    else if (profile.age <= 0) newErrors.age = "Age must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: name === "age" ? parseInt(value) : value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !profile.tags.includes(tagInput.trim())) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        tags: [...prevProfile.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      tags: prevProfile.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (profile._id) {
        await updateProfile(profile);
      } else {
        await createProfile(profile);
      }
      
      setIsSuccess(true);

      // Reset the form
      setProfile(initialProfileState);
      setTagInput('');

      // Optionally close the modal after a delay
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ form: 'Failed to submit form. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          <h2 className="text-white">{profile._id ? "Update" : "New"} User</h2>
          <button className="text-white" onClick={onClose}>X</button>
        </div>
        {isSuccess 
        ? <SuccessMessage /> 
        : <form className="p-6" onSubmit={handleSubmit}>
          {errors.form && <div className="text-red-500 mb-4">{errors.form}</div>}
         
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className={`mt-1 p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={profile.name}
              onChange={handleChange}
              required
            />
            {errors.name && <div className="text-red-500">{errors.name}</div>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className={`mt-1 p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={profile.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="text-red-500">{errors.email}</div>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              className={`mt-1 p-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={profile.age}
              onChange={handleChange}
              required
            />
            {errors.age && <div className="text-red-500">{errors.age}</div>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tags</label>
            <div className="flex">
              <input
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <button
                type="button"
                className="ml-2 bg-blue-500 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleAddTag}
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap">
              {profile.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-green-200 text-green-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-red-500 focus:outline-none"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
              disabled={submitting}
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
          </form>}
      </div>
    </div>
  );
};

export default React.memo(ModalForm);
