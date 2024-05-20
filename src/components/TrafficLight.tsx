import React from 'react';
import { FeasibilityStatus } from '../types';

interface TrafficLightProps {
    status: FeasibilityStatus;
}

export const TrafficLight: React.FC<TrafficLightProps> = ({ status }) => {
    const getClasses = (color: FeasibilityStatus, target: FeasibilityStatus) => {
        const base = "w-16 h-16 rounded-full border-4 border-slate-700 shadow-inner transition-all duration-700";
        if (color !== target) return `${base} bg-slate-800 opacity-30`;

        switch (color) {
            case FeasibilityStatus.RED:
                return `${base} bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-pulse`;
            case FeasibilityStatus.YELLOW:
                return `${base} bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.8)] animate-pulse`;
            case FeasibilityStatus.GREEN:
                return `${base} bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.8)] animate-pulse`;
            default:
                return base;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-3xl shadow-2xl border border-slate-700">
            <div className="flex space-x-6 mb-4">
                <div className={getClasses(FeasibilityStatus.RED, status)} />
                <div className={getClasses(FeasibilityStatus.YELLOW, status)} />
                <div className={getClasses(FeasibilityStatus.GREEN, status)} />
            </div>
            <div className="text-center mt-2">
                <h3 className="text-white text-xl font-bold tracking-wide">
                    {status === FeasibilityStatus.RED && "UNREALISTIC"}
                    {status === FeasibilityStatus.YELLOW && "CHALLENGING"}
                    {status === FeasibilityStatus.GREEN && "ON TRACK"}
                </h3>
            </div>
        </div>
    );
};