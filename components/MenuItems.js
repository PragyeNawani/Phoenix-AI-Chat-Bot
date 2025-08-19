'use client';
import React from 'react';
import { logout } from '@/app/lib/appwrite';
import { useRouter } from 'next/navigation';
const MenuItems = ({ classes = '', labelText, ...rest }) => {
  const router = useRouter();
  const handlelogout = async () => {
    let status = await logout();
    if (status.success) {
      router.push(`${status.redirect}`);
    } else {
      console.log(status.error);
    }
  };
  return (
    <button
      className={`menu-item ${classes} `}
      onClick={() => {
        handlelogout();
      }}
      {...rest}
    >
      <span>{labelText}</span>
      <div className='state-layer'></div>
    </button>
  );
};

export default MenuItems;
