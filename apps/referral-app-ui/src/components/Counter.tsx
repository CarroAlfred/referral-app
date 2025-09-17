import React from 'react';
import { increment, decrement, incrementByAmount, reset } from '../store/slices/counterSlice';
import { useAppSelector, useAppDispatch } from '../store/hooks/hooks';

const Counter: React.FC = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className='p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-center mb-4'>Counter: {count}</h2>
      <div className='space-x-2 text-center'>
        <button
          onClick={() => dispatch(increment())}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          +1
        </button>
        <button
          onClick={() => dispatch(decrement())}
          className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
        >
          -1
        </button>
        <button
          onClick={() => dispatch(incrementByAmount(5))}
          className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
        >
          +5
        </button>
        <button
          onClick={() => dispatch(reset())}
          className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Counter;
