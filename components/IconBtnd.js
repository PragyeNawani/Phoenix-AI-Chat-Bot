import Link from 'next/link';
import React from 'react';

const IconBtnd = ({ classes = '', icon, size = '', children, ...rest }) => {
  return (
    <>
      <button
        className={`icon-btn ${size} ${classes}`}
        {...rest}
      >
        {children}
        {!children && (<img src='delete.svg' className='invert-[1] material-symbols-rounded icon h-5 ' alt='delete'/>)}
        <div className='state-layer'></div>
      </button>
    </>
  );
};


export default IconBtnd;