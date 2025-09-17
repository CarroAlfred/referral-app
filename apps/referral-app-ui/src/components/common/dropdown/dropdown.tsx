import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { SkeletonList } from '../loaders';

interface DropdownItem {
  id: number | string;
  label: string;
}

interface DropdownProps {
  items: DropdownItem[];
  value?: number | string;
  onChange: (item: DropdownItem) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function Dropdown({ items, value, onChange, isLoading, placeholder = 'Select...' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedItem = items.find((item: DropdownItem) => item.id === value);

  return (
    <div
      ref={containerRef}
      className={`relative ${isLoading ? 'bg-gray-200 text-gray-500 pointer-events-none rounded-md' : ''}`}
    >
      <div
        className='w-full px-2.5 pr-8 py-2 border border-gray-300 rounded-md text-gray-600 text-sm tracking-tight cursor-pointer relative'
        role='button'
        aria-expanded={isOpen}
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        {selectedItem ? selectedItem.label : placeholder}
        <span className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500'>
          <FiChevronDown />
        </span>
      </div>

      {isOpen && (
        <ul className='absolute mt-1 w-full max-h-52 overflow-y-auto border border-gray-300 bg-white rounded-md z-10 p-1'>
          {isLoading ? (
            <SkeletonList count={3} />
          ) : (
            items.map((item: DropdownItem) => (
              <li
                key={item.id}
                className='px-2 py-1.5 cursor-pointer rounded hover:bg-gray-200 hover:text-gray-700'
                role='option'
                aria-selected={item.id === value}
                tabIndex={0}
                onClick={() => {
                  onChange(item);
                  setIsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(item);
                    setIsOpen(false);
                  }
                }}
              >
                {item.label}
              </li>
            ))
          )}
        </ul>
      )}

      {isOpen && items.length === 0 && (
        <div className='absolute top-full left-0 right-0 border border-gray-300 bg-gray-50 p-2 text-gray-400 rounded-md z-10'>
          No options
        </div>
      )}
    </div>
  );
}
