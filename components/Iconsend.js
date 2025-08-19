import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
const Iconsend = ({ classes = '', icon, size = '', children, ...rest }) => {
  return (
    <>
      <motion.button
        className={`icon-btn rounded-full flex justify-center items-center ${size} ${classes}`}
        {...rest}
      >
        {children}
        {!children && (<img src='send.svg' className='invert-[1] `material-symbols-rounded icon' alt='menu'/>
        )}
        <div className='state-layer'></div>
      </motion.button>
    </>
  );
};


export default Iconsend;
