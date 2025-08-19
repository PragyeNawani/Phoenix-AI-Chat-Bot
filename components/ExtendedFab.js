import Link from 'next/link';
import React from 'react';
const ExtendedFab = ({ href = '', text, classes = '', ...rest }) => {
  return (
    <>
      <Link href={href} className={`extended-fab flex ${classes}`}{...rest}>
      
      <img src="plus.svg" className='invert-[1] material-symbols-rounded h-6' alt="add" />
      <span className="truncate">{text}</span>
      <div className="state-layer"></div>
      </Link>
    </>
  );
};


export default ExtendedFab;
