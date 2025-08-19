'use client';
import React from 'react';
import Logo from './Logo';
import Link from 'next/link';
import IconBtnd from './IconBtnd';
import ExtendedFab from './ExtendedFab';
import { useContext, useState, useEffect } from 'react';
import { sidebarcontext } from './sidebarcontext';
import { motion } from 'framer-motion';

const SideBar = ({ con, user, onConversationSelect, currentConversationId, clearLoading }) => {
  const { sidebaropen, setSidebaropen } = useContext(sidebarcontext);
  const [loadingItemId, setLoadingItemId] = useState(null);
  // Clear loading state when currentConversationId changes or clearLoading is called
  useEffect(() => {
    if (loadingItemId && (currentConversationId === loadingItemId || clearLoading)) {
      setLoadingItemId(null);
    }
  }, [currentConversationId, loadingItemId, clearLoading]);

  const handleItemClick = (itemId) => {
    setLoadingItemId(itemId);
    window.history.pushState(null, '', `/${itemId}`);
    
    // Call the parent's conversation select handler if provided
    if (onConversationSelect) {
      onConversationSelect(itemId);
    }
    
    // Fallback timeout in case the effect doesn't clear it
    setTimeout(() => {
      setLoadingItemId(null);
    }, 3000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`sidebar ${sidebaropen ? 'active' : ''}`}
      >
        <div className='sidebar-inner'>
          <div className='h-16 grid items-center px-4 mb-4'>
            {/**Logo */}
            <Logo />
          </div>
          <ExtendedFab
            href='/'
            text='New Chat'
            classes=''
          />
          <div className='overflow-y-auto -me-2 pe-1'>
            <p className='text-titleSmall h-9 grid items-center px-4'>Recent</p>
            <nav>
              {con.documents.length == 0 && (
                <div className='relative group'>
                  <Link
                    href={`new-chat`}
                    className='nav-link active'
                  >
                    <span className='flex'>
                      <img
                        src='chat_bubble.svg'
                        alt='chat_bubble'
                        className='material-symbols-rounded icon-small invert-[1] h-6 mr-1'
                      />
                      <span className='truncate'>New conversation</span>
                    </span>
                    <div className='state-layer w-fit'></div>
                  </Link>
                  <IconBtnd
                    icon='delete'
                    size='small'
                    classes='absolute right-1.5 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 group:focus-within:opacity-100 hidden lg:flex justify-center items-center rounded-full'
                    title='Delete'
                  />
                </div>
              )}
              {con.documents.length != 0 &&
                con.documents.map((items) => {
                  const isLoading = loadingItemId === items.$id;
                  const isActive = user == items.$id;
                  
                  return (
                    <div
                      key={items.$id}
                      className='relative group my-2'
                    >
                      <div
                        onClick={() => handleItemClick(items.$id)}
                        className={`nav-link cursor-pointer ${isActive ? 'active' : ''} ${isLoading ? 'opacity-70' : ''}`}
                      >
                        <span className='flex max-w-[200px]'>
                          <img
                            src='chat_bubble.svg'
                            alt='chat_bubble'
                            className='material-symbols-rounded icon-small invert-[1] h-6 mr-1'
                          />
                          <span className='truncate'>
                            {isLoading ? 'Loading...' : items.Title}
                          </span>
                        </span>
                        
                        {/* Loading spinner */}
                        {isLoading && (
                          <div className='ml-auto mr-2'>
                            <div className='animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent'></div>
                          </div>
                        )}
                        
                        <div className='state-layer w-fit'></div>
                      </div>
                      <IconBtnd
                        icon='delete'
                        size='small'
                        classes='absolute right-1.5 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 group:focus-within:opacity-100 hidden lg:flex justify-center items-center rounded-full'
                        title='Delete'
                      />
                    </div>
                  );
                })}
            </nav>
          </div>
          <div className='mt-4 h-14 px-4 grid items-center text-labelLarge text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant border-t border-light-surfaceContainerHigh dark:border-dark-surfaceContainerHigh truncate'>
            &copy; 2025 codewithpragye
          </div>
        </div>
      </motion.div>
      <div
        className={`overlay ${sidebaropen ? 'active' : ''}`}
        onClick={() => {
          setSidebaropen(false);
        }}
      ></div>
    </>
  );
};

export default SideBar;