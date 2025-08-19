import React from 'react'
import { avatars } from '@/app/lib/appwrite'
const avatar = ({name}) => {
  return (
    <figure className='avatar'>
        <img src={avatars.getInitials(name, 48, 48)} alt={name} width={48} height={48} />
    </figure>
  )
}

export default avatar
