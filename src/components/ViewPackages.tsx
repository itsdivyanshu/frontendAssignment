import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; 

interface Package {
    name: string;
    reason: string;
}

const ViewPackages: React.FC = () => {
    const [favPackages, setFavPackages] = useState<Package[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editReason, setEditReason] = useState<string>('');
    const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const storedFavPackages = localStorage.getItem('myFavPackages');
        if (storedFavPackages) {
            const parsedPackages: Package[] = JSON.parse(storedFavPackages);
            // Filtering unique packages and remove empty named packages
            const uniquePackages = Array.from(new Set(parsedPackages.map(pkg => pkg.name)))
                .map(name => {
                    return parsedPackages.find(pkg => pkg.name === name) as Package;
                })
                .filter(pkg => pkg.name.trim() !== ''); // Ensuring no empty named packages

            setFavPackages(uniquePackages);
            localStorage.setItem('myFavPackages', JSON.stringify(uniquePackages));
        }
    }, []);

    const handleDelete = (name: string) => {
        const updatedPackages = favPackages.filter(pkg => pkg.name !== name);
        setFavPackages(updatedPackages);
        localStorage.setItem('myFavPackages', JSON.stringify(updatedPackages));
        setDeleteCandidate(null);
    };

    const handleEdit = (pkg: Package) => {
        setIsEditing(pkg.name);
        setEditReason(pkg.reason);
    };

    const handleSave = (name: string) => {
        if (name.trim() === '') {
            setErrorMessage('Package name cannot be empty.');
            return;
        }

        const updatedPackages = favPackages.map(pkg =>
            pkg.name === name ? { ...pkg, reason: editReason } : pkg
        );
        setFavPackages(updatedPackages);
        localStorage.setItem('myFavPackages', JSON.stringify(updatedPackages));
        setIsEditing(null);
        setEditReason('');
        setErrorMessage('');
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Your Fav NPM Packages</h1>
            {favPackages.length === 0 ? (
                <div className="border rounded p-4 text-center">
                    <p className="mb-4">You don't have any favs yet.</p>
                    <Link to="/add-new-package" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                        Add Fav
                    </Link>
                </div>
            ) : (
                <div>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Package Name</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {favPackages.map(pkg => (
                                <tr key={pkg.name}>
                                    <td className="py-2 px-4 border-b">
                                        {pkg.name}
                                    </td>
                                    <td className="py-2 px-4 border-b flex justify-around">
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => alert(`Reason: ${pkg.reason}`)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            className="text-yellow-500 hover:text-yellow-700"
                                            onClick={() => handleEdit(pkg)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => setDeleteCandidate(pkg.name)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isEditing && (
                        <div className="mt-4">
                            <label htmlFor="editReason" className="block text-gray-700 text-sm font-bold mb-2">
                                Edit Reason
                            </label>
                            <input
                                id="editReason"
                                type="text"
                                value={editReason}
                                onChange={(e) => setEditReason(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                                    onClick={() => handleSave(isEditing)}
                                >
                                    Save
                                </button>
                                <button
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => {
                                        setIsEditing(null);
                                        setEditReason('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                            {errorMessage && (
                                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                            )}
                        </div>
                    )}
                    {deleteCandidate && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                            <div className="bg-white rounded p-4">
                                <p className="mb-4">Are you sure you want to delete this package?</p>
                                <div className="flex justify-end">
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                        onClick={() => handleDelete(deleteCandidate)}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => setDeleteCandidate(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewPackages;
