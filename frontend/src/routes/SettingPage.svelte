<script lang="ts">
  import Button from '../components/Button.svelte';
  import SettingsForm from "../components/SettingsForm.svelte";

  let isSaving = $state(false);
  let feedback = $state('');
  let feedbackType = $state<'success' | 'error' | ''>('');

  function setStatus(status: { isSaving: boolean; feedback: string; feedbackType: 'success' | 'error' | '' }) {
    isSaving = status.isSaving;
    feedback = status.feedback;
    feedbackType = status.feedbackType;
  }

  $effect(() => {
    if (!feedback || isSaving) return;
    const timeoutId = setTimeout(() => {
      feedback = '';
      feedbackType = '';
    }, 3000);
    return () => clearTimeout(timeoutId);
  });
</script>


<main>
  <div class="settings-layout">
    <SettingsForm {setStatus} />
    <div class="settings-actions">
      <Button
        class="side-save-btn"
        type="submit"
        form="settings-form-main"
        variant="save"
        disabled={isSaving}
      >
        Save
      </Button>
    </div>
  </div>

  {#if feedback}
    <div class={feedbackType === 'success' ? 'success-overlay' : 'error-overlay'}>
      <p>{feedback}</p>
    </div>
  {/if}

  {#if isSaving}
    <div class="loading-overlay">
      <p>Saving...</p>
    </div>
  {/if}
</main>



<style>
  .settings-layout
  {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: stretch;
  }

  .settings-actions
  {
    width: 180px;
    align-self: stretch;
    display: flex;
  }

  .settings-actions :global(.side-save-btn)
  {
    width: 100%;
    height: 100%;
  }

  main
  {
    padding: 110px 24px 56px;
  }

  .loading-overlay,
  .error-overlay,
  .success-overlay
  {
    position: fixed;
    bottom: 90px;
    right: 20px;
    padding: 20px 30px;
    font-weight: bold;
    animation: slideIn 0.3s ease;
  }

  .loading-overlay
  {
    background: rgba(10, 235, 0, 0.2);
    border: 1px solid #0AEB00;
    color: #0AEB00;
  }

  .error-overlay
  {
    background: rgba(255, 68, 68, 0.2);
    border: 1px solid #ff4444;
    color: #ff4444;
  }

  .success-overlay
  {
    background: rgba(10, 235, 0, 0.3);
    border: 1px solid #0AEB00;
    color: #0AEB00;
  }

  @keyframes slideIn
  {
    from
    {
      transform: translateX(400px);
      opacity: 0;
    }
    to
    {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>
