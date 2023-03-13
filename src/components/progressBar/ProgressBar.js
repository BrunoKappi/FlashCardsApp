import React from 'react';

const ProgressBar = ({ progress }) => {
    return (
        <div className="PlayingProgressBar">            
            <div className="PlayingProgress" style={{ width: `${progress}%` }}>
                <p>{progress}</p>
            </div>
        </div>
    );
};

export default ProgressBar;
