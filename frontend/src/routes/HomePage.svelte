<script>
  import Button from '../components/Button.svelte';
</script>

<header>
  <div id="header">
    <div class="header-logo">
      <img src="src/images/c.svg" alt="Logo"/>
    </div>
    <div class="header-nav">
    </div>
  </div>
</header>

<main class="hero-section">
  <!-- <div class="glow-effect"></div> -->
  <div class="hero-content">
    <div class="hero-text">
      <p class="hero-subtitle">BLACK MAMBA</p>
      <h1 class="hero-title">
        COMPETE.<br/>
        <span class="hero-title-alt">DOMINATE.</span><br/>
        TRANSCEND.
      </h1>
      <p class="hero-description">
        Experience real-time multiplayer gaming redefined. 
        Compete with players worldwide in the ultimate arena.
      </p>
      <div class="hero-buttons">
        <a href="/login">
          <Button type="button">GET STARTED</Button>
        </a>
        <button class="btn-secondary">LEARN MORE</button>
      </div>
    </div>

    <div class="hero-visual">
      <svg width="500" height="500" viewBox="0 0 500 500">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(10, 235, 0, 0.15)" stroke-width="1"/>
          </pattern>
        </defs>

        <!-- Snake body -->
        <rect class="snake-segment s1" x="0" y="235" width="30" height="30" fill="#ffffff"/>
        <rect class="snake-segment s2" x="30" y="235" width="30" height="30" fill="#e8e8e8" />
        <rect class="snake-segment s3" x="60" y="235" width="30" height="30" fill="#d1d1d1" />
        <rect class="snake-segment s4" x="90" y="235" width="30" height="30" fill="#bababa" />
        <rect class="snake-segment s5" x="120" y="235" width="30" height="30" fill="#a3a3a3" />
        <rect class="snake-segment s6" x="150" y="235" width="30" height="30" fill="#8c8c8c" />
        <rect class="snake-segment s7" x="180" y="235" width="30" height="30" fill="#757575" />
        <rect class="snake-segment s8" x="210" y="235" width="30" height="30" fill="#5e5e5e" />
        <rect class="snake-segment s9" x="240" y="235" width="30" height="30" fill="#474747" />
        <rect class="snake-segment s10" x="270" y="235" width="30" height="30" fill="#303030" />
        
        <!-- Food/target -->
        <rect class="snake-food" x="335" y="150" width="30" height="30" fill="#B13BCC"/>
      </svg>
    </div>
  </div>
</main>

<footer>
  <div id="footer">
    <p>&copy; 2026 ft_trancendence. All rights reserved.</p>
  </div>
</footer>

<style>
  main.hero-section {
    position: relative;
    height: calc(100vh - 120px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    margin-top: 80px;
    overflow: hidden;
  }

  .hero-content {
    max-width: 1200px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .hero-subtitle {
    font-size: 1rem;
    font-weight: 800;
    color: #B13BCC;
    text-transform: uppercase;
    letter-spacing: 4px;
    margin-bottom: 15px;
    opacity: 0.9;
  }

  .hero-title {
    font-size: 5rem;
    font-weight: 800;
    line-height: 0.9;
    color: #0AEB00;
    text-transform: uppercase;
    margin-bottom: 30px;
    letter-spacing: -2px;
  }

  .hero-title-alt {
    color: #fff;
  }

  .hero-description {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.6);
    max-width: 500px;
    margin-bottom: 40px;
    line-height: 1.6;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-buttons {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero-buttons a {
    text-decoration: none;
    flex: 0 0 200px;
  }

  .btn-secondary {
    padding: 1.2rem 2rem;
    background: transparent;
    color: #B13BCC;
    border: 2px solid #B13BCC;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-family: Montserrat;
  }

  .btn-secondary:hover {
    background: rgba(177, 59, 204, 0.1);
    box-shadow: 0 0 20px rgba(177, 59, 204, 0.3);
  }

  .hero-visual {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* .glow-effect {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(12, 235, 0, 0.20) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(20px);
    z-index: 0;
    top: 45%;
    left: 25%;
    transform: translate(-50%, -50%);
  } */

  /* Snake animation */
  .snake-segment {
    animation: snakeMove 16s linear infinite;
  }

  @keyframes snakeMove {
    0% {
      transform: translateX(-400px);
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    95% {
      opacity: 1;
    }
    100% {
      transform: translateX(400px);
      opacity: 0;
    }
  }


/* responsive design */

  /* @media (max-width: 968px) {
    .hero-content {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .hero-title {
      font-size: 3.5rem;
    }

    .hero-visual svg {
      width: 300px;
      height: 300px;
    }
  } */

  /* @media (max-width: 640px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .hero-buttons {
      flex-direction: column;
    }

    .hero-buttons a {
      flex: 1 1 auto;
      width: 100%;
    }

    .btn-secondary {
      width: 100%;
    }
  } */
</style>