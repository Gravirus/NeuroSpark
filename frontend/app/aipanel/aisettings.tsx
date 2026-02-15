// Copyright 2025, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

import { RpcApi } from "@/app/store/wshclientapi";
import { TabRpcClient } from "@/app/store/wshrpcutil";
import { cn, makeIconClass } from "@/util/util";
import { memo, useEffect, useRef, useState } from "react";
import { WaveAIModel } from "./waveai-model";

const AISettingsDropdown = memo(() => {
    const model = WaveAIModel.getInstance();
    const [isOpen, setIsOpen] = useState(false);
    const [maxTokens, setMaxTokens] = useState<number>(model.inBuilder ? 24576 : 4096);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchRTInfo = async () => {
            const rtInfo = await RpcApi.GetRTInfoCommand(TabRpcClient, {
                oref: model.orefContext,
            });
            if (rtInfo?.["waveai:maxoutputtokens"]) {
                setMaxTokens(rtInfo["waveai:maxoutputtokens"]);
            }
        };
        fetchRTInfo();
    }, [model.orefContext]);

    const handleSetMaxTokens = (tokens: number) => {
        setMaxTokens(tokens);
        RpcApi.SetRTInfoCommand(TabRpcClient, {
            oref: model.orefContext,
            data: { "waveai:maxoutputtokens": tokens },
        });
        setIsOpen(false);
    };

    const tokenOptions = model.inBuilder
        ? [
              { label: "24k", value: 24576 },
              { label: "64k", value: 65536 },
              { label: "1M", value: 1048576 },
          ]
        : [
              { label: "1k", value: 1024, devOnly: true },
              { label: "4k", value: 4096 },
              { label: "16k", value: 16384 },
              { label: "64k", value: 65536 },
              { label: "1M", value: 1048576 },
          ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center p-1.5 rounded transition-colors cursor-pointer text-gray-400 hover:text-white hover:bg-zinc-700 ml-1",
                    isOpen && "bg-zinc-700 text-white"
                )}
                title="AI Settings"
            >
                <i className={makeIconClass("gear", false)}></i>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div
                        className="absolute top-full right-0 mt-1 bg-zinc-800 border border-zinc-600 rounded shadow-lg z-50 min-w-[140px] p-1"
                        style={{ background: "#1e1e1e" }} // Adjusting background as per user's preference if needed, or using zinc-900/800
                    >
                        <div className="px-3 py-1.5 text-[10px] text-gray-400 uppercase tracking-wide border-b border-gray-700 mb-1">
                            Max Output Tokens
                        </div>
                        {tokenOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleSetMaxTokens(opt.value)}
                                className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-700 cursor-pointer transition-colors text-left rounded"
                            >
                                <span>{opt.label}</span>
                                {maxTokens === opt.value && <i className="fa fa-check text-accent text-xs"></i>}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});

AISettingsDropdown.displayName = "AISettingsDropdown";

export { AISettingsDropdown };
