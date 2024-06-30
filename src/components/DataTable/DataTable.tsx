import React, { useEffect, useMemo, useState } from 'react';
import { DataItem } from '../../interfaces/dataTable';
import { generateDataItems } from '../../utils/generateDataItems';
import { calcTotal } from '../../utils/helpers';
import Pagination from '../Pagination/Pagination';

const DataTable: React.FC = () => {
  const [count, setCount] = useState(10000); // Start with some initial data count
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Generate data items based on the count
  const dataItems = useMemo(() => generateDataItems(count), [count]);

  // Process items based on search term
  const processedItems = useMemo(() => {
    return dataItems.reduce<DataItem[]>((acc, item) => {
      if (item.value.toLowerCase().includes(searchTerm.toLowerCase())) {
        const newItem = { ...item, number: item.number * 2 };
        return [...acc, newItem];
      }
      return acc;
    }, []);
  }, [dataItems, searchTerm]);

  // Calculate total value of processed items
  const total = useMemo(() => calcTotal(processedItems), [processedItems]);

  // Pagination logic
  const pageCount = Math.ceil(processedItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [processedItems, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when searchTerm changes
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-5 mt-8">
      <div className="overflow-x-auto">
        <input
          type="text"
          placeholder="Filter items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded shadow mb-4"
        />

        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-gray-100 font-normal text-md">
              <th className="py-2 px-4 border-b">Id</th>
              <th className="py-2 px-4 border-b">Value</th>
              <th className="py-2 px-4 border-b">Number</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {paginatedItems.map((item, index) => (
              <tr key={item.id} className={`border-b border-gray-200 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                <td className="py-2 px-4 text-left whitespace-nowrap">{item.id}</td>
                <td className="py-2 px-4 text-left">{item.value}</td>
                <td className="py-2 px-4 text-left">{item.number}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-800 text-gray-100 font-normal text-md">
              <td className="py-2 px-4 text-left">Total:</td>
              <td className="py-2 px-4 text-left">{total}</td>
              <td className="py-2 px-4 text-left"></td>
            </tr>
          </tfoot>
        </table>

        <div className="flex justify-between items-center mt-4">
           <Pagination
            totalPages={pageCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default DataTable;

 