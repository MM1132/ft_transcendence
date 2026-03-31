<main class="readme-page">
  <section class="readme-card">
    <p class="eyebrow">Project Guide</p>
    <h1>README</h1>

    <div class="readme-block">
      <h2>The Awesome Transcendence Project</h2>
    </div>

    <div class="readme-block">
      <h3>Instructions for Developers</h3>
      <ul>
        <li>Run dev: <code>docker compose up -d</code></li>
        <li>View logs: <code>docker compose logs frontend -f</code></li>
        <li>Stop dev: <code>docker compose down</code></li>
      </ul>
      <p class="note">Replace <code>frontend</code> with <code>backend</code> if you wish.</p>
    </div>

    <div class="readme-block">
      <p>Both frontend and backend are automatically hot-reloaded when you save files.</p>
    </div>

    <div class="readme-block">
      <h3>If You Want To Install a New npm Package</h3>
      <ul>
        <li>Shell into the container: <code>docker compose exec frontend sh</code></li>
        <li>Install the package: <code>npm i &lt;package name&gt;</code></li>
      </ul>
      <p class="note">Your <code>package.json</code> and <code>node_modules</code> update on the host machine too.</p>
    </div>

    <p class="closing">Happy developing :)</p>
  </section>
</main>

<style>
  .readme-page {
    min-height: calc(100vh - 80px);
    padding: 120px 24px 48px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }

  .readme-card {
    width: min(880px, 100%);
    padding: 36px;
    box-sizing: border-box;
    border: 1px solid rgba(10, 235, 0, 0.18);
    background: rgba(15, 19, 20, 0.82);
    backdrop-filter: blur(12px);
  }

  .eyebrow,
  h1,
  h2,
  h3,
  p,
  ul {
    margin-top: 0;
  }

  .eyebrow {
    color: rgba(255, 255, 255, 0.55);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.75rem;
    margin-bottom: 10px;
  }

  h1 {
    margin-bottom: 28px;
    color: #0aeb00;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: clamp(2rem, 4vw, 3rem);
  }

  h2,
  h3 {
    color: #ffffff;
  }

  .readme-block {
    margin-bottom: 24px;
  }

  p,
  li {
    color: rgba(255, 255, 255, 0.82);
    line-height: 1.6;
  }

  ul {
    padding-left: 20px;
  }

  code {
    color: #0aeb00;
    background: rgba(0, 0, 0, 0.35);
    padding: 2px 6px;
  }

  .note {
    color: rgba(255, 255, 255, 0.65);
  }

  .closing {
    color: #0aeb00;
    font-weight: 700;
  }
</style>
