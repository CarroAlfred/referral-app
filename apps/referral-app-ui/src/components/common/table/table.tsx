import { ReactNode } from 'react';
import { Button } from '../button';
import { Card } from '../card';
import { Typography } from '../typography';
import { FiDelete, FiEdit } from 'react-icons/fi';

export interface Column<T> {
  header: string | ReactNode;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
  onPageChange?: (page: number) => void;
  noDataMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyField,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  noDataMessage = 'No data found',
}: DataTableProps<T>) {
  const limit = pagination?.limit || 1;
  const total = pagination?.total || 0;
  const offset = pagination?.offset || 0;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <Card className='p-4 overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200 table-auto'>
        <thead className='bg-gray-50'>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-2 text-left text-sm font-semibold text-gray-600 whitespace-nowrap ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className='px-4 py-2 text-center text-sm font-semibold text-gray-600 whitespace-nowrap'>Actions</th>
            )}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={String(row[keyField])}>
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-2 text-sm text-left text-gray-800 whitespace-nowrap ${col.className || ''}`}
                  >
                    {typeof col.accessor === 'function' ? col.accessor(row) : ((row[col.accessor] as ReactNode) ?? '')}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className='px-4 py-2 text-center flex flex-wrap justify-center gap-2'>
                    {onEdit && (
                      <Button
                        size='sm'
                        variant='outline'
                        icon={<FiEdit />}
                        onClick={() => onEdit(row)}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size='sm'
                        icon={<FiDelete />}
                        variant='secondary'
                        onClick={() => onDelete(row)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className='px-4 py-2 text-center text-gray-500'
              >
                {noDataMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && onPageChange && (
        <div className='flex flex-col sm:flex-row justify-between items-center mt-4 text-sm gap-2 sm:gap-0'>
          <Typography variant='body'>
            Page {currentPage} of {totalPages}
          </Typography>
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='secondary'
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Prev
            </Button>
            <Button
              size='sm'
              variant='secondary'
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
