<script lang="ts">
    import UserIcon from './UserIcon.svelte';
    import HourglassIcon from './HourglassIcon.svelte';

    export let username: string;
    export let isPending = false;
    export let hasIncomingRequest = false;
    export let hasOutgoingRequest = false;
    export let isDisabled = false;
    export let onAction: ((event: MouseEvent) => void) | undefined = undefined;
</script>

<li class="online-user-list-item">
    <span class="user-name">{username}</span>
    <div class="actions">
        <button type="button" class="profile-btn" aria-label={`Open profile of ${username}`}>
            <UserIcon />
        </button>
        <button
            type="button"
            class="add-btn"
            class:pending={isPending}
            onclick={onAction}
            disabled={isDisabled}
            aria-label={hasIncomingRequest
                ? `Accept friend request from ${username}`
                : hasOutgoingRequest
                    ? `Friend request to ${username} is pending`
                    : `Add ${username} as friend`}
        >
            {#if hasIncomingRequest}
                ✓
            {:else if hasOutgoingRequest}
                <HourglassIcon />
            {:else}
                +
            {/if}
        </button>
    </div>
</li>

<style>
    .online-user-list-item
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(10, 235, 0, 0.15);
        background: rgba(15, 19, 20, 0.4);
        padding: 8px 10px;
    }

    .user-name
    {
        color: #fff;
    }

    .actions
    {
        display: flex;
        gap: 6px;
    }

    .profile-btn,
    .add-btn
    {
        border: 1px solid rgba(10, 235, 0, 0.4);
        background: rgba(10, 235, 0, 0.08);
        color: #d8ffd7;
        cursor: pointer;
        font-size: 0.78rem;
        padding: 4px 8px;
    }

    .profile-btn
    {
        width: 30px;
        height: 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .add-btn
    {
        min-width: 28px;
        font-weight: bold;
    }

    .add-btn:disabled
    {
        opacity: 0.45;
        cursor: not-allowed;
    }

    .add-btn.pending:disabled
    {
        opacity: 1;
    }
</style>
