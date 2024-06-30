import React from 'react'

const Submitting = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center animate-bounce">

                <svg
                    className="h-8 w-8"
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
            </div>
            <p className="text-lg font-medium">Submitting Request...</p>
            <p className="text-muted-foreground">Please wait while we process your request.</p>
        </div>
    )
}

export default Submitting