interface SkeletonListProps {
  count?: number;
}

export function SkeletonList({ count = 5 }: SkeletonListProps) {
  return (
    <ul className='list-none p-0 m-0 w-full'>
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className='flex items-center gap-3 py-2'
        >
          <div className='flex-1 flex flex-col gap-1'>
            <div className='h-2 rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer  w-1/3' />
            <div className='h-2 rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer  w-4/5' />
          </div>
        </li>
      ))}
    </ul>
  );
}
