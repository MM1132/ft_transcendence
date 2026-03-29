<script lang="ts">
    import Button from './Button.svelte';
    import { ws } from '../stores/websocket.svelte.js';

    let isExpanded = $state(false);
    let chatInput = $state('');
    let messagesEl: HTMLElement;

    const inRoom = $derived(!!ws.currentRoom);
    const title = $derived(inRoom ? ws.currentRoom!.name : 'Global Chat');
    const displayMessages = $derived(inRoom ? ws.messages : ws.globalMessages);

    $effect(() => {
        displayMessages.length;
        if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
    });

    function togglePanel() {
        isExpanded = !isExpanded;
    }

    function handleSend() {
        if (!chatInput.trim()) return;
        ws.sendChat(chatInput.trim());
        chatInput = '';
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }
</script>

<aside class="chat-drawer" class:expanded={isExpanded}>
    <Button
        type="button"
        variant="expand-trigger-bottom"
        onclick={togglePanel}
        ariaExpanded={isExpanded}
        ariaLabel={isExpanded ? 'Close chat panel' : 'Open chat panel'}
    >
        CHAT {#if inRoom}<span class="room-badge">ROOM</span>{/if}
    </Button>

    {#if isExpanded}
        <div class="chat-panel" class:global={!inRoom}>
            <h2>{title}</h2>

            <div class="messages" bind:this={messagesEl}>
                {#if displayMessages.length === 0}
                    <div class="empty-msg">
                        {inRoom ? 'No messages yet...' : 'No global messages yet...'}
                    </div>
                {:else}
                    {#each displayMessages as msg}
                        <div class="message">
                            <span class="sender">{msg.sender?.username ?? 'Unknown'}:</span>
                            <span class="content">{msg.content}</span>
                        </div>
                    {/each}
                {/if}
            </div>

            <div class="chat-input">
                <input
                    type="text"
                    placeholder={inRoom ? 'Type a message...' : 'Global chat...'}
                    bind:value={chatInput}
                    onkeydown={handleKeydown}
                />
                <button onclick={handleSend} disabled={!chatInput.trim()}>
                    Send
                </button>
            </div>
        </div>
    {/if}
</aside>

<style>
    .chat-drawer {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 53px;
        width: max(320px, 33.333vw);
        height: 56px;
        overflow: hidden;
        transition: height 0.3s ease;
    }

    .chat-drawer.expanded {
        height: max(240px, 45vh);
    }

    .chat-panel {
        margin-bottom: 55px;
        height: calc(100% - 55px);
        width: calc(100% - 16px);
        margin-left: 8px;
        margin-right: 8px;
        box-sizing: border-box;
        border: 1px solid rgba(10, 235, 0, 0.3);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        padding: 16px 20px 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .chat-panel.global {
        border-color: rgba(255, 255, 255, 0.1);
        opacity: 0.7;
    }

    .chat-panel:hover {
        border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.02);
    }

    .chat-panel.global:hover {
        border-color: rgba(255, 255, 255, 0.2);
    }

    h2 {
        margin: 0;
        color: #0AEB00;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.85rem;
        flex-shrink: 0;
    }

    .chat-panel.global h2 {
        color: #888;
    }

    .messages {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-height: 0;
    }

    .empty-msg {
        color: #555;
        font-size: 0.85rem;
        text-align: center;
        padding: 1rem 0;
    }

    .message {
        font-size: 0.88rem;
        line-height: 1.4;
    }

    .sender {
        color: #B13BCC;
        font-weight: bold;
        margin-right: 4px;
    }

    .content {
        color: #ddd;
    }

    .chat-input {
        display: flex;
        gap: 6px;
        flex-shrink: 0;
    }

    .chat-input input {
        flex: 1;
        padding: 0.4rem 0.6rem;
        background: #222;
        border: 1px solid #444;
        color: #fff;
        border-radius: 4px;
        font-size: 0.88rem;
    }

.chat-input button {
        background: #0AEB00;
        color: #000;
        border: none;
        padding: 0.4rem 0.8rem;
        cursor: pointer;
        border-radius: 4px;
        font-weight: bold;
        font-size: 0.85rem;
    }

    .chat-input button:disabled {
        background: #2a2a2a;
        color: #555;
        cursor: not-allowed;
    }

    .room-badge {
        background: #B13BCC;
        color: #fff;
        font-size: 0.65rem;
        padding: 1px 5px;
        border-radius: 3px;
        margin-left: 4px;
        vertical-align: middle;
    }
</style>
