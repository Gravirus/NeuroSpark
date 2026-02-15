// Copyright 2025, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

import { memo } from "react";

const GetMoreButton = memo(({ variant, showClose = true }: { variant: "yellow" | "red"; showClose?: boolean }) => {
    const isYellow = variant === "yellow";
    const bgColor = isYellow ? "bg-yellow-900/30" : "bg-red-900/30";
    const hoverBg = isYellow ? "hover:bg-yellow-700/60" : "hover:bg-red-700/60";
    const borderColor = isYellow ? "border-yellow-700/50" : "border-red-700/50";
    const textColor = isYellow ? "text-yellow-200" : "text-red-200";
    const iconColor = isYellow ? "text-yellow-400" : "text-red-400";
    const iconHoverBg =
        showClose && isYellow
            ? "hover:has-[.close:hover]:bg-yellow-900/30"
            : showClose
              ? "hover:has-[.close:hover]:bg-red-900/30"
              : "";

    if (true) {
        // disable now until we have modal
        return null;
    }

    return (
        <div className="pl-2 pb-1.5">
            <button
                className={`flex items-center gap-1.5 ${showClose ? "pl-1" : "pl-2"} pr-2 py-1 ${bgColor} ${iconHoverBg} ${hoverBg} rounded-b border border-t-0 ${borderColor} text-[11px] ${textColor} cursor-pointer transition-colors`}
            >
                {showClose && (
                    <i className={`close fa fa-xmark ${iconColor}/60 hover:${iconColor} transition-colors`}></i>
                )}
                <span>Get More</span>
                <i className={`fa fa-arrow-right ${iconColor}`}></i>
            </button>
        </div>
    );
});

GetMoreButton.displayName = "GetMoreButton";

function formatTimeRemaining(expirationEpoch: number): string {
    const now = Math.floor(Date.now() / 1000);
    const secondsRemaining = expirationEpoch - now;

    if (secondsRemaining <= 0) {
        return "soon";
    }

    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);

    if (hours > 0) {
        return `${hours}h`;
    }
    return `${minutes}m`;
}

const AIRateLimitStripComponent = memo(() => {
    return null;
});

AIRateLimitStripComponent.displayName = "AIRateLimitStrip";

export { AIRateLimitStripComponent as AIRateLimitStrip };
