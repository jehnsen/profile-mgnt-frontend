// src/components/DataTable/DataTable.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { generateDataItems } from '../../utils/generateDataItems';
import { calcTotal } from '../../utils/helpers';
import Table from './Table';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../Searchbox/Searchbox';
import { DataItem } from '../../interfaces/dataTable';
import { debounce } from '../../utils/debounce';

const DataTable: React.FC = () => {
  const [count, setCount] = useState(1000000);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const dataItems = useMemo(() => generateDataItems(count), [count]);

  const processedItems = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return dataItems.reduce<DataItem[]>((acc, item) => {
      if (item.value.toLowerCase().includes(lowerCaseSearchTerm)) {
        acc.push({ ...item, number: item.number * 2 });
      }
      return acc;
    }, []);
  }, [dataItems, searchTerm]);

  const total = useMemo(() => calcTotal(processedItems), [processedItems]);

  const pageCount = useMemo(() => Math.ceil(processedItems.length / itemsPerPage), [processedItems, itemsPerPage]);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [processedItems, currentPage, itemsPerPage]);

  const debouncedSearch = useCallback(debounce((value: string) => {
    setSearchTerm(value);
  }, 120), []);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-5 mt-8">
      <div className="overflow-x-auto">
        <SearchBox
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
        />

        <Table items={paginatedItems} total={total} />

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
