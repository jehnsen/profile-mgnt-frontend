import React from 'react';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-md w-full">
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          <h2 className="text-white">Confirm Delete</h2>
          <button className="text-white" onClick={onClose}>X</button>
        </div>
        <div className="p-6">
          <p className="mb-4">{message}</p>
          <div className="flex justify-end">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
