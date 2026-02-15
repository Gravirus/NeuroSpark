// Copyright 2025, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

import { RpcApi } from "@/app/store/wshclientapi";
import { TabRpcClient } from "@/app/store/wshrpcutil";
import { makeIconClass } from "@/util/util";
import { memo } from "react";
import { WaveAIModel } from "./waveai-model";

const AISaveChatButton = memo(() => {
    const model = WaveAIModel.getInstance();

    const handleSaveChat = async () => {
        const chatId = model.getChatId();
        if (!chatId) return;

        const chat = await RpcApi.GetWaveAIChatCommand(TabRpcClient, { chatid: chatId });
        if (!chat || !chat.messages) return;

        let mdContent = `# NeuroSpark AI Chat History\nDate: ${new Date().toLocaleString()}\n\n`;

        chat.messages.forEach((msg: any) => {
            const role = msg.role === "user" ? "User" : "NeuroSpark AI";
            mdContent += `## ${role}\n\n`;

            if (msg.text) {
                mdContent += `${msg.text}\n\n`;
            }
            if (msg.parts) {
                msg.parts.forEach((part: any) => {
                    if (part.type === "text") {
                        mdContent += `${part.text}\n\n`;
                    } else if (part.type === "code") {
                        mdContent += "```" + (part.language || "") + "\n" + part.content + "\n```\n\n";
                    }
                });
            }
        });

        const blob = new Blob([mdContent], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `neurospark chat (${new Date().toISOString().split("T")[0]}).md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleSaveChat}
            className="flex items-center justify-center p-1.5 rounded transition-colors cursor-pointer text-gray-400 hover:text-white hover:bg-zinc-700 ml-1"
            title="Save Chat History to Markdown"
        >
            <i className={makeIconClass("save", false)}></i>
        </button>
    );
});

AISaveChatButton.displayName = "AISaveChatButton";

export { AISaveChatButton };
