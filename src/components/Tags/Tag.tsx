import React from 'react'
import { tagColorClasses } from '../../constants';

interface TagProps {
  tag: string;
  key?: number;
}

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