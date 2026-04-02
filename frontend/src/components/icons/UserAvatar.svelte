<script lang="ts">
  interface Props {
    size?: number;
    color?: string;
    strokeWidth?: number;
  }

  let { size = 50, color = 'rgba(10, 235, 0, 0.5)', strokeWidth = 2 }: Props = $props();
</script>

<svg 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke={color} 
  stroke-width={strokeWidth} 
  class="user-avatar"
  style="width: {size}px; height: {size}px;"
>
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
  <circle cx="12" cy="7" r="4"></circle>
</svg>

<style>
  .user-avatar {
    flex-shrink: 0;
  }
</style>
