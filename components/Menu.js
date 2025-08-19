import React from 'react'

const Menu = ({classes='', children,}) => {
  return (
    <div className={`menu ${classes}`}>
      {children}
    </div>
  )
}

export default Menu
