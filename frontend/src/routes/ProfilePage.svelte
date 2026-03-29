<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '../stores/authStore';
  import { currentPath, selectedProfileUserId } from '../stores/router';
  import { navigateTo } from '../stores/router';
  import { settingsService, type UserSettings } from '../services/settingsService';
  import { userService, type UserDetails } from '../services/userService';
  import { SESSION_STORAGE_KEY } from '../utils/constants';

  type ProfileData = UserDetails & UserSettings;

  let profile = $state<ProfileData | null>(null);
  let isLoading = $state(true);
  let errorMessage = $state('');

  function getProfileSlugFromPath(path: string): string | null {
    const prefix = '/profile/';
    if (!path.startsWith(prefix)) return null;

    const slug = decodeURIComponent(path.slice(prefix.length).trim());
    return slug || null;
  }

  async function resolveProfileUserId(): Promise<string | null> {
    if ($selectedProfileUserId) return $selectedProfileUserId;

    const slug = getProfileSlugFromPath($currentPath);
    if (!slug) return null;

    const allUsers = await userService.getAllUsers();
    const matchedUser = allUsers.find((user) => user.username === slug);

    return matchedUser?.id ?? null;
  }

  function formatDate(value: string | null): string {
    if (!value) return 'Not set';

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return value;

    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  async function loadProfile(): Promise<void> {
    if (!$authStore.isLoggedIn) {
      // If a session is already persisted, wait for auth store sync instead of redirecting early.
      if (sessionStorage.getItem(SESSION_STORAGE_KEY)) return;

      isLoading = false;
      navigateTo('/login');
      return;
    }

    isLoading = true;
    errorMessage = '';

    try {
      const routeUserId = await resolveProfileUserId();
      const isOwnProfile = !routeUserId || routeUserId === $authStore.userId;

      if (isOwnProfile) {
        const [user, settings] = await Promise.all([
          userService.getMyProfile(),
          settingsService.getUserSettings(),
        ]);

        profile = {
          ...user,
          ...settings,
        };
      } else {
        profile = await userService.getProfileById(routeUserId);
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Profile could not be loaded.';
      profile = null;
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    void loadProfile();
  });

  $effect(() => {
    $currentPath;
    if (!$authStore.isLoggedIn) return;
    void loadProfile();
  });
</script>

<main class="profile-page">
  {#if isLoading}
    <section class="profile-card state-card">
      <p>Profile is loading...</p>
    </section>
  {:else if errorMessage}
    <section class="profile-card state-card error-card">
      <h1>Profile</h1>
      <p>{errorMessage}</p>
    </section>
  {:else if profile}
    <section class="profile-hero">
      <div class="profile-card hero-card">
        <div class="avatar-wrap">
          <img src={profile.avatarUrl} alt="Profile avatar" class="profile-avatar" />
        </div>
        <div class="hero-copy">
          <p class="eyebrow">Your Profile</p>
          <h1>{profile.fullName || profile.username}</h1>
          <p class="username">@{profile.username}</p>
          <p class="bio">{profile.bio || 'No bio yet. Add one in your settings.'}</p>
          <div class="status-row">
            <span class:online={profile.online} class="status-pill">
              {profile.online ? 'Online' : 'Offline'}
            </span>
            <span class="status-pill muted">Balance: {profile.balance}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="profile-grid">
      <article class="profile-card">
        <p class="card-label">Full name</p>
        <p class="card-value">{profile.fullName || 'Not set'}</p>
      </article>

      <article class="profile-card">
        <p class="card-label">Email</p>
        <p class="card-value">{profile.email}</p>
      </article>

      <article class="profile-card">
        <p class="card-label">Birthday</p>
        <p class="card-value">{formatDate(profile.birthday)}</p>
      </article>

      <article class="profile-card">
        <p class="card-label">Member since</p>
        <p class="card-value">{formatDate(profile.createdAt)}</p>
      </article>

      <article class="profile-card wide-card">
        <p class="card-label">About</p>
        <p class="card-value body-copy">{profile.bio || 'Tell other players something about you in settings.'}</p>
      </article>

      <article class="profile-card wide-card">
        <p class="card-label">Last activity</p>
        <p class="card-value">{formatDate(profile.lastActionAt)}</p>
      </article>
    </section>
  {/if}
</main>

<style>
  .profile-page {
    min-height: 100vh;
    width: 100vw;
    max-width: 100%;
    padding: 110px 24px 56px;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .profile-hero,
  .profile-grid {
    width: min(1100px, 100%);
    max-width: 1100px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
  }

  .profile-card {
    border: 1px solid rgba(10, 235, 0, 0.18);
    background: rgba(15, 19, 20, 0.92);
    padding: 24px;
    color: white;
    backdrop-filter: blur(10px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    min-width: 0;
    box-sizing: border-box;
  }

  .hero-card {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 28px;
    margin-bottom: 18px;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
  }

  .avatar-wrap {
    display: flex;
    justify-content: center;
  }

  .profile-avatar {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #0AEB00;
    background: rgba(255, 255, 255, 0.05);
  }

  .eyebrow,
  .card-label,
  .username {
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .eyebrow,
  .card-label {
    color: #0AEB00;
    font-size: 0.82rem;
  }

  h1 {
    margin: 10px 0 8px;
    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1;
    overflow-wrap: anywhere;
  }

  .username {
    margin: 0 0 16px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
    overflow-wrap: anywhere;
  }

  .bio,
  .body-copy,
  .card-value {
    margin: 0;
    line-height: 1.6;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .status-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  }

  .status-pill {
    border: 1px solid rgba(255, 255, 255, 0.14);
    padding: 8px 14px;
    font-size: 0.9rem;
  }

  .status-pill.online {
    border-color: #0AEB00;
    color: #0AEB00;
  }

  .status-pill.muted {
    color: rgba(255, 255, 255, 0.75);
  }

  .wide-card {
    grid-column: span 2;
  }

  .state-card {
    max-width: 700px;
    margin: 0 auto;
  }

  .error-card {
    border-color: rgba(255, 68, 68, 0.5);
    color: #ffb0b0;
  }

  @media (max-width: 760px) {
    .profile-page {
      padding: 96px 16px 88px;
    }

    .profile-grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .profile-card {
      padding: 18px;
    }

    .hero-card {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 18px;
    }

    .profile-avatar {
      width: 140px;
      height: 140px;
    }

    .status-row {
      justify-content: center;
    }

    .wide-card {
      grid-column: span 1;
    }
  }
</style>
