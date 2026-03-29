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
            | 'expand-trigger-bottom'
            | 'join'
            | 'create'
            | 'cancel'
            | 'ready'
            | 'noready'
            | 'kick';
        onclick?: (event: MouseEvent) => void;
        ariaExpanded?: boolean;
        ariaLabel?: string;
        class?: string;
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
        class: className = '',
        children,
        ...rest
    }: Props = $props();
</script>

<button
    {type}
    {disabled}
    {form}
    {onclick}
    aria-expanded={ariaExpanded}
    aria-label={ariaLabel}
    class={className}
    class:save={variant === 'save'}
    class:reset={variant === 'reset'}
    class:expand-trigger-left={variant === 'expand-trigger-left'}
    class:expand-trigger-right={variant === 'expand-trigger-right'}
    class:expand-trigger-bottom={variant === 'expand-trigger-bottom'}
    class:join={variant === 'join'}
    class:create={variant === 'create'}
    class:cancel={variant === 'cancel'}
    class:ready={variant === 'ready'}
    class:noready={variant === 'noready'}
    class:kick={variant === 'kick'}
>
    {@render children()}
</button>
   

<style>
    button
    {
        width: 90%;
        padding: 1.7rem;
        background: #0AEB00;
        /* background: #0ec904; */
        color: #fff;
        border: none;
        /* border-left: 2px solid #ffffff; */
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
        /* background: #ffffff38; */
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

    button.join
    {
        width: 50px;
        height: 40px;
        float: right;
        font-size: 14px;
        padding: 0;
        /* display: flex; */
        align-items: center;
        justify-content: center;
    }

    button.create
    {
        width: 40px;
        height: 40px;
        /* float: right; */
        font-size: 14px;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #B13BCC;
        background: none;
    }

    button.cancel
    {
        background: transparent;
        color: #ff4444;
        border: 1px solid #ff4444;
    }

    button.cancel:hover
    {
        background: #ff4444;
        color: #fff;
    }

    button.noready
    {
        width: auto;
        min-width: 120px;
        background: rgba(177, 59, 204, 0.15);
        color: #ffffff;
        border: 1px solid rgb(177, 59, 204);

    }

    button.ready
    {
        width: auto;
        min-width: 120px;
        background: #B13BCC;
        color:  #ffffff;
        border: 1px solid rgba(177, 59, 204, 0);

    }

    button.ready.active
    {
        background: #0AEB00;
        color:  #ffffff;
    }

    button.kick
    {
        width: auto;
        min-width: 60px;
        padding: 8px 8px;
        border: 1px solid #ff4444;
        background: transparent;
        color: #ff6b6b;
    }

    button.kick:hover, 
    button.kick.active
    { 
        background: #ff4444;
        color: #fff;
    }
    

</style>

