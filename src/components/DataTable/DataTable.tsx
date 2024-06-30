import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DataItem } from '../../interfaces/dataTable';
import { generateDataItems } from '../../utils/generateDataItems';
import { calcTotal } from '../../utils/helpers';


const useRenderLogger = () => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`DataTable Component rendered ${renderCount.current} times`);
  });
};

interface ExpensiveComponentProps {
  value: number;
}
const ExpensiveComponent: React.FC<ExpensiveComponentProps> = ({ value }) => {
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
    console.log(`Expensive Component rendered ${renderCount.current} times`);
  })

  const computeExpensiveValue = (num: number) => {
    console.log('Computing expensive value...');
    let total = 0;
    for (let i = 0; i < 1000000000; i++) {
      total += num;
    }
    return total;
  };

  const memoizedValue = useMemo(() => computeExpensiveValue(value), [value]);

  return <div>Expensive Value: {memoizedValue}</div>;
};


const DataTable: React.FC = () => {

  useRenderLogger()
  const [value, setValue] = useState(1);
  const [count, setCount] = useState(0);
  /// =================================================================

  //const [count, setCount] = useState(1000); // Example count value

  
  // Memoize the generated data items,
  // so that they don't need to be re-generated on every render.
  const memoizedDataItems = useMemo(() => generateDataItems(count), [count]);
  const [dataItems, setDataItems] = useState<DataItem[]>(memoizedDataItems);
  const total = useMemo(() => calcTotal(dataItems), [dataItems]);
  const [searchTerm, setSearchTerm] = useState("");
console.log("total: " + total);
 

  // const processedItems = (() => {
  //   return dataItems.reduce<DataItem[]>((acc, item) => {
  //     if (item.value.toLowerCase().includes(searchTerm.toLowerCase())) {
  //       const newItem = { ...item, number: item.number * 2 };
  //       return [...acc, newItem];
  //     }
  //     return acc;
  //   }, []);
  // })();

  // improved using useMemo
  const processedItems = useMemo(() => {
    return dataItems.reduce<DataItem[]>((acc, item) => {
      if (item.value.toLowerCase().includes(searchTerm.toLowerCase())) {
        const newItem = { ...item, number: item.number * 2 };
        return [...acc, newItem];
      }
      return acc;
    }, []);
  }, [dataItems, searchTerm]);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = dataItems.filter((item) =>
    item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // const handlePrevPage = () => {
  //   setCurrentPage((prev) => Math.max(prev - 1, 1));
  // };

  // const handleNextPage = () => {
  //   setCurrentPage((prev) => Math.min(prev + 1, pageCount));
  // };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 4;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPagesToShow);
    let endPage = Math.min(pageCount, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button key={1} onClick={() => handlePageClick(1)} className={`bg-blue-700 border rounded px-3 py-1 ${currentPage === 1 ? 'bg-blue-500 text-blue-800' : 'text-gray-700'}`}>
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="dots1" className="px-3 py-1">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`bg-gray-800 border rounded px-3 py-1 ${currentPage === i ? 'bg-gray-400 text-gray-800' : 'text-gray-700'}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < pageCount) {
      if (endPage < pageCount - 1) {
        pageNumbers.push(<span key="dots2" className="px-3 py-1">...</span>);
      }
      pageNumbers.push(
        <button key={pageCount} onClick={() => handlePageClick(pageCount)} className={`bg-blue-800 border rounded px-3 py-1 ${currentPage === pageCount ? 'bg-blue-500 text-blue-800' : 'text-gray-700'}`}>
          {pageCount}
        </button>
      );
    }

    return pageNumbers;
  };

  const onScroll = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const newStartIndex = Math.floor(scrollTop / RowHeight);
      setStartIndex(newStartIndex);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', onScroll);
      return () => container.removeEventListener('scroll', onScroll);
    }
  }, [onScroll]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    setStartIndex(0);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    setStartIndex(0);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  const RowHeight = 35;
  const VisibleRowCount = 10; // Number of rows to display at once
  const ItemsPerPage = 50; // Number of items per page
  const totalPages = Math.ceil(dataItems.length / ItemsPerPage);
  const currentItems = memoizedDataItems.slice(
    (currentPage - 1) * ItemsPerPage,
    currentPage * ItemsPerPage
  );

  const totalHeight = currentItems.length * RowHeight;
  const visibleItems = currentItems.slice(
    startIndex,
    startIndex + VisibleRowCount
  );

  return (

    <div className="flex flex-col items-center min-h-screen">

      <input
        type="text"
        placeholder="Filter items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 mt-8 border rounded shadow mb-1"
      />
      <div className="w-full max-w-4xl overflow-x-auto mt-3">

        <button className='mt- 10 bg-green-500 border-green-800' onClick={() => setCount(count + 100)}>Increase Count {memoizedDataItems.length}</button>
        <ExpensiveComponent value={value} />
        <button className='mt- 10 bg-green-500 border-green-800' onClick={() => setValue(value + 1)}>Increase Value</button>
        <button className='mt- 10 bg-green-500 border-green-800 m-2' onClick={() => setCount(count + 1)}>Increase Count</button>

        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Id</th>
              <th className="py-3 px-6 text-left">Value</th>
              <th className="py-3 px-6 text-left">Number</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {visibleItems.map((item, index) => (
              <tr key={item.id} className={`border-b border-gray-200 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                <td className="py-3 px-6 text-left whitespace-nowrap">{item.id}</td>
                <td className="py-3 px-6 text-left">{item.value}</td>
                <td className="py-3 px-6 text-left">{item.number}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <td className="py-3 px-6 text-left">Total:</td>
              <td className="py-3 px-6 text-left">{total}</td>
              <td className="py-3 px-6 text-left"></td>
            </tr>
          </tfoot>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {renderPageNumbers()}
          </div>
          <button
            onClick={handleNextPage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={currentPage === pageCount}
          >
            Next
          </button>
        </div>
      </div>
    </div>




    // <div className="w-full max-w-4xl overflow-x-auto mt-8 min-h-full">

    //   <input
    //           type="text"
    //           placeholder="Filter items..."
    //           value={searchTerm}
    //           onChange={(e) => setSearchTerm(e.target.value)}
    //           className="px-4 py-2 border rounded shadow mb-4"
    //         />

    //   <table className="min-w-full bg-green-300 border border-gray-300 shadow-md rounded-lg ">
    //     <thead>
    //       <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
    //         <th className="py-3 px-6 text-left">Id</th>
    //         <th className="py-3 px-6 text-left">Value</th>
    //         <th className="py-3 px-6 text-left">Number</th>
    //       </tr>
    //     </thead>
    //     <tbody className="text-gray-600 text-sm font-light">
    //       <div
    //         ref={containerRef}
    //         className="overflow-y-auto"
    //         style={{ height: VisibleRowCount * RowHeight }}
    //       >
    //         <div
    //           style={{ height: totalHeight, position: 'relative' }}
    //         >
    //           {visibleItems.map((item, index) => (
    //             <div
    //               key={item.id}
    //               className={`flex items-center p-2 border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
    //               style={{ position: 'absolute', top: (startIndex + index) * RowHeight, width: '100%' }}
    //             >
    //               <div className="w-1/3">{item.id}</div>
    //               <div className="w-1/3">{item.value}</div>
    //               <div className="w-1/3">{item.number}</div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //     </tbody>
    //   </table>
    //   <div className="flex justify-between items-center mt-4">
    //     <button
    //       onClick={handlePrevPage}
    //       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    //       disabled={currentPage === 1}
    //     >
    //       Previous
    //     </button>
    //     <span>
    //       Page {currentPage} of {totalPages}
    //     </span>
    //     <button
    //       onClick={handleNextPage}
    //       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    //       disabled={currentPage === totalPages}
    //     >
    //       Next
    //     </button>
    //   </div>
    // </div>



  );
};

export default DataTable