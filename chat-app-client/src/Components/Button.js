import React from 'react'

function Button({ children, className, ...rest }) {
  return (
    <button className={`bg-blue-600 text-white px-1 py-2 rounded ${className}`} {...rest}> { children } </button>
  )
}

export default Button