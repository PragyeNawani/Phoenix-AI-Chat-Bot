import Link from 'next/link';
import React from 'react';

const IconBtn = ({ classes = '', icon, size = '', children, ...rest }) => {
  return (
    <>
      <button
        className={`icon-btn ${size} ${classes}`}
        {...rest}
      >
        {children}
        {!children && (<img src='hamb.svg' className='invert-[1] `material-symbols-rounded icon' alt='menu'/>
        )}
        <div className='state-layer'></div>
      </button>
    </>
  );
};


export default IconBtn;
