"use client";

import { Navbar } from "@/components/layout/navbar";
import { TimeRangeFilter } from "@/components/dashboard/time-range-filter";

export function NavbarWrapper() {
    return (
        <>
            <Navbar />
            <div className="bg-background/50 border-b border-border px-4 md:px-6 py-3">
                <div className="max-w-7xl mx-auto">
                    <TimeRangeFilter />
                </div>
            </div>
        </>
    );
}