<script>
  import Button from '../components/Button.svelte';
  import SettingsForm from "../components/SettingsForm.svelte";
</script>

<div class="settings-layout">
  <SettingsForm />
  <div class="settings-actions">
    <Button type="submit" form="settings-form-main" variant="save">Save</Button>
  </div>
</div>

<style>
  .settings-layout
  {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
  }

  .settings-actions
  {
    width: 150px;
    display: flex;
    /* flex-direction: column-reverse; */
  }
</style>