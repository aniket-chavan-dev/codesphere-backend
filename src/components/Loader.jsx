import React from 'react'

function Loader() {
  return (
    <div className="flex items-center justify-center space-x-3 my-auto">
      <span className="w-3 h-3 bg-gray-50 rounded-full animate-bounce"></span>
      <span className="w-3 h-3 bg-gray-50 rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span className="w-3 h-3 bg-gray-50 rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
  )
}

export default Loader