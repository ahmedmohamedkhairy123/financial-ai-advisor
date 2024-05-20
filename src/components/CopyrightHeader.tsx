import React from 'react';

export const CopyrightHeader: React.FC = () => {
    return (
        <div className="w-full bg-slate-900 text-slate-300 py-3 px-4 text-center text-xs md:text-sm border-b border-slate-700">
            <p>
                &copy; Copyright to <a href="mailto:ahmedmohamedkhairy123@gmail.com" className="text-blue-400 hover:text-blue-300 underline transition-colors">ahmedmohamedkhairy123@gmail.com</a>.
                For inquiries, technical advice, or custom development, please contact the developer directly.
            </p>
        </div>
    );
};