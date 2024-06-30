import React from 'react'

interface TagProps {
  tag: string;
  key?: number;
}

const tagColorClasses: { [key: string]: string } = {
  scoring: 'text-green-700 bg-green-50 ring-green-600/20',
  shooting: 'text-teal-700 bg-teal-50 ring-teal-600/20',
  playmaking: 'text-yellow-700 bg-yellow-50 ring-yellow-600/20',
  rebounding: 'text-red-700 bg-red-50 ring-red-600/20',
  defense: 'text-blue-700 bg-blue-50 ring-blue-600/20',
  passing: 'text-indigo-700 bg-indigo-50 ring-indigo-600/20',
  dunking: 'text-pink-700 bg-pink-50 ring-pink-600/20',
  athleticism: 'text-orange-700 bg-orange-50 ring-orange-600/20',
  others: 'text-gray-700 bg-gray-50 ring-gray-600/20',
};

const Tag: React.FC<TagProps> = ({ tag }) => {
  const colorClass = tagColorClasses[tag.toLowerCase()] || tagColorClasses['others'];

  return (
    <span 
    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset mx-1 ${colorClass}`}>
      {tag}
  </span>
  )
}

export default Tag