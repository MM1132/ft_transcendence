<script lang="ts">

    import { onMount } from 'svelte';
    import Button from './Button.svelte';
    import {
        friendsService,
        type IncomingFriendRequest,
        type OutgoingFriendRequest,
        type UserSummary,
    } from '../services/friendsService';
    import { buildApiPath } from '../utils/constants';
    import { buildAuthHeaders } from '../services/settingsService';
    import { authStore } from '../stores/authStore';


    let isExpanded = $state(true);
    let selectedList = $state<'friends' | 'online'>('friends');
    let viewMode = $state<'users' | 'requests'>('users');
    let isLoading = $state(false);
    let errorMessage = $state('');

    let friends = $state<UserSummary[]>([]);
    let onlineUsers = $state<UserSummary[]>([]);
    let incomingFriendRequests = $state<IncomingFriendRequest[]>([]);
    let outgoingFriendRequests = $state<OutgoingFriendRequest[]>([]);

    function togglePanel()
    {
        isExpanded = !isExpanded;
    }

    async function loadUsers()
    {
        isLoading = true;
        errorMessage = '';

        try
        {
            const [loadedFriends, loadedOnlineUsers] = await Promise.all([ //parallel 
                friendsService.getMyFriends(),
                friendsService.getOnlineUsers(),
            ]);
            const [loadedIncomingRequests, loadedOutgoingRequests] = await Promise.all([ // parallel
                getIncomingRequestsSafe(),
                getOutgoingRequestsSafe(),
            ]);

            const currentUserId = authStore.getCurrentUserId();
            friends = loadedFriends;
            onlineUsers = loadedOnlineUsers.filter((user) => user.id !== currentUserId); // mich rausfiltern
            incomingFriendRequests = loadedIncomingRequests;
            outgoingFriendRequests = loadedOutgoingRequests;
        }
        catch (error)
        {
            errorMessage = error instanceof Error ? error.message : 'Could not load users';
        }
        finally
        {
            isLoading = false;
        }
    }

    async function addFriend(userId: string)
    {
        try
        {
            await friendsService.sendFriendRequest(userId);
            await loadUsers();
        }
        catch (error)
        {
            errorMessage = error instanceof Error ? error.message : 'Could not send friend request';
        }
    }

    function hasIncomingRequestFrom(userId: string): boolean
    {
        return incomingFriendRequests.some((request) => request.userFrom.id === userId);
    }

    function hasOutgoingRequestTo(userId: string): boolean
    {
        return outgoingFriendRequests.some((request) => request.userTo.id === userId);
    }

    async function acceptFriendRequest(userId: string)
    {
        try
        {
            await friendsService.sendFriendRequest(userId);
            await loadUsers();
        }
        catch (error)
        {
            errorMessage = error instanceof Error ? error.message : 'Could not accept friend request';
        }
    }

    async function removeFriend(userId: string)
    {
        try
        {
            await removeFriendSafe(userId);
            await loadUsers();
        }
        catch (error)
        {
            errorMessage = error instanceof Error ? error.message : 'Could not remove friend';
        }
    }

    async function toggleRequestsView()
    {
        viewMode = viewMode === 'users' ? 'requests' : 'users';
        await loadUsers();
    }

    async function handleListModeChange()
    {
        await loadUsers();
    }

    onMount(async () => {
        await loadUsers();
    });

    async function getIncomingRequestsSafe(): Promise<IncomingFriendRequest[]>
    {
        const serviceWithOptionalMethod = friendsService as {
            getIncomingFriendRequests?: () => Promise<IncomingFriendRequest[]>;
        };

        if (typeof serviceWithOptionalMethod.getIncomingFriendRequests !== 'function')
        {
            const response = await fetch(`${buildApiPath('/friend-requests')}?direction=in`, {
                method: 'GET',
                headers: buildAuthHeaders(),
            });

            if (!response.ok)
                throw new Error(`Could not load incoming friend requests (${response.status})`);

            return (await response.json()) as IncomingFriendRequest[];
        }

        return serviceWithOptionalMethod.getIncomingFriendRequests();
    }

    async function getOutgoingRequestsSafe(): Promise<OutgoingFriendRequest[]>
    {
        const serviceWithOptionalMethod = friendsService as {
            getOutgoingFriendRequests?: () => Promise<OutgoingFriendRequest[]>;
        };

        if (typeof serviceWithOptionalMethod.getOutgoingFriendRequests !== 'function')
        {
            const response = await fetch(`${buildApiPath('/friend-requests')}?direction=out`, {
                method: 'GET',
                headers: buildAuthHeaders(),
            });

            if (!response.ok)
                throw new Error(`Could not load outgoing friend requests (${response.status})`);

            return (await response.json()) as OutgoingFriendRequest[];
        }

        return serviceWithOptionalMethod.getOutgoingFriendRequests();
    }

    async function removeFriendSafe(userId: string): Promise<void>
    {
        const serviceWithOptionalMethod = friendsService as {
            removeFriend?: (targetUserId: string) => Promise<unknown>;
        };

        if (typeof serviceWithOptionalMethod.removeFriend === 'function')
        {
            await serviceWithOptionalMethod.removeFriend(userId);
            return;
        }

        const response = await fetch(`${buildApiPath('/friends')}/${userId}`, {
            method: 'DELETE',
            headers: buildAuthHeaders(),
        });

        if (!response.ok)
            throw new Error(`Could not remove friend (${response.status})`);
    }
