<script lang="ts">
    interface Props
    {
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        form?: string;
        variant?: 'default' | 'save';
        children: any;
    }
    
    const { type = 'button', disabled = false, form, variant = 'default', children }: Props = $props();
</script>

<button {type} {disabled} {form} class:save={variant === 'save'}>
    {@render children()}
</button>

<style>
    button
    {
        width: 90%;
        padding: 1.7rem;
        background: #0AEB00;
        color: #fff;
        border: none;
        border-radius: 0px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s;
    }
    
    button:hover:not(:disabled)
    {
        background: #B13BCC;
    }
    
    button:disabled
    {
        opacity: 0.6;
        cursor: not-allowed;
    }

    button.save
    {
        font-size: 1.1rem;
        font-family: 'Orbitron', sans-serif;
    }
</style>
