(async function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatWidget);
    } else {
        try {
            initChatWidget();
        } catch (error) {
            console.error(`Error mounting AI widget: ${error}`);
        }
    }

    function initChatWidget() {
        const html = document.querySelector('html');
        const theme = html.getAttribute('class');

        const scripts = document.querySelectorAll('script[src*="agent-widget.js"]');
        const script = scripts[scripts.length - 1];

        const agentId = script?.getAttribute('data-agent-id');
        const baseUrl = script?.getAttribute('data-base-url');
        const agentName = script?.getAttribute('data-name');
        const apiKey = script?.getAttribute('data-api-key');

        if (!agentId || !baseUrl || !apiKey) {
            console.error('Missing widget attributes:', { agentId, baseUrl, apiKey });
            return;
        }

        // Create the button
        const button = document.createElement('button');
        button.setAttribute('aria-label', 'Ask AI');
        const isMobile = window.innerWidth <= 768;

        Object.assign(button.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '110px',
            height: '48px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme == 'light' ? '#FDFBF9' : '#191919',
            color: theme == 'light' ? 'black' : 'white',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            zIndex: '999999',
            border: 'none',
            cursor: 'pointer',
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)';
        });

        const buttonContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" 
                viewBox="0 0 24 24" stroke="currentColor" style="vertical-align: middle; margin-right: 6px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Ask AI
        `;

        button.innerHTML = buttonContent;

        const iframe = document.createElement('iframe');
        iframe.classList.add('retriv-iframe');
        iframe.src = `${baseUrl}/embed`;
        iframe.setAttribute('allowTransparency', 'true');

        Object.assign(iframe.style, {
            position: 'fixed',
            background: 'transparent',
            bottom: isMobile ? 'unset' : 'unset',
            width: isMobile ? '100%' : '100%',
            top: isMobile ? '0%' : '0%',
            left: isMobile ? '0%' : '0%',
            height: isMobile ? '100vh' : '100vh',
            border: 'none',
            boxShadow: isMobile ? 'none' : '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: '999998',
            display: 'none',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: '0',
            transform: 'translateY(20px)',
        });

        let isIframeOpen = false;

        document.body.appendChild(iframe);

        // Toggle button click handler
        button.addEventListener('click', () => {
            if (!isIframeOpen) {
                iframe.style.display = 'block';
                document.body.style.overflow = 'hidden';
                void iframe.offsetWidth;
                iframe.style.opacity = '1';
                iframe.style.transform = 'translateY(0)';

                // Change button to close icon
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                `;

                // Post message here
                iframe.contentWindow?.postMessage(
                    {
                        type: 'INIT_CHAT',
                        payload: {
                            agentId,
                            agentName,
                            apiKey,
                        },
                    },
                    '*',
                );
            } else {
                iframe.style.opacity = '0';
                iframe.style.transform = 'translateY(20px)';

                // Change button back to chat icon
                button.innerHTML = buttonContent;

                setTimeout(() => {
                    if (!isIframeOpen) {
                        iframe.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                }, 500);
            }
            isIframeOpen = !isIframeOpen;
        });

        // Close iframe close event
        window.addEventListener('message', (event) => {
            if (event.data?.type === 'CLOSE_CHAT_IFRAME') {
                iframe.style.opacity = '0';
                iframe.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    iframe.style.display = 'none';
                }, 500);

                isIframeOpen = false;

                // Reset to chat icon
                button.innerHTML = buttonContent;
            }
        });

        document.body.appendChild(button);
    }
})();
