<script lang="ts">

    import { onMount } from 'svelte';
    import Button from './Button.svelte';
    import FriendListItem from './FriendListItem.svelte';
    import IncomingFriendRequestItem from './IncomingFriendRequestItem.svelte';
    import OnlineUserListItem from './OnlineUserListItem.svelte';
    import BellIcon from './BellIcon.svelte';
    import {
        friendsService,
        type IncomingFriendRequest,
        type OutgoingFriendRequest,
        type UserSummary,
    } from '../services/friendsService';
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
            if (selectedList === 'friends')
            {
                const [loadedFriends, loadedIncomingRequests, loadedOutgoingRequests] = await Promise.all([
                    friendsService.getMyFriends(),
                    friendsService.getIncomingFriendRequests(),
                    friendsService.getOutgoingFriendRequests(),
                ]);

                friends = loadedFriends;
                onlineUsers = [];
                incomingFriendRequests = loadedIncomingRequests;
                outgoingFriendRequests = loadedOutgoingRequests;
            }
            else
            {
                const currentUserId = authStore.getCurrentUserId();
                const [loadedFriends, loadedOnlineUsers, loadedIncomingRequests, loadedOutgoingRequests] = await Promise.all([
                    friendsService.getMyFriends(),
                    friendsService.getOnlineUsers(),
                    friendsService.getIncomingFriendRequests(),
                    friendsService.getOutgoingFriendRequests(),
                ]);

                friends = loadedFriends;
                onlineUsers = loadedOnlineUsers.filter((user) => user.id !== currentUserId); // mich rausfiltern
                incomingFriendRequests = loadedIncomingRequests;
                outgoingFriendRequests = loadedOutgoingRequests;
            }
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

    async function handleFriendRequest(userId: string)
    {
        try
        {
            await friendsService.sendFriendRequest(userId);
            await loadUsers();
        }
        catch (error)
        {
            errorMessage = error instanceof Error ? error.message : 'Error regarding friend request';
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

    async function removeFriend(userId: string)
    {
        try
        {
            await friendsService.removeFriend(userId);
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
                    <BellIcon />
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
                        <IncomingFriendRequestItem
                            userId={request.userFrom.id}
                            username={request.userFrom.username}
                            onAccept={() => handleFriendRequest(request.userFrom.id)}
                        />
                    {/each}
                {:else}
                    {#if selectedList === 'friends'}
                        {#each friends as user}
                            <FriendListItem
                                userId={user.id}
                                username={user.username}
                                onRemove={() => removeFriend(user.id)}
                            />
                        {/each}
                    {:else}
                        {#each onlineUsers as user}
                            <OnlineUserListItem
                                userId={user.id}
                                username={user.username}
                                isPending={hasOutgoingRequestTo(user.id) && !hasIncomingRequestFrom(user.id)}
                                hasIncomingRequest={hasIncomingRequestFrom(user.id)}
                                hasOutgoingRequest={hasOutgoingRequestTo(user.id)}
                                isDisabled={friends.some((entry) => entry.id === user.id) || hasOutgoingRequestTo(user.id)}
                                onAction={() => handleFriendRequest(user.id)}
                            />
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

    .header-row
    {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
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

    .bell-btn.has-requests
    {
        color: #ff4444;
    }

</style>
