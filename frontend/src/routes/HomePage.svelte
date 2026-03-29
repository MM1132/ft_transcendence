<script>
  import Button from '../components/Button.svelte';
  import { navigateTo } from '../stores/router';

  let showSubtitle = false;
</script>


<div class="hero-section">
  <div class="hero-visual">
    <svg width="800" height="800">
  
      <!-- Snake body -->
      <rect class="snake-segment s1" x="0" y="142" width="30" height="30" fill="#ffffff"/>
      <rect class="snake-segment s2" x="30" y="142" width="30" height="30" fill="#e8e8e8" />
      <rect class="snake-segment s3" x="60" y="142" width="30" height="30" fill="#d1d1d1" />
      <rect class="snake-segment s4" x="90" y="142" width="30" height="30" fill="#bababa" />
      <rect class="snake-segment s5" x="120" y="142" width="30" height="30" fill="#a3a3a3" />
      <rect class="snake-segment s6" x="150" y="142" width="30" height="30" fill="#8c8c8c" />
      <rect class="snake-segment s7" x="180" y="142" width="30" height="30" fill="#757575" />
      <rect class="snake-segment s8" x="210" y="142" width="30" height="30" fill="#5e5e5e" />
      <rect class="snake-segment s9" x="240" y="142" width="30" height="30" fill="#474747" />
      <rect class="snake-segment s10" x="270" y="142" width="30" height="30" fill="#303030" />
      
      <!-- Food/target -->
      <!-- <rect x="670" y="190" width="30" height="30" fill="#B13BCC"/> -->
      <!-- <rect x="200" y="100" width="30" height="30" fill="#ffe600"/> -->
    </svg>
  </div>
    <div class="hero-text">
     <p class="hero-subtitle" style="opacity: {showSubtitle ? 1 : 0}">
  BLACK MAMBA
</p>
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
        <a href="/login" onclick={(e) => { e.preventDefault(); navigateTo('/login'); }}>
          <Button type="button">GET STARTED</Button>
        </a>
        <button class="btn-secondary">LEARN MORE</button>
      </div>

  
  </div>
</div>





<style>

.hero-section {
    position: relative;
    height: calc(100vh - 120px);
    display: flex;
    align-items: center;
    justify-content: center;
    /* padding: 10px; */
    margin-top: 60px;
    overflow: hidden;
  }
  
  
  .hero-subtitle {
    font-size: 2rem;
    font-weight: 600;
    color: #131517;
    text-transform: uppercase;
    letter-spacing: 6px;
    opacity: 0.9;
    transition: opacity 3s;
    animation: pulseOpacity 9s linear infinite;
    z-index: 3;
    
  }
  
  .hero-title {
    font-size: 6rem;
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
  .hero-text
  {
    z-index: 2;
  }
  
  .hero-visual {
    position: absolute;
    /* display: flex; */
    /* justify-content: center; */
    /* align-items: center; */
    z-index: 1;
  }
  
  /* Snake animation */
  .snake-segment {
    animation: snakeMove 9s linear infinite;
  }
  
  @keyframes snakeMove {
    0% {
      transform: translateX(-550px);
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    95% {
      opacity: 1;
    }
    100% {
      transform: translateX(850px);
      opacity: 0;
    }
  }

  @keyframes pulseOpacity {
    0% { opacity: 0; }  /* Hidden */
    50% { opacity: 1; } /* Visible */
    100% { opacity: 0; }     /* Hidden */
  }
</style>