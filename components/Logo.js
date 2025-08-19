import React from 'react'
import Link from 'next/link'

const Logo = ({classes = ''}) => {
  return (
    <Link
          href={'/'}
          className={`min-w-max max-w-max h-[24px] ${classes}`}
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
  )
}

export default Logo
