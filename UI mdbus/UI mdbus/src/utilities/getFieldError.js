import React from 'react';

/* Dynamic Error Field */

function getFieldError(errorMessage) {
  return (
    <div className="errorNotification">
      {
        errorMessage===""||errorMessage=== undefined
        ? (<span></span>)
        : (<span>{errorMessage}</span>)
      }
    </div>
  )
}

export {
  getFieldError
}
