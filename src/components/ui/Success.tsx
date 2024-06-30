import React from 'react'

const Success = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
            <svg
                className="size-12 text-green-500 animate-bounce"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
            </svg>
            <p className="text-lg font-medium">Success!</p>
            <p className="text-muted-foreground">Your request completed successfully.</p>
        </div>
    )
}

export default Success