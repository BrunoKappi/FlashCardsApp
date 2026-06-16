import React from 'react';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div className="bg-red-600 flex flex-row justify-start h-4 w-40 overflow-hidden rounded-full shadow-inner">            
            <div className="bg-green-600 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
    );
};

export default ProgressBar;
