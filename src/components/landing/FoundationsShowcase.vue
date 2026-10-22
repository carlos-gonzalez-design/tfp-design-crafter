<template>
  <section id="features" class="landing-section foundations-showcase" aria-labelledby="foundations-title">
    <div class="landing-container">
      <header class="landing-section-heading" data-reveal>
        <div>
          <p class="landing-eyebrow"><span></span>01 · Foundations</p>
          <h2 id="foundations-title">Every great design starts with <br />strong foundations.</h2>
        </div>
        <p>Define the visual decisions that shape your product. One source of truth, reflected everywhere.</p>
      </header>

      <div class="foundations-bento">
        <article class="foundation-tile foundation-tile--colors" data-reveal>
          <header><span>01</span><h3>Colors</h3><code>--ds-color-*</code></header>
          <div class="foundation-colors" aria-label="Design Crafter color tokens">
            <i style="--swatch: #635bff"><small>Brand</small></i>
            <i style="--swatch: #ff8f7b"><small>Coral</small></i>
            <i style="--swatch: #a9ebca"><small>Mint</small></i>
            <i style="--swatch: #fafaf9"><small>Canvas</small></i>
          </div>
          <p>Semantic palettes that stay connected from canvas to component.</p>
        </article>

        <article class="foundation-tile foundation-tile--type" data-reveal>
          <header><span>02</span><h3>Typography</h3><code>Geist + DM Mono</code></header>
          <div class="foundation-type-sample" aria-hidden="true"><strong>Aa</strong><i>Scale with clarity.</i></div>
          <div class="foundation-type-scale" aria-label="Typography scale"><span>12</span><span>16</span><span>28</span><span>44</span></div>
        </article>

        <article class="foundation-tile foundation-tile--spacing" data-reveal>
          <header><span>03</span><h3>Spacing</h3><code>4pt scale</code></header>
          <div class="foundation-spacing" aria-label="Spacing scale from 4 to 64 pixels">
            <span style="--size: 12%"><i>4</i></span>
            <span style="--size: 25%"><i>8</i></span>
            <span style="--size: 48%"><i>16</i></span>
            <span style="--size: 72%"><i>32</i></span>
            <span style="--size: 100%"><i>64</i></span>
          </div>
        </article>

        <article class="foundation-tile foundation-tile--radius" data-reveal>
          <header><span>04</span><h3>Border radius</h3><code>Purpose-led</code></header>
          <div class="foundation-radius" aria-label="Sharp, subtle, rounded and pill radius treatments">
            <span><i>Sharp</i></span><span><i>Subtle</i></span><span><i>Rounded</i></span><span><i>Pill</i></span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
