import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReuseInput } from '@locoworks/reusejs-react-input';
import { HeadlessButton } from '@locoworks/reusejs-react-button';

interface Package {
    name: string;
    reason?: string;
}

const AddPackage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        const fetchPackages = async () => {
            if (query) {
                try {
                    const response = await axios.get(`https://api.npms.io/v2/search?q=${query}`);
                    const packages = response.data.results.map((pkg: any) => ({
                        name: pkg.package.name
                    }));
                    setResults(packages);
                    localStorage.setItem('searchResults', JSON.stringify(packages));
                } catch (error) {
                    console.error('Error fetching packages:', error);
                }
            } else {
                setResults([]);
            }
        };

        fetchPackages();
    }, [query]);

    useEffect(() => {
        const storedResults = localStorage.getItem('searchResults');
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    }, []);

    const handleSubmit = () => {
        const newPackage: Package = { name: selectedPackage, reason };
        const storedFavPackages = localStorage.getItem('myFavPackages');
        const favPackages: Package[] = storedFavPackages ? JSON.parse(storedFavPackages) : [];
        favPackages.push(newPackage);
        localStorage.setItem('myFavPackages', JSON.stringify(favPackages));

        setQuery('');
        setSelectedPackage('');
        setReason('');

        console.log('Submitted:', newPackage);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="mb-4">
                <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-2">
                    Search for NPM Packages
                </label>
                <ReuseInput
                    id="search"
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="angular"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Results</label>
                <div className="max-h-32 overflow-y-auto border rounded">
                    {results.map(pkg => (
                        <div key={pkg.name} className="p-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio"
                                    name="package"
                                    value={pkg.name}
                                    checked={selectedPackage === pkg.name}
                                    onChange={() => setSelectedPackage(pkg.name)}
                                />
                                <span className="ml-2">{pkg.name}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="reason" className="block text-gray-700 text-sm font-bold mb-2">
                    Why is this your favorite?
                </label>
                <ReuseInput
                    id="reason"
                    value={reason}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your reason here..."
                />
            </div>
            <div className="flex justify-center">
                <HeadlessButton
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleSubmit}
                >
                    Submit
                </HeadlessButton>
            </div>
        </div>
    );
};

export default AddPackage;
