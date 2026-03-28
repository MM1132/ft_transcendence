<script>
    import { authStore } from '../stores/authStore';
    import { authService } from '../services/authService';
    import { workService } from '../services/workService';

    let balance = $state(null);
    let isWorking = $state(false);
    let showTarget = $state(true);
    let feedback = $state('');
    let feedbackType = $state('info');
    let targetX = $state(0);
    let targetY = $state(0);
    let sleepClickCount = $state(0);

    const HEADER_HEIGHT = 80;
    const FOOTER_HEIGHT = 40;
    const TARGET_WIDTH = 124;
    const TARGET_HEIGHT = 54;
    const JOB_OFFER_LEFT = 20;
    const JOB_OFFER_TOP = 100;
    const JOB_OFFER_WIDTH = 320;
    const JOB_OFFER_HEIGHT = 76;

    function overlapsJobOffer(x, y)
    {
        return !(
            x + TARGET_WIDTH < JOB_OFFER_LEFT ||
            x > JOB_OFFER_LEFT + JOB_OFFER_WIDTH ||
            y + TARGET_HEIGHT < JOB_OFFER_TOP ||
            y > JOB_OFFER_TOP + JOB_OFFER_HEIGHT
        );
    }

    function moveTarget()
    {
        const horizontalPadding = 24;
        const topPadding = HEADER_HEIGHT + 24;
        const bottomPadding = FOOTER_HEIGHT + 24;

        const maxX = Math.max(horizontalPadding, window.innerWidth - TARGET_WIDTH - horizontalPadding);
        const maxY = Math.max(topPadding, window.innerHeight - TARGET_HEIGHT - bottomPadding);
        let nextX = horizontalPadding;
        let nextY = topPadding;

        for (let attempt = 0; attempt < 25; attempt += 1)
        {
            nextX = Math.floor(Math.random() * (maxX - horizontalPadding + 1)) + horizontalPadding;
            nextY = Math.floor(Math.random() * (maxY - topPadding + 1)) + topPadding;

            if (!overlapsJobOffer(nextX, nextY))
                break;
        }

        targetX = nextX;
        targetY = nextY;
    }

    async function loadBalance()
    {
        if (!$authStore.isLoggedIn || !$authStore.sessionToken)
        {
            balance = null;
            return;
        }

        const user = await authService.getMyUser($authStore.sessionToken);
        balance = user?.balance ?? null;
    }

    async function handleWork()
    {
        if (!$authStore.isLoggedIn)
            return;

        isWorking = true;
        feedback = '';
        showTarget = false;

        try
        {
            const result = await workService.work();
            balance = result.balance;
            feedback = result.message;
            feedbackType = 'success';
            sleepClickCount = 0;
        }
        catch (error)
        {
            const errorMessage = error instanceof Error ? error.message : 'Work request failed';

            if (errorMessage.toLowerCase().includes('too many requests') || errorMessage === 'Time to sleep')
            {
                sleepClickCount += 1;

                if (sleepClickCount >= 10)
                {
                    authStore.logout();
                    return;
                }

                feedback = sleepClickCount >= 5
                    ? 'I SAID ENOUGH! thats it, I am calling the cops! (or just logging you out...)'
                    : 'Enough work for today. Time to sleep';
            }
            else
            {
                feedback = errorMessage;
            }

            feedbackType = 'error';
        }
        finally
        {
            isWorking = false;
            window.setTimeout(() => {
                moveTarget();
                showTarget = true;
            }, 120);
        }
    }

    $effect(() => {
        if (!$authStore.isLoggedIn || !$authStore.sessionToken)
        {
            balance = null;
            feedback = '';
            return;
        }

        void loadBalance();
        moveTarget();
    });

    $effect(() => {
        if (!feedback)
            return;

        const timeoutId = window.setTimeout(() => {
            feedback = '';
            feedbackType = 'info';
        }, 3000);

        return () => window.clearTimeout(timeoutId);
    });
</script>

