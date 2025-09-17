import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable, Column } from './table';

interface User {
  // mock
  id: number;
  name: string;
  email: string;
}

const columns: Column<User>[] = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
];

const sampleData: User[] = [
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' },
];

describe('DataTable', () => {
  it('renders headers correctly', () => {
    render(
      <DataTable
        data={sampleData}
        columns={columns}
        keyField='id'
      />,
    );
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders rows with data', () => {
    render(
      <DataTable
        data={sampleData}
        columns={columns}
        keyField='id'
      />,
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows noDataMessage when no data', () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        keyField='id'
        noDataMessage='Nothing here'
      />,
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = jest.fn();
    render(
      <DataTable
        data={sampleData}
        columns={columns}
        keyField='id'
        onEdit={handleEdit}
      />,
    );
    fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    expect(handleEdit).toHaveBeenCalledWith(sampleData[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(
      <DataTable
        data={sampleData}
        columns={columns}
        keyField='id'
        onDelete={handleDelete}
      />,
    );
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    expect(handleDelete).toHaveBeenCalledWith(sampleData[0]);
  });

  it('renders pagination and handles page change', () => {
    const handlePageChange = jest.fn();
    render(
      <DataTable
        data={sampleData}
        columns={columns}
        keyField='id'
        pagination={{ total: 10, limit: 2, offset: 0 }}
        onPageChange={handlePageChange}
      />,
    );

    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('disables prev button on first page and next button on last page', () => {
    const { rerender } = render(
      <DataTable
        data={sampleData}
        columns={columns}
        keyField='id'
        pagination={{ total: 4, limit: 2, offset: 0 }}
        onPageChange={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();

    rerender(
      <DataTable
        data={sampleData}
        columns={columns}
        keyField='id'
        pagination={{ total: 4, limit: 2, offset: 2 }}
        onPageChange={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});
