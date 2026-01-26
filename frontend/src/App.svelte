<h1>Hello World!</h1>
<h1>this is our ft_transende sssssce Svelte server</h1>
<canvas id="canvas" width="1000" height="600">
 Canvas is broken
</canvas>
<style>
  #canvas {
    border: 2px solid black;
  }
</style>
<script>
    import { onMount } from "svelte";

  onMount(() => {
    const c = document.getElementById("canvas");
    const cc = c.getContext("2d");
    cc.moveTo(0, 0);
    cc.lineTo(200, 100);
    cc.stroke();
  })
</script>