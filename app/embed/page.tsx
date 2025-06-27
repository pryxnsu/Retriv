'use client';

import ChatInterfaceAgent from '@/components/agent/AgentChat';
import React, { useEffect, useState } from 'react';

export default function EmbedChatPage() {
    const [agentId, setAgentId] = useState<string>('');
    const [agentName, setAgentName] = useState<string>('');
    const [apiKey, setApiKey] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setIsOpen(true), 2000);
    }, []);

    const handleClose = () => {
        setIsOpen(false);

        // Close the modal
        window.parent.postMessage({ type: 'CLOSE_CHAT_IFRAME' }, '*');
    };

    useEffect(() => {
        const listener = (event: MessageEvent) => {
            if (event.data?.type === 'INIT_CHAT') {
                const { agentId, agentName, apiKey } = event.data.payload;
                setAgentId(agentId);
                setAgentName(agentName);
                setApiKey(apiKey);
            }
        };

        window.addEventListener('message', listener);
        return () => window.removeEventListener('message', listener);
    }, []);

    // If the user opened directly in a tab
    useEffect(() => {
        if (window.top === window.self) {
            window.location.href = '/agent';
        }
    }, []);
    return (
        <div className="w-full h-full">
            {!isOpen && (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <div className="w-full max-w-md space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Hello!</h1>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                                How can I help?
                            </h2>
                        </div>

                        <div className="flex justify-start text-xs mt-2">
                            Powered by <span className="font-semibold ml-1">Retriv</span>
                        </div>
                    </div>
                </div>
            )}
            <ChatInterfaceAgent
                agentName={agentName}
                agentId={agentId}
                apiKey={apiKey}
                isOpen={isOpen}
                onClose={handleClose}
            />
        </div>
    );
}
