import React from 'react';
import { CircularProgress, LinearProgress } from './progressbar';
import Avatar from './avatar';
const conversation = (req) => {
  if (typeof req.chatdt.documents == 'undefined') {
    console.log('x');
    return (
      <div className='h-full w-full flex items-center justify-center'>
        <LinearProgress />
        <CircularProgress />
      </div>
    );
  } else {
    console.log(req.chatdt.documents);
    return <>
        {req.chatdt.documents.map((items) => {
          return <div key={items.$id} className='grid grid-cols-1 items-center gap-1 py-4 md:grid-cols-[nax-content,minmax(0,1fr),max-content] md:gap-5'>
            <span className='flex gap-3 flex-wrap items-center'>
            <Avatar/>
            {items.user_prompt}
            </span>
            <p className='text-bodyLarge pt-1 white-space-pre-wrap line-clamp-4'>{items.ai_response}</p>
          </div>;
        })}
      </>
    ;
  }
};

export default conversation;
