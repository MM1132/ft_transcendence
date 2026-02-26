<script lang="ts">
    import ToggleSetting from './Toggle.svelte';
    import InputField from './Input.svelte';
    import { onMount } from 'svelte';
    import { settingsService } from '../services/settingsService';

    let fullName = $state('');
    let bio = $state('');
    let birthDate = $state('');
    let twoFactorEnabled = $state(false);
    let notificationsEnabled = $state(true);
    let isSaving = $state(false);
    let feedback = $state('');
    let feedbackType = $state<'success' | 'error' | '' > (''); // erlaubt sind  success, error oder leer und ('') ist startwert

    onMount(async () => { // beim oeffnen der seite, wird funktion aufgerufen, laedt user daten
        try {
            const settings = await settingsService.getUserSettings(); // await wartet auf server antwort
            fullName = settings.fullName ?? '';
            bio = settings.bio ?? '';
            birthDate = settings.birthday ?? '';
        } catch (error) {
            feedback = error instanceof Error ? error.message : 'Could not load settings';
            feedbackType = 'error';
        }
    });

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault(); // verhindert, dass seite neu geladen wird
        isSaving = true;
        feedback = '';
        feedbackType = '';

        try
        { // werte in settingsService updaten, trim und wenn leer dann null
            const updated = await settingsService.updateUserSettings({
                fullName: fullName.trim() || null,
                bio: bio.trim() || null,
                birthday: birthDate || null,
            });
            // bei succes werte in form updaten
            fullName = updated.fullName ?? '';
            bio = updated.bio ?? '';
            birthDate = updated.birthday ?? '';
            feedback = 'Settings saved';
            feedbackType = 'success';
        }
        catch (error)
        {
            feedback = error instanceof Error ? error.message : 'Save failed';
            feedbackType = 'error';
        }
        finally
        {
            isSaving = false;
        }
    }
</script>
<!-- state macht variable reaktiv damit bind sie aendern kann -->

<div id="settings-form">
    <form id="settings-form-main" class="settings-content" onsubmit={handleSubmit}>
        <h2>settings</h2>
        <InputField
            id="full-name"
            name="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            bind:value={fullName}
            minlength={1}
            maxlength={120}
            summary
        />
        <InputField
            id="bio"
            name="bio"
            label="Bio"
            placeholder="Write something about yourself..."
            bind:value={bio}
            minlength={1}
            maxlength={500}
            multiline
            rows={6}
            summary
        />
        <InputField
            id="birth-date"
            name="birthDate"
            label="Date"
            type="date"
            placeholder="Select your birth date"
            bind:value={birthDate}
            summary
        />
        <ToggleSetting label="very long text blablabla balbalblablablablablabla
         hmmmmmmmmm still not long enough, what do i do here ahhhhhhhhhhhhhhhhhhhh now we hit the 2nd line,
          looks weird.... whatever" />
        <ToggleSetting label="Two Factor Authentication" bind:checked={twoFactorEnabled} />
        <ToggleSetting label="Notifications" bind:checked={notificationsEnabled} />

        {#if feedback}
            <p class={feedbackType}>
                {feedback}
            </p>
        {/if}

        {#if isSaving} 
            <p>Saving...</p>
        {/if}
        <!-- ladehinweis, falls backend haengt oder verbindung stirbt -->
    </form>
</div>
<!-- bind: aendert die variable gleich mit -->

<style>
    #settings-form
    {
        width: min(1000px, 90vw);
        height: min(80vh, 1100px);
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        transition: all 0.3s;
        box-sizing: border-box;
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
    }

    /* p nimmt ein element, dass die class succes hat. p weil nur text */
    p.success 
    {
        color: #0AEB00;
        margin: 0;
    }

    p.error
    {
        color: #ff5e5e;
        margin: 0;
    }

</style>
