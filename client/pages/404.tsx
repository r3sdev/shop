import React from 'react';
import {useRouter} from 'next/router';

export default function Custom404() {

  const router = useRouter()

  const onBack = () => {
    router.push('/')
  }

  return (
    <div className={`d-flex flex-column justify-content-center align-items-center`} style={{ height: 'calc(100vh - 56px)'}}>
      <div className="d-flex flex-row justify-content-center align-items-center">
        <h1>404</h1>
        <span className="ml-5 mr-5">|</span>
        <h3>Page Not Found</h3>
      </div>
        <button 
        className="btn btn-outline-secondary mt-5" 
        style={{width: '15rem'}}
        onClick={onBack}
        >
          Back
        </button>
    </div>
  )
}