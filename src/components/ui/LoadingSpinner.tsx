import React from 'react'

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
    )
}

export default LoadingSpinner