</script>

<aside class="friends-drawer" class:expanded={isExpanded}>
    <Button
        type="button"
        variant="expand-trigger-left"
        onclick={togglePanel}
        ariaExpanded={isExpanded}
        ariaLabel={isExpanded ? 'Close friends panel' : 'Open friends panel'}
    >
        FRIENDS
    </Button>

    {#if isExpanded}
        <form class="friends-panel">
            <div class="header-row">
                {#if viewMode === 'users'}
                    <h2 class="title-select-wrap">
                        <select
                            class="title-select"
                            bind:value={selectedList}
                            aria-label="Choose friends list"
                            onchange={handleListModeChange}
                        >
                            <option value="friends">Friends</option>
                            <option value="online">Online</option>
                        </select>
                    </h2>
                {:else}
                    <h2>Friend Requests</h2>
                {/if}

                <button
                    type="button"
                    class="bell-btn"
                    class:has-requests={incomingFriendRequests.length > 0}
                    onclick={toggleRequestsView}
                    aria-label="Toggle friend requests"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            d="M12 2a6 6 0 0 0-6 6v3.6L4.3 14a1 1 0 0 0 .7 1.7h14a1 1 0 0 0 .7-1.7L18 11.6V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 2.8-2h-5.6A3 3 0 0 0 12 22Z" />
                            <!-- vektorenbild einer kleinen Glocke -->
                    </svg>
                </button>
            </div>

            <ul class="user-list">
                {#if isLoading}
                    <li class="info-row">Loading...</li>
                {:else if errorMessage}
                    <li class="info-row error">{errorMessage}</li>
                {:else if viewMode === 'requests'}
                    {#if incomingFriendRequests.length === 0}
                        <li class="info-row">No friend requests</li>
                    {/if}
                    {#each incomingFriendRequests as request}
                        <li>
                            <span class="user-name">{request.userFrom.username}</span>
                            <div class="actions">
                                <button type="button" class="profile-btn" aria-label={`Open profile of ${request.userFrom.username}`}>
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-4.42 0-8 3.58-8 8h16c0-4.42-3.58-8-8-8Z" />
                                            <!-- profilbild vektorenbild -->
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    class="add-btn"
                                    onclick={() => acceptFriendRequest(request.userFrom.id)}
                                    aria-label={`Accept friend request from ${request.userFrom.username}`}
                                >
                                    ✓
                                </button>
                            </div>
                        </li>
                    {/each}
                {:else}
                    {#if selectedList === 'friends'}
                        {#each friends as user}
                            <li>
                                <span class="user-name">{user.username}</span>
                                <div class="actions">
                                    <button type="button" class="profile-btn" aria-label={`Open profile of ${user.username}`}>
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path
                                                d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-4.42 0-8 3.58-8 8h16c0-4.42-3.58-8-8-8Z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        class="remove-btn"
                                        onclick={() => removeFriend(user.id)}
                                        aria-label={`Remove ${user.username} from friends`}
                                    >
                                        -
                                    </button>
                                </div>
                            </li>
                        {/each}
                    {:else}
                        {#each onlineUsers as user}
                            <li>
                                <span class="user-name">{user.username}</span>
                                <div class="actions">
                                    <button type="button" class="profile-btn" aria-label={`Open profile of ${user.username}`}>
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path
                                                d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-4.42 0-8 3.58-8 8h16c0-4.42-3.58-8-8-8Z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        class="add-btn"
                                        class:pending={hasOutgoingRequestTo(user.id) && !hasIncomingRequestFrom(user.id)}
                                        onclick={() => hasIncomingRequestFrom(user.id)
                                            ? acceptFriendRequest(user.id)
                                            : addFriend(user.id)}
                                        disabled={friends.some((entry) => entry.id === user.id) || hasOutgoingRequestTo(user.id)}
                                        aria-label={hasIncomingRequestFrom(user.id)
                                            ? `Accept friend request from ${user.username}`
                                            : hasOutgoingRequestTo(user.id)
                                                ? `Friend request to ${user.username} is pending`
                                                : `Add ${user.username} as friend`}
                                    >
                                        {#if hasIncomingRequestFrom(user.id)}
                                            ✓
                                        {:else if hasOutgoingRequestTo(user.id)}
                                            <svg class="hourglass-icon" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M7 3h10v2h-1v4.3l-2.8 2.7 2.8 2.7V19h1v2H7v-2h1v-4.3l2.8-2.7L8 9.3V5H7V3Zm3 2v3.5L12 10.5l2-2V5h-4Zm0 14h4v-3.5l-2-2-2 2V19Z" />
                                            </svg>
                                        {:else}
                                            +
                                        {/if}
                                    </button>
                                </div>
                            </li>
                        {/each}
                    {/if}
                {/if}
            </ul>
        </form>
    {/if}
</aside> 
<!-- aside ist container fuer ergaenzende inhalte -->

<style>
    .friends-drawer
    {
        position: fixed;
        left: 0;
        top: 100px;
        bottom: 60px; /* 40 weniger als top, weil header 40px groeser ist als footer*/
        width: 50px;
        overflow: hidden; 
        /* schneidet alles raus was aus drawer rausstehen wuerde */
        transition: width 0.3s ease;
    }

    .friends-drawer.expanded
    {
        width: max(320px, 33.333vw);
        /* 1/3 vom bildschirm (33%) und mingroese von 320px fuer kleine bildschirme */
    }


    .friends-panel
    {
        margin-left: 55px;
        height: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        padding: 36px;
    }

    .friends-panel:hover
    {
        border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.02);
    }

    h2
    {
        margin: 0;
        color: #0AEB00;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-align: left;
    }

    .title-select-wrap
    {
        margin: 0;
    }

    .title-select
    {
        border: none;
        background: transparent;
        color: #0AEB00;
        font: inherit;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        padding: 0;
    }

    .user-list
    {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .user-list li
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(10, 235, 0, 0.15);
        background: rgba(15, 19, 20, 0.4);
        padding: 8px 10px;
    }

    .info-row
    {
        color: #fff;
        justify-content: flex-start;
    }

    .info-row.error
    {
        color: #ffb3b3;
        border-color: rgba(255, 68, 68, 0.4);
        background: rgba(255, 68, 68, 0.1);
    }

    .actions
    {
        display: flex;
        gap: 6px;
    }

    .header-row
    {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
    }

    .user-name
    {
        color: #fff;
    }

    .profile-btn,
    .remove-btn,
    .add-btn
    {
        border: 1px solid rgba(10, 235, 0, 0.4);
        background: rgba(10, 235, 0, 0.08);
        color: #d8ffd7;
        cursor: pointer;
        font-size: 0.78rem;
        padding: 4px 8px;
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

    .bell-btn
    {
        width: 28px;
        height: 28px;
        padding: 0;
        border: none;
        background: transparent;
        color: #fff;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .bell-btn svg
    {
        width: 18px;
        height: 18px;
        fill: currentColor;
    }

    .bell-btn.has-requests
    {
        color: #ff4444;
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

    .profile-btn svg
    {
        width: 16px;
        height: 16px;
        fill: #fff;
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

    .hourglass-icon
    {
        width: 13px;
        height: 13px;
        fill: currentColor;
        display: block;
    }
</style>
