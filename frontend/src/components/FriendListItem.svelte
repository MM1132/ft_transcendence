<script lang="ts">
    import UserIcon from './UserIcon.svelte';

    export let username: string;
    export let onRemove: ((event: MouseEvent) => void) | undefined = undefined;
</script>

<li class="friend-list-item">
    <span class="user-name">{username}</span>
    <div class="actions">
        <button type="button" class="profile-btn" aria-label={`Open profile of ${username}`}>
            <UserIcon />
        </button>
        <button
            type="button"
            class="remove-btn"
            onclick={onRemove}
            aria-label={`Remove ${username} from friends`}
        >
            -
        </button>
    </div>
</li>

<style>
    .friend-list-item
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
    .remove-btn
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

    .remove-btn
    {
        min-width: 28px;
        font-weight: bold;
        font-size: 0;
        position: relative;
    }

    .remove-btn::before
    {
        content: '';
        display: block;
        width: 14px;
        height: 2px;
        background: currentColor;
    }
</style>
