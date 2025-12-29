import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
            <input
                className={`px-4 py-2 rounded-lg border bg-white dark:bg-dark-surface dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'} ${className}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;
