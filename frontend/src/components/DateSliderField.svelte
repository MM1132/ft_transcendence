<script lang="ts">
    interface Props
    {
        label?: string;
        value?: string;
        placeholder?: string;
        disabled?: boolean;
        minYear?: number;
        maxYear?: number;
        summary?: boolean;
    }

    const now = new Date();
    const currentYear = now.getFullYear();

    let isEditing = $state(false);
    let hasValue = $state(false);

    let {
        label = 'Date',
        value = $bindable(''),
        placeholder = 'Select your birth date',
        disabled = false,
        minYear = 1900,
        maxYear = currentYear,
        summary = true
    }: Props = $props();

    let day = $state(now.getDate());
    let month = $state(now.getMonth() + 1);
    let year = $state(2000);

    function daysInMonth(monthValue: number, yearValue: number): number
    {
        return new Date(yearValue, monthValue, 0).getDate();
    }

    function clamp(valueToClamp: number, minValue: number, maxValue: number): number
    {
        return Math.min(Math.max(valueToClamp, minValue), maxValue);
    }

    function pad(input: number): string
    {
        return String(input).padStart(2, '0');
    }

    function syncValue()
    {
        value = `${year}-${pad(month)}-${pad(day)}`;
        hasValue = true;
    }

    function parseValue(input: string)
    {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
        if (!match)
            return;
        const nextYear = Number(match[1]);
        const nextMonth = Number(match[2]);
        const nextDay = Number(match[3]);
        if (Number.isNaN(nextYear) || Number.isNaN(nextMonth) || Number.isNaN(nextDay))
            return;
        year = clamp(nextYear, minYear, maxYear);
        month = clamp(nextMonth, 1, 12);
        day = clamp(nextDay, 1, daysInMonth(month, year));
        hasValue = true;
    }

    function getDisplayValue(): string
    {
        return `${pad(day)}.${pad(month)}.${year}`;
    }

    function startEditing()
    {
        if (disabled)
            return;
        if (!hasValue)
            syncValue();
        isEditing = true;
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

    function stepDay(delta: number)
    {
        const maxDay = daysInMonth(month, year);
        day = clamp(day + delta, 1, maxDay);
    }

    function stepMonth(delta: number)
    {
        month = clamp(month + delta, 1, 12);
        day = clamp(day, 1, daysInMonth(month, year));
    }

    function stepYear(delta: number)
    {
        year = clamp(year + delta, minYear, maxYear);
        day = clamp(day, 1, daysInMonth(month, year));
    }

    parseValue(value);

    $effect(() => {
        year = clamp(year, minYear, maxYear);
        day = clamp(day, 1, daysInMonth(month, year));
        if (hasValue)
            syncValue();
    });
</script>

<div class="date-field">
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
            <span class="summary-value" class:is-placeholder={!hasValue}>
                {hasValue ? getDisplayValue() : placeholder}
            </span>
        </div>
    {:else}
        <div class="editor">
            <div class="stepper-grid">
                <div class="stepper">
                    <span class="stepper-label">Day</span>
                    <button type="button" onclick={() => stepDay(1)} disabled={disabled || day >= daysInMonth(month, year)}>▲</button>
                    <span class="stepper-value">{pad(day)}</span>
                    <button type="button" onclick={() => stepDay(-1)} disabled={disabled || day <= 1}>▼</button>
                </div>

                <div class="stepper">
                    <span class="stepper-label">Month</span>
                    <button type="button" onclick={() => stepMonth(1)} disabled={disabled || month >= 12}>▲</button>
                    <span class="stepper-value">{pad(month)}</span>
                    <button type="button" onclick={() => stepMonth(-1)} disabled={disabled || month <= 1}>▼</button>
                </div>

                <div class="stepper">
                    <span class="stepper-label">Year</span>
                    <button type="button" onclick={() => stepYear(1)} disabled={disabled || year >= maxYear}>▲</button>
                    <span class="stepper-value">{year}</span>
                    <button type="button" onclick={() => stepYear(-1)} disabled={disabled || year <= minYear}>▼</button>
                </div>
            </div>

            {#if summary}
                <div class="editor-actions">
                    <button type="button" onclick={finishEditing}>Done</button>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .date-field
    {
        width: 100%;
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
    }

    .summary-value.is-placeholder
    {
        color: rgba(255, 255, 255, 0.55);
    }

    .editor
    {
        width: 100%;
        border: 1px solid rgba(10, 235, 0, 0.35);
        background: rgba(15, 19, 20, 0.85);
        box-sizing: border-box;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .stepper-grid
    {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }

    .stepper
    {
        border: 1px solid rgba(10, 235, 0, 0.3);
        background: rgba(10, 235, 0, 0.04);
        padding: 0.55rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    .stepper-label
    {
        color: rgba(177, 59, 204, 0.95);
        text-transform: uppercase;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.45px;
    }

    .stepper-value
    {
        color: #fff;
        font-size: 1rem;
        font-weight: 800;
        min-width: 4ch;
        text-align: center;
    }

    .stepper button
    {
        width: 100%;
        border: 1px solid #0AEB00;
        background: rgba(10, 235, 0, 0.12);
        color: #fff;
        font-size: 0.9rem;
        font-weight: 700;
        line-height: 1;
        padding: 0.4rem 0;
        cursor: pointer;
    }

    .stepper button:disabled
    {
        opacity: 0.45;
        cursor: not-allowed;
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
