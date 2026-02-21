<script lang="ts">
    import { tick } from 'svelte';

    interface Props
    {
        label?: string;
        value?: string;
        type?: 'text' | 'email' | 'password' | 'search' | 'url';
        placeholder?: string;
        id?: string;
        name?: string;
        required?: boolean;
        disabled?: boolean;
        minlength?: number;
        maxlength?: number;
        multiline?: boolean;
        rows?: number;
        summary?: boolean;
    }

    let isEditing = $state(false);
    let inputEl = $state<HTMLInputElement | null>(null);
    let textareaEl = $state<HTMLTextAreaElement | null>(null);

    let {
        label = 'Field',
        value = $bindable(''),
        type = 'text',
        placeholder = '',
        id,
        name,
        required = false,
        disabled = false,
        minlength,
        maxlength,
        multiline = false,
        rows = 5,
        summary = false
    }: Props = $props();

    async function startEditing()
    {
        if (disabled)
            return;
        isEditing = true;
        await tick();
        if (multiline)
            textareaEl?.focus();
        else
            inputEl?.focus();
    }

    function finishEditing()
    {
        isEditing = false;
    }

    function handleSummaryKeydown(event: KeyboardEvent)
    {
        if (event.key === 'Enter' || event.key === ' ')
        {
            event.preventDefault();
            startEditing();
        }
    }

    function handleInputKeydown(event: KeyboardEvent)
    {
        if (event.key === 'Enter' && !multiline)
        {
            event.preventDefault();
            finishEditing();
            inputEl?.blur();
        }
        if (event.key === 'Escape')
        {
            event.preventDefault();
            finishEditing();
        }
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && multiline)
        {
            event.preventDefault();
            finishEditing();
            textareaEl?.blur();
        }
    }
</script>

<label class="input-field" for={id}>
    {#if summary && !isEditing}
        <div
            class="summary-view"
            class:is-disabled={disabled}
            role="button"
            tabindex={disabled ? -1 : 0}
            onclick={startEditing}
            onkeydown={handleSummaryKeydown}
        >
            <span class="summary-label">{label}</span>
            <span class="summary-value" class:is-placeholder={!value}>
                {value || placeholder}
            </span>
        </div>
    {:else}
        {#if !summary}
            <span class="input-label-inline">{label}</span>
        {/if}

        {#if multiline}
            <textarea
                bind:value
                bind:this={textareaEl}
                {id}
                {name}
                {placeholder}
                {required}
                {disabled}
                {minlength}
                {maxlength}
                {rows}
                onkeydown={handleInputKeydown}
                onblur={summary ? finishEditing : undefined}
            ></textarea>
        {:else}
            <input
                bind:value
                bind:this={inputEl}
                {id}
                {name}
                {type}
                {placeholder}
                {required}
                {disabled}
                {minlength}
                {maxlength}
                onkeydown={handleInputKeydown}
                onblur={summary ? finishEditing : undefined}
            />
        {/if}

        {#if summary}
            <div class="editor-actions">
                <button type="button" onclick={finishEditing}>Done</button>
            </div>
        {/if}
    {/if}

    {#if maxlength !== undefined && (!summary || isEditing)}
        <span class="char-count">{value.length}/{maxlength}</span>
    {/if}
</label>

<style>
    .input-field
    {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        gap: 8px;
    }

    .summary-view
    {
        width: 100%;
        border: 1px solid rgba(10, 235, 0, 0.35);
        background: rgba(15, 19, 20, 0.85);
        color: #fff;
        font-size: 1rem;
        padding: 1rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        cursor: text;
        transition: border-color 0.2s, background 0.2s;
    }

    .summary-view:hover,
    .summary-view:focus-visible
    {
        border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.06);
        outline: none;
    }

    .summary-view.is-disabled
    {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .summary-label
    {
        color: rgba(177, 59, 204, 0.95);
        text-transform: uppercase;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.45px;
    }

    .summary-value
    {
        color: #fff;
        text-align: right;
        overflow-wrap: anywhere;
    }

    .summary-value.is-placeholder
    {
        color: rgba(255, 255, 255, 0.55);
    }

    .input-label-inline
    {
        position: absolute;
        top: 10px;
        right: 12px;
        color: rgba(177, 59, 204, 0.95);
        text-transform: uppercase;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.45px;
        pointer-events: none;
        z-index: 2;
    }

    input,
    textarea
    {
        width: 100%;
        border: 1px solid rgba(10, 235, 0, 0.35);
        background: rgba(15, 19, 20, 0.85);
        color: #fff;
        font-size: 1rem;
        padding: 1.65rem 1rem 0.9rem;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s, background 0.2s;
    }

    textarea
    {
        resize: vertical;
        min-height: 120px;
        line-height: 1.4;
    }

    input:focus,
    textarea:focus
    {
        border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.06);
    }

    .char-count
    {
        align-self: flex-end;
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.78rem;
        letter-spacing: 0.2px;
    }

    .editor-actions
    {
        display: flex;
        justify-content: flex-end;
    }

    .editor-actions button
    {
        border: 1px solid #0AEB00;
        background: rgba(10, 235, 0, 0.12);
        color: #fff;
        padding: 0.45rem 0.8rem;
        cursor: pointer;
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.4px;
    }
</style>
