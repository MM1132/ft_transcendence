<script lang="ts">
    import InputField from './Input.svelte';
    import Button from './Button.svelte';
    import { onMount } from 'svelte';
    import { settingsService } from '../services/settingsService';
    import { avatarStore } from '../stores/avatarStore';
    import { isDefaultAvatarUrl } from '../services/settingsService';

    let fullName = $state('');
    let bio = $state('');
    let birthDate = $state('');
    let twoFactorEnabled = $state(false);
    let notificationsEnabled = $state(true);

    const { setStatus } = $props<{
        setStatus?: (status: { isSaving: boolean; feedback: string; feedbackType: 'success' | 'error' | '' }) => void;
    }>();

    let avatarUrl = $state<string | null>(null);
    let fileInput: HTMLInputElement;
    let isUploadingAvatar = $state(false);

    function withAvatarVersion(url: string): string {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}v=${Date.now()}`;
    }

    onMount(async () => {
        try {
            const [settings, myAvatarUrl] = await Promise.all([
                settingsService.getUserSettings(),
                settingsService.getMyAvatarUrl(),
            ]);
            fullName = settings.fullName ?? '';
            bio = settings.bio ?? '';
            birthDate = settings.birthday ?? '';
            avatarUrl = myAvatarUrl ? withAvatarVersion(myAvatarUrl) : null;
            avatarStore.set(avatarUrl);
        } catch (error) {
            setStatus?.({
                isSaving: false,
                feedback: error instanceof Error ? error.message : 'Could not load settings',
                feedbackType: 'error',
            });
        }
    });

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        setStatus?.({ isSaving: true, feedback: '', feedbackType: '' });

        try {
            const updated = await settingsService.updateUserSettings({
                fullName: fullName.trim() || null,
                bio: bio.trim() || null,
                birthday: birthDate || null,
            });

            fullName = updated.fullName ?? '';
            bio = updated.bio ?? '';
            birthDate = updated.birthday ?? '';
            setStatus?.({ isSaving: false, feedback: 'Settings saved', feedbackType: 'success' });
        } catch (error) {
            setStatus?.({
                isSaving: false,
                feedback: error instanceof Error ? error.message : 'Save failed',
                feedbackType: 'error',
            });
        }
    }

    async function handleAvatarSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) return;

        const file = target.files[0];

        if (file.size > 2 * 1024 * 1024) {
            setStatus?.({
                isSaving: false,
                feedback: 'Image must be smaller than 2MB',
                feedbackType: 'error',
            });
            target.value = '';
            return;
        }

        isUploadingAvatar = true;
        setStatus?.({ isSaving: false, feedback: '', feedbackType: '' });

        try {
            const uploadedAvatarUrl = await settingsService.uploadAvatar(file);

            if (uploadedAvatarUrl) {
                avatarUrl = withAvatarVersion(uploadedAvatarUrl);
            } else {
                const myAvatarUrl = await settingsService.getMyAvatarUrl();
                avatarUrl = myAvatarUrl ? withAvatarVersion(myAvatarUrl) : null;
            }
            avatarStore.set(avatarUrl);

            setStatus?.({
                isSaving: false,
                feedback: 'Avatar uploaded successfully',
                feedbackType: 'success',
            });
        } catch (error) {
            setStatus?.({
                isSaving: false,
                feedback: error instanceof Error ? error.message : 'Avatar upload failed',
                feedbackType: 'error',
            });
        } finally {
            isUploadingAvatar = false;
            target.value = '';
        }
    }

    async function handleDeleteAvatar() {

        if (!avatarUrl || isDefaultAvatarUrl(avatarUrl)) {
            alert("This pretty face is your default avatar. You're welcome. \nDelete me? Nice try snake.\
             \nUpload a new one if you dare.")
            return;
    }
        if (!confirm('Are you sure you want to delete your avatar?')) return;

        isUploadingAvatar = true;
        setStatus?.({ isSaving: false, feedback: '', feedbackType: '' });

        try {
            await settingsService.deleteAvatar();
            avatarUrl = null;
            avatarStore.set(null);
            setStatus?.({
                isSaving: false,
                feedback: 'Avatar deleted successfully',
                feedbackType: 'success',
            });
        } catch (error) {
            setStatus?.({
                isSaving: false,
                feedback: error instanceof Error ? error.message : 'Avatar deletion failed',
                feedbackType: 'error',
            });
        } finally {
            isUploadingAvatar = false;
        }
    }

    function handleReset() {
        fullName = '';
        bio = '';
        birthDate = '';
        twoFactorEnabled = false;
        notificationsEnabled = false;
        setStatus?.({ isSaving: false, feedback: 'Click Save to apply.', feedbackType: 'error' });
    }
</script>

<div id="settings-form">
    <form id="settings-form-main" class="settings-content" onsubmit={handleSubmit}>
        <h2>Settings</h2>

        <div class="avatar-section">
            <div class="avatar-preview">
                {#if avatarUrl}
                    <img src={avatarUrl} alt="User Avatar" />
                {:else}
                    <div class="avatar-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                {/if}
            </div>

            <div class="avatar-actions">
                <input
                    type="file"
                    accept="image/*"
                    bind:this={fileInput}
                    onchange={handleAvatarSelect}
                    style="display: none;"
                />

                <button
                    type="button"
                    class="btn-change-avatar"
                    onclick={() => fileInput?.click()}
                    disabled={isUploadingAvatar}
                >
                    {isUploadingAvatar ? '...' : 'Change Avatar'}
                </button>

                {#if avatarUrl}
                    <button
                        type="button"
                        class="btn-delete-avatar"
                        onclick={handleDeleteAvatar}
                        disabled={isUploadingAvatar}
                    >
                        Remove
                    </button>
                {/if}
            </div>
        </div>

        <InputField id="full-name" name="fullName" label="Full Name" placeholder="Enter your full name" bind:value={fullName} minlength={1} maxlength={100} summary />
        <InputField id="bio" name="bio" label="Bio" placeholder="Write something about yourself..." bind:value={bio} minlength={1} maxlength={500} multiline rows={6} summary />
        <InputField id="birth-date" name="birthDate" label="Date" type="date" placeholder="Select your birth date" bind:value={birthDate} summary />

        <div class="form-actions">
            <Button type="button" variant="reset" onclick={handleReset}>Reset</Button>
        </div>
    </form>
</div>

<style>
    #settings-form
    {
        width: min(1000px, 90vw);
        height: min(80vh, 1100px);
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        transition: all 0.3s;
        box-sizing: border-box;
        overflow: hidden;
    }

    #settings-form:hover
    {
    border-color: #0AEB00;
    background: rgba(10, 235, 0, 0.02);
    transform: translateY(-5px);
    }

    h2
    {
    align-self: flex-start;
    margin: 0;
    color: #0AEB00;
    text-transform: uppercase;
    letter-spacing: 1px;
    }

    .settings-content
    {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 40px;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
    }

    .form-actions
    {
        margin-top: 20px;
    }

    .avatar-section
    {
        display: flex;
        align-items: center;
        gap: 24px;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid rgba(10, 235, 0, 0.1);
    }

    .avatar-preview
    {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid rgba(10, 235, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(15, 19, 20, 0.8);
    }

    .avatar-preview img
    {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .avatar-placeholder
    {
        width: 50px;
        height: 50px;
        color: rgba(10, 235, 0, 0.5);
    }

    .avatar-actions
    {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .btn-change-avatar 
    {
        background: rgba(10, 235, 0, 0.1);
        color: #0AEB00;
        border: 1px solid #0AEB00;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.8rem;
        transition: all 0.2s;
        font-family: inherit;
    }

    .btn-change-avatar:hover:not(:disabled)
    {
        background: rgba(10, 235, 0, 0.2);
        box-shadow: 0 0 10px rgba(10, 235, 0, 0.3);
    }

    .btn-delete-avatar
    {
        background: rgba(255, 68, 68, 0.15);
        color: #ff5e5e;
        border: 1px solid rgba(255, 94, 94, 0.5);
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.8rem;
        transition: all 0.2s;
        font-family: inherit;
    }

    .btn-delete-avatar:hover:not(:disabled)
    {
        background: rgba(255, 94, 94, 0.1);
        border-color: #ff5e5e;
        box-shadow: 0 0 10px rgba(255, 94, 94, 0.2);
    }

    button:disabled
    {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
