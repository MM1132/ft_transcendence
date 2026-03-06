<script>
  let { size = 15, handleLogoClick = null } = $props();

  let pressed = $state(false);

  const grid = [
    0, 0, 1, 1, 1, 0, 1, 1, 1, 0,
    0, 0, 1, 0, 1, 0, 1, 0, 1, 0,
    1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
  ];

  const colors = [
    "rgba(0,0,0)",
    "rgba(14,14,14)",
    "rgba(28,28,28)",
    "rgba(43,43,43)",
    "rgba(57,57,57)",
    "rgba(71,71,71)",
    "rgba(85,85,85)",
    "rgba(99,99,99)",
    "rgba(113,113,113)",
    "rgba(128,128,128)",
    "rgba(142,142,142)",
    "rgba(156,156,156)",
    "rgba(170,170,170)",
    "rgba(184,184,184)",
    "rgba(198,198,198)",
    "rgba(213,213,213)",
    "rgba(227,227,227)",
    "rgba(241,241,241)",
    "rgba(255,255,255)"
  ];

  function getColor(index)
  {
    const col = index % 10;
    const colorIndex = Math.round(col * (colors.length - 1) / 9);
    return colors[colorIndex];
  }

  function handleClick()
  {
    pressed = !pressed;
    if(handleLogoClick)
      handleLogoClick();
    setTimeout(() => {pressed = false;}, 4);
  }
</script>


<button 
  class="logo"
  class:isPressed = {pressed}
  style="--tile: {size}px"
  onclick = {handleClick}
  >
    {#each grid as cell, i}
      <div class="sq" style:background={cell ? getColor(i) : 'transparent'}></div>
    {/each}
</button>

<style>
  .logo
  {
    display: grid;
    grid-template-columns: repeat(10, var(--tile));
    grid-template-rows: repeat(3, var(--tile));
    gap: 1px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    margin-left: 45px;
  }

  .sq
  {
    width: var(--tile);
    height: var(--tile);
    transition: filter 0.3 ease, transform 0.3s ease;
  }

  .logo:active .sq
  {
    transform: scale(0.95);
    filter: brightness(10);
  }
</style>


