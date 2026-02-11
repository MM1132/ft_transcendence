<script lang="ts">
    interface Props
    {
        label?: string;
        checked?: boolean;
        disabled?: boolean;
        onToggle?: (checked: boolean) => void;
    }

    let {
        label = 'Setting',
        checked = $bindable(false),
        disabled = false,
        onToggle
    }: Props = $props();

    function handleChange()
    {
        onToggle?.(checked);
    }
</script>

<label class="toggle-row" class:is-on={checked} class:is-disabled={disabled}>
    <span class="toggle-label">{label}</span>

    <span class="switch">
        <input
            type="checkbox"
            bind:checked
            {disabled}
            onchange={handleChange}
        />
        <span class="slider"></span>
    </span>
</label>

<style>
    .toggle-row
    {
        width: 100%;
        padding: 1.1rem 1.3rem;
        border: 1px solid rgba(10, 235, 0, 0.25);
        background: rgba(15, 19, 20, 0.85);
        color: #ffffff;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        box-sizing: border-box;
        cursor: pointer;
        transition: border-color 0.2s, background 0.2s;
    }

    .toggle-label
    {
        flex: 1;
        text-align: left;
        line-height: 1.35;
        overflow-wrap: anywhere;
    }

    .toggle-row:hover
    {
        border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.06);
    }

    .toggle-row.is-disabled
    {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .switch
    {
        position: relative;
        width: 56px;
        height: 30px;
        flex-shrink: 0;
    }

    .switch input
    {
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        cursor: pointer;
        z-index: 2;
    }

    .switch input:disabled
    {
        cursor: not-allowed;
    }

    .slider
    {
        position: absolute;
        inset: 0;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.22);
        transition: background 0.2s;
    }

    .slider::before
    {
        content: '';
        position: absolute;
        width: 22px;
        height: 22px;
        top: 4px;
        left: 4px;
        border-radius: 50%;
        background: #ffffff;
        transition: transform 0.2s;
    }

    .switch input:checked + .slider
    {
        background: #0AEB00;
    }

    .switch input:checked + .slider::before
    {
        transform: translateX(26px);
    }
</style>
