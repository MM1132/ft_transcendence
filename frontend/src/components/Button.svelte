<script lang="ts">
    interface Props
    {
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        form?: string;
        variant?: 'default' | 'save';
        class?: string;
        children: any;
    }

    const {
        type = 'button',
        disabled = false,
        form,
        variant = 'default',
        class: className = '',
        children,
        ...rest
    }: Props = $props();
</script>

<button {type} {disabled} {form} {...rest} class={className} class:save={variant === 'save'}>
    {@render children()}
</button>

<style>
    button {
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

    button.save {
        font-size: 1.1rem;
        font-family: 'Orbitron', sans-serif;
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

    /* custom class from parent */
    button.save-settings {
        background: rgba(10, 235, 0, 0.1);
        color: #0AEB00;
        border: 1px solid #0AEB00;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 10px;
        font-size: 0.8rem;
        transition: all 0.2s;
        font-family: inherit;
    }
</style>



<!-- OLD APPROACH -->
 <!-- <script lang="ts">
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

 -->