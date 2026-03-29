<script lang="ts">
    import Button from './Button.svelte';

    let isExpanded = $state(false);
    let messages = $state<Array<{ sender: string; content: string; timestamp: string }>>([]);
    let input = $state("");
    let username = $state("Me");

    function togglePanel() {
        isExpanded = !isExpanded;
    }

    function sendMessage(e: Event) {
        e.preventDefault();
        if (input.trim() === "") return;
        messages = [
            ...messages,
            {
                sender: username,
                content: input,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ];
        input = "";
        setTimeout(() => {
            const panel = document.querySelector('.chat-messages');
            if (panel) panel.scrollTop = panel.scrollHeight;
        }, 0);
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
        CHAT
    </Button>

    {#if isExpanded}
        <form class="chat-panel" onsubmit={sendMessage} autocomplete="off">
            <div class="chat-messages">
                {#each messages as msg, i}
                    <div class="chat-message {msg.sender === username ? 'me' : ''}">
                        <span class="sender">{msg.sender}</span>
                        <span class="content">{msg.content}</span>
                        <span class="timestamp">{msg.timestamp}</span>
                    </div>
                {/each}
            </div>
            <div class="chat-input-row">
                <input
                    class="chat-input"
                    type="text"
                    placeholder="Type a message..."
                    bind:value={input}
                    maxlength="200"
                    autocomplete="off"
                />
                <Button type="submit" variant="create" class="send-btn">▶</Button>
            </div>
        </form>
    {/if}
</aside>

<style>
    .chat-drawer
    {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 53px;
        width: max(320px, 33.333vw);
        height: 56px;
        overflow: hidden;
        transition: height 0.3s ease;
    }

    .chat-drawer.expanded
    {
        height: max(340px, 88vh);
    }

    .chat-panel
    {
        margin-bottom: 55px;
        height: calc(100% - 55px);
        width: calc(100% - 16px);
        margin-left: 8px;
        margin-right: 8px;
        box-sizing: border-box;
        border: 1px solid rgba(10, 235, 0, 0.6);
        background: rgba(15, 19, 20);
        backdrop-filter: blur(100px);
        padding: 24px 28px;
        display: flex;
        flex-direction: column;
    }

     /* Custom scrollbar maybe not work for Firefox */
     
     
     .chat-panel:hover
     {
         border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.02);
    }
    
    .chat-messages
    {
        flex: 1 1 auto;
        overflow-y: auto;
        margin-bottom: 16px;
        padding-right: 4px;
    }

    .chat-messages::-webkit-scrollbar
    {
        width: 12px;
    }
    .chat-messages::-webkit-scrollbar-thumb
    {
        background: #b13bcc;
    }
    .chat-messages::-webkit-scrollbar-track
    {
        background: rgba(30, 157, 189, 0.3);
    }
    
    .chat-message
    {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 6px;
        color: #fff;
        font-size: 13px;
        background: rgba(177, 59, 204, 0.08);
        padding: 14px 18px;
    }
    
    .chat-message.me
    {
        background: rgba(10, 235, 0, 0.05);
        color: #0AEB00;
        color:white;
        font-weight: 600;
        /* justify-content: flex-end; */
    }


    .chat-message .sender
    {
        font-weight: bold;
        color: #b13bcc;
        margin-right: 4px;
    }

    .chat-message.me .sender
    {
        color: #0AEB00;
    }

    .chat-message .timestamp
    {
        font-size: 11px;
        color: #c8eb00;
        margin-left: auto;
    }

    .chat-input-row
    {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .chat-input
    {
        flex: 1 1 auto;
        padding: 12px 10px;
        border: 1px solid rgba(10, 235, 0, 0.3);
        background: rgba(0, 0, 0, 0.4);
        color: #0AEB00;
        outline: none;
        font-size: 14px;
    }

    .chat-input:focus
    {
        border-color: #0AEB00;
    }

    /* .send-btn {
        min-width: 60px;
        height: 40px;
        padding: 0 10px;
        font-size: 14px;
    } */
</style>