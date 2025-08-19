'use client';
import Link from 'next/link';
import React from 'react';
import IconBtn from './IconBtn';
import Avatar from './avatar';
import Menu from './Menu';
import MenuItems from './MenuItems';
import { useState } from 'react';
import { getuserdetails } from '@/app/lib/appwrite';
import { useContext } from 'react';
import { sidebarcontext } from './sidebarcontext';
const TopAppBar = () => {
  const {sidebaropen, setSidebaropen} = useContext(sidebarcontext)
    const handlesidebar = () => { 
      setSidebaropen(true)
     }
    const [nameofuser, setNameofuser] = useState('')
    const [namefetch, setNamefetch] = useState(false)
    const getuser = async () => { 
        const details = await getuserdetails()
        if(details.name){
            setNamefetch(true)
            setNameofuser(details.name)
        }
     }
     getuser()
  const [showmenu, setshowmenu] = useState(false);
  const togglemenu = () => { 
    setshowmenu(!showmenu)
   }
  
  return (
    <header className='relative flex justify-between items-center h-16 px-4'>
      <div className='flex items-center gap-1'>
        <IconBtn
          icon='menu'
          title='Menu'
          classes='lg:hidden'
          onClick={()=>{handlesidebar()}}
        />
        <Link
          href={'/'}
          className='min-w-max max-w-max h-[24px] lg:hidden'
        >
          <img
            src='logo-light.svg'
            width={133}
            height={24}
            alt='phoenix logo'
            className='dark:hidden'
          />
          <img
            src='logo-dark.svg'
            width={133}
            height={24}
            alt='phoenix logo'
            className='hidden dark:block'
          />
        </Link>
      </div>
      <div className='menu-wrapper'>
        <IconBtn onClick={togglemenu} onBlur={()=>setTimeout(() => {
            setshowmenu(false)
        }, 200)}>
          <Avatar name={namefetch?`${nameofuser}`:'user'} />
        </IconBtn>
        <Menu classes={showmenu? 'active': ''}>
          <MenuItems labelText='Log out' classes=''  />
        </Menu>
      </div>
    </header>
  );
};

export default TopAppBar;
