<script>
  import { currentPath, navigateTo } from '../stores/router'

  function openLegalPage(event, path) {
    event.preventDefault()
    navigateTo(path)
  }
</script>

<footer aria-label="Footer">
  <div id="footer">
    <p class="footer-copy">&copy; 2026 ft_transcendence</p>
    <nav class="footer-nav" aria-label="Legal links">
      <a
        href="/privacy-policy"
        aria-current={$currentPath === '/privacy-policy' ? 'page' : undefined}
        onclick={(event) => openLegalPage(event, '/privacy-policy')}
      >
        Privacy Policy
      </a>
      <span class="divider" aria-hidden="true">|</span>
      <a
        href="/terms-of-service"
        aria-current={$currentPath === '/terms-of-service' ? 'page' : undefined}
        onclick={(event) => openLegalPage(event, '/terms-of-service')}
      >
        Terms of Service
      </a>
    </nav>
  </div>
</footer>

<style>
  #footer {
    width: 100%;
    min-height: 40px;
    background-color: #0F1314;
    backdrop-filter: blur(10px);
    position: fixed;
    bottom: 0;
    left: 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 8px 16px;
    box-sizing: border-box;
    color: rgba(255, 255, 255, 0.5);
  }

  .footer-copy {
    margin: 0;
    font-size: 0.9rem;
  }

  .footer-nav {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .footer-nav a {
    color: rgba(255, 255, 255, 0.78);
    text-decoration: none;
    font-size: 0.9rem;
  }

  .footer-nav a:hover,
  .footer-nav a:focus-visible {
    color: #0AEB00;
    text-decoration: underline;
    outline: none;
  }

  .footer-nav a[aria-current='page'] {
    color: #B13BCC;
  }

  .divider {
    color: rgba(255, 255, 255, 0.28);
  }

  @media (max-width: 640px) {
    #footer {
      flex-direction: column;
      gap: 6px;
    }
  }
</style>