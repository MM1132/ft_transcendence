<script lang="ts">
    import UserIcon from './UserIcon.svelte';

    export let username: string;
    export let onAccept: ((event: MouseEvent) => void) | undefined = undefined;
</script>

<li class="incoming-friend-request-item">
    <span class="user-name">{username}</span>
    <div class="actions">
        <button type="button" class="profile-btn" aria-label={`Open profile of ${username}`}>
            <UserIcon />
        </button>
        <button
            type="button"
            class="add-btn"
            onclick={onAccept}
            aria-label={`Accept friend request from ${username}`}
        >
            ✓
        </button>
    </div>
</li>

<style>
    .incoming-friend-request-item
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
</style>