<main class="work-page">
    <div class="job-offer">
        <strong>Job offer:</strong> Oh no, my snakes escaped. Catch them quickly and I will reward you generously.
    </div>

    {#if $authStore.isLoggedIn && balance !== null}
        <div class="work-status">
            {#if feedback}
                {#key feedback}
                    <p class:success={feedbackType === 'success'} class:error={feedbackType === 'error'} class="work-feedback">
                        {feedback}
                    </p>
                {/key}
            {/if}
            <span>Balance: {balance}</span>
        </div>
    {/if}

    <section class="work-panel">
        {#if showTarget}
            <button
                class="snake-button"
                type="button"
                onclick={handleWork}
                disabled={isWorking || !$authStore.isLoggedIn}
                aria-label="Catch snake"
                style={`left: ${targetX}px; top: ${targetY}px;`}
            >
                <span class="snake-body" class:working={isWorking}>
                    <span class="snake-head">
                        <span class="snake-eye left"></span>
                        <span class="snake-eye right"></span>
                    </span>
                    <span class="snake-segment"></span>
                    <span class="snake-segment"></span>
                    <span class="snake-tail"></span>
                </span>
            </button>
        {/if}
    </section>
</main>

<style>
    .work-page
    {
        min-height: 100vh;
        display: flex;
        padding: 120px 20px 80px;
    }

    .work-panel
    {
        position: fixed;
        inset: 0;
    }

    .work-status
    {
        position: fixed;
        left: 20px;
        bottom: 52px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        color: #0AEB00;
        font-weight: 800;
        z-index: 1001;
    }

    .job-offer
    {
        position: fixed;
        top: 100px;
        left: 20px;
        max-width: 320px;
        padding: 14px 18px;
        border: 1px solid rgba(10, 235, 0, 0.2);
        background: rgba(15, 19, 20, 0.92);
        color: white;
        text-align: left;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
        z-index: 1001;
    }

    .job-offer strong
    {
        color: #0AEB00;
        margin-right: 6px;
    }

    .snake-button
    {
        position: fixed;
        width: 124px;
        height: 54px;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        transition: transform 0.15s ease, filter 0.15s ease;
    }

    .snake-button:hover:enabled
    {
        transform: translateY(-2px) scale(1.03);
        filter: brightness(1.05);
    }

    .snake-button:disabled
    {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .snake-body
    {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        gap: 4px;
        filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
    }

    .snake-head,
    .snake-segment,
    .snake-tail
    {
        height: 28px;
        background: linear-gradient(180deg, #66ff85 0%, #20c94b 100%);
        border: 2px solid #0b7f23;
        box-sizing: border-box;
    }

    .snake-head
    {
        position: relative;
        width: 32px;
        border-radius: 16px 18px 18px 16px;
        background: linear-gradient(180deg, #92ff76 0%, #34cc52 100%);
    }

    .snake-segment
    {
        width: 24px;
        border-radius: 14px;
    }

    .snake-tail
    {
        width: 20px;
        border-radius: 14px 18px 18px 14px;
        clip-path: polygon(0 0, 100% 20%, 100% 80%, 0 100%, 18% 50%);
    }

    .snake-eye
    {
        position: absolute;
        top: 7px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #0f1314;
    }

    .snake-eye.left
    {
        left: 10px;
    }

    .snake-eye.right
    {
        left: 17px;
    }

    .snake-body.working
    {
        transform: scale(0.92);
    }

    .work-feedback
    {
        margin: 0;
        padding: 12px 18px;
        border: 1px solid currentColor;
        background: rgba(15, 19, 20, 0.92);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
        animation: slideInLeft 0.3s ease;
    }

    .success
    {
        color: #0AEB00;
    }

    .error
    {
        color: #ff7a7a;
    }

    @keyframes slideInLeft
    {
        from
        {
            transform: translateX(-220px);
            opacity: 0;
        }
        to
        {
            transform: translateX(0);
            opacity: 1;
        }
    }
</style>
