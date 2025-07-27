import React from 'react';
import { useRecoilValue } from 'recoil';
import { loadingState } from '../../recoil/userAtom';

function GlobalLoader() {
  const isLoading = useRecoilValue(loadingState);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-teal-600 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-gray-800 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-4 h-4 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
      </div>
    </div>
  );
}

export default GlobalLoader;
