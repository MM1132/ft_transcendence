<script lang="ts">
    interface Props
    {
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        form?: string;
        variant?:
            | 'default'
            | 'save'
            | 'reset'
            | 'expand-trigger-left'
            | 'expand-trigger-right'
            | 'expand-trigger-bottom';
        onclick?: (event: MouseEvent) => void;
        ariaExpanded?: boolean;
        ariaLabel?: string;
        children: any;
    }
    
    const {
        type = 'button',
        disabled = false,
        form,
        variant = 'default',
        onclick,
        ariaExpanded,
        ariaLabel,
        children,
    }: Props = $props();
</script>

<button
    {type}
    {disabled}
    {form}
    {onclick}
    aria-expanded={ariaExpanded}
    aria-label={ariaLabel}
    class:save={variant === 'save'}
    class:reset={variant === 'reset'}
    class:expand-trigger-left={variant === 'expand-trigger-left'}
    class:expand-trigger-right={variant === 'expand-trigger-right'}
    class:expand-trigger-bottom={variant === 'expand-trigger-bottom'}
>
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

    button.reset
    {
        width: auto;
        min-width: 120px;
        padding: 10px 16px;
        border: 1px solid #ff4444;
        background: rgba(255, 68, 68, 0.15);
        color: #ff6b6b;
    }

    button.reset:hover:not(:disabled)
    {
        background: rgba(255, 68, 68, 0.28);
        color: #ffd5d5;
    }

    button.expand-trigger-left
    {
        position: absolute;
        left: 8px;
        width: 40px;
        height: 100%;
        padding: 0;
        letter-spacing: 1px;
        writing-mode: vertical-rl;
        transform: rotate(180deg);
    }

    button.expand-trigger-right
    {
        position: absolute;
        right: 8px;
        width: 40px;
        height: 100%;
        padding: 0;
        letter-spacing: 1px;
        writing-mode: vertical-rl;
    }

    button.expand-trigger-bottom
    {
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 8px;
        width: auto;
        height: 40px;
        padding: 0;
        letter-spacing: 1px;
    }
</style>
