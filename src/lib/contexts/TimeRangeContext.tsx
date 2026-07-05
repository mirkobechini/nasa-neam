"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TimeRangeContextType {
    dateMin: string;
    dateMax: string;
    setDateRange: (min: string, max: string) => void;
    setPredefinedRange: (range: "3days" | "7days") => void;
}

const TimeRangeContext = createContext<TimeRangeContextType | undefined>(undefined);

export function TimeRangeProvider({ children }: { children: ReactNode }) {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [dateMin, setDateMin] = useState(sevenDaysAgo.toISOString().split("T")[0]);
    const [dateMax, setDateMax] = useState(today.toISOString().split("T")[0]);

    const setDateRange = (min: string, max: string) => {
        setDateMin(min);
        setDateMax(max);
    };

    const setPredefinedRange = (range: "3days" | "7days") => {
        const daysAgo = range === "3days" ? 3 : 7;
        const minDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        setDateMin(minDate.toISOString().split("T")[0]);
        setDateMax(today.toISOString().split("T")[0]);
    };

    return (
        <TimeRangeContext.Provider value={{ dateMin, dateMax, setDateRange, setPredefinedRange }}>
            {children}
        </TimeRangeContext.Provider>
    );
}

export function useTimeRange() {
    const context = useContext(TimeRangeContext);
    if (!context) {
        throw new Error("useTimeRange must be used within TimeRangeProvider");
    }
    return context;
}
