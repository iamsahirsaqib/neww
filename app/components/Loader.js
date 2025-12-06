import React from 'react';

const Loader = () => {
  return (
    <div className="ecom-loader-overlay">
      <div className="ecom-loader">
        <div className="loader-circle">
          <span className="loader-icon loader-icon-1">➤</span>
          <span className="loader-icon loader-icon-2">🛒</span>
          <span className="loader-icon loader-icon-3">😊</span>
        </div>
        <div className="loader-text">Click. Shop. Smile.</div>
      </div>
    </div>
  );
};

export default Loader;