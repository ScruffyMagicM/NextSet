'use client';

export default function TimeDivider({hour}: {hour: number}) {
    return (
        <div className="w-16 border-t border-gray-300 my-4">
            <div className="bg-white px-2 text-gray-500 text-sm">{hour}</div>
            <div className="h-1 w-full"></div>
        </div>
    );
}
