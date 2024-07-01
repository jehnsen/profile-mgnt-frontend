import React from 'react';
import { DataItem } from '../../interfaces/dataTable';

interface TableProps {
  items: DataItem[];
  total: number;
}

const Table: React.FC<TableProps> = ({ items, total }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg mt-3">
      <thead>
        <tr className="bg-gray-800 text-gray-100 font-normal text-md">
          <th className="py-2 px-4 text-center border-b">Id</th>
          <th className="py-2 px-4 text-center border-b">Value</th>
          <th className="py-2 px-4 text-center border-b">Number</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {items.map((item, index) => (
          <tr key={item.id} className={`border-b border-gray-200 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
            <td className="py-2 px-4 text-center whitespace-nowrap">{item.id}</td>
            <td className="py-2 px-4 text-center">{item.value}</td>
            <td className="py-2 px-4 text-center">{item.number}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="bg-gray-800 text-gray-100 font-normal text-md">
          <td className="py-2 px-4 text-center">Total:</td>
          <td className="py-2 px-4 text-center">{total}</td>
          <td className="py-2 px-4 text-left"></td>
        </tr>
      </tfoot>
    </table>
  );
};

export default React.memo(Table);
