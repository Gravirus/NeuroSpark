// Copyright 2025, Command Line
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from "react";
import { getApi } from "../store/global";
import "./workspaceswitcher.scss";

const WorkspaceSwitcher = forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <div className="workspace-switcher-popover" ref={ref}>
            <div
                className="workspace-switcher-button grey"
                onClick={() => {
                    getApi().openBuilder();
                }}
                style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
            >
                <span className="workspace-icon">
                    <i className="fa-solid fa-bolt-lightning text-accent text-lg"></i>
                </span>
            </div>
        </div>
    );
});

export { WorkspaceSwitcher };
