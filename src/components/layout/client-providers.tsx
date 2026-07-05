"use client";

import { ReactNode } from "react";
import { TimeRangeProvider } from "@/lib/contexts/TimeRangeContext";
import { Toaster } from "@/components/ui/sonner";

export function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <TimeRangeProvider>
            {children}
            <Toaster />
        </TimeRangeProvider>
    );
}
