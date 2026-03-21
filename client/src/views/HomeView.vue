<template>
  <div class="home">
    <section class="hero">
      <div class="container hero-content">
        <div class="hero-text">
          <span class="eyebrow">Bloomera</span>
          <h1>Flori care spun ceea ce simți</h1>
          <p class="hero-description">
            Descoperă buchete, aranjamente și cadouri florale create cu grijă pentru momente
            speciale, surprize spontane și evenimente de neuitat.
          </p>

          <div class="hero-actions">
            <RouterLink to="/products" class="btn btn-primary">Vezi produsele</RouterLink>
            <RouterLink to="/register" class="btn btn-secondary">Creeaza cont</RouterLink>
            <RouterLink to="/login" class="btn btn-ghost">Login</RouterLink>
          </div>
        </div>

        <div class="hero-card">
          <div class="hero-badge">Colecția sezonului</div>
          <h3>Delicat, proaspăt, memorabil</h3>
          <p>
            Buchete în nuanțe pastelate, inspirate din natură și create pentru a aduce puțină
            frumusețe în fiecare zi.
          </p>

          <div class="hero-card-actions">
            <RouterLink to="/forgot-password" class="text-link">Ai uitat parola?</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="highlights">
      <div class="container">
        <div class="section-head">
          <span class="section-label">Ce găsești la noi</span>
          <h2>Ales cu drag, pentru orice ocazie</h2>
        </div>

        <div class="highlight-grid">
          <RouterLink to="/products" class="highlight-card highlight-link">
            <h3>Buchete elegante</h3>
            <p>Flori atent alese pentru aniversări, surprize și gesturi care contează.</p>
          </RouterLink>

          <RouterLink to="/register" class="highlight-card highlight-link">
            <h3>Cont Bloomera</h3>
            <p>Creează-ți cont pentru o experiență mai rapidă și mai personală.</p>
          </RouterLink>

          <RouterLink to="/login" class="highlight-card highlight-link">
            <h3>Intră în cont</h3>
            <p>Conectează-te ca să îți vezi comenzile și datele salvate.</p>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="benefits">
      <div class="container">
        <div class="section-head">
          <span class="section-label">De ce Bloomera</span>
          <h2>Un shop floral gândit să te facă să revii</h2>
        </div>

        <div class="benefit-grid">
          <div class="benefit-item">
            <div class="icon">🌷</div>
            <h3>Design floral modern</h3>
            <p>Stil delicat, romantic și actual, fără să fie încărcat.</p>
          </div>

          <div class="benefit-item">
            <div class="icon">💌</div>
            <h3>Perfect pentru cadouri</h3>
            <p>Comanzi ușor ceva frumos pentru cineva drag, fără bătăi de cap.</p>
          </div>

          <div class="benefit-item">
            <div class="icon">✨</div>
            <h3>Experiență caldă</h3>
            <p>Un site prietenos, feminin și elegant, construit pentru emoție și inspirație.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  background: linear-gradient(180deg, #fffaf6 0%, #fffdfb 100%);
  color: #5f5a55;
  background: linear-gradient(180deg, #fffaf7 0%, #fff1f4 40%, #f7f3ee 100%);
}

.container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.hero {
  padding: 72px 0 56px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
  align-items: center;
}

.eyebrow {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  background: #f7dfe5;
  color: #8f5f6b;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 18px;
}

.hero-text h1 {
  margin: 0 0 18px;
  font-size: clamp(38px, 5vw, 64px);
  line-height: 1.05;
  color: #5a514d;
  max-width: 620px;
}

.hero-description {
  margin: 0;
  font-size: 18px;
  line-height: 1.8;
  max-width: 620px;
  color: #786f69;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 32px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 22px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  transition: 0.2s ease;
}

.btn-primary {
  background: #dba4b2;
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(219, 164, 178, 0.28);
}

.btn-primary:hover {
  transform: translateY(-1px);
  background: #d493a4;
}

.btn-secondary {
  background: #edf4ea;
  color: #6b7f68;
  border: 1px solid #d8e7d2;
}

.btn-secondary:hover {
  transform: translateY(-1px);
  background: #e6f0e2;
}

.hero-card {
  /* background: linear-gradient(180deg, #fdecef 0%, #f7efe8 100%); */
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid #f1d8dd;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 18px 40px rgba(175, 145, 137, 0.12);
}

.hero-badge {
  display: inline-block;
  margin-bottom: 16px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  color: #a06b79;
  font-size: 13px;
  font-weight: 700;
}

.hero-card h3 {
  margin: 0 0 12px;
  font-size: 28px;
  color: #645954;
}

.hero-card p {
  margin: 0;
  line-height: 1.8;
  color: #7b726c;
}

.highlights,
.benefits {
  padding: 32px 0 72px;
}

.section-head {
  margin-bottom: 24px;
}

.section-label {
  display: inline-block;
  margin-bottom: 10px;
  color: #b07c89;
  font-size: 14px;
  font-weight: 700;
}

.section-head h2 {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  color: #5a514d;
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.highlight-card {
  background: #fff7f3;
  border: 1px solid #f2e3dc;
  border-radius: 24px;
  padding: 28px;
}

.highlight-card h3 {
  margin: 0 0 12px;
  color: #665b56;
  font-size: 22px;
}

.highlight-card p {
  margin: 0;
  color: #7c726d;
  line-height: 1.7;
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.benefit-item {
  background: #f4f8f1;
  border: 1px solid #dbe8d5;
  border-radius: 24px;
  padding: 28px;
}

.icon {
  font-size: 28px;
  margin-bottom: 14px;
}

.benefit-item h3 {
  margin: 0 0 10px;
  color: #5f685c;
  font-size: 22px;
}

.benefit-item p {
  margin: 0;
  color: #74806f;
  line-height: 1.7;
}

@media (max-width: 900px) {
  .hero-content,
  .highlight-grid,
  .benefit-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    padding-top: 48px;
  }

  .hero-text h1 {
    max-width: 100%;
  }

  .hero-description {
    max-width: 100%;
  }
}

.btn-ghost {
  background: transparent;
  color: #8f5f6b;
  border: 1px solid #e8cfd6;
}

.btn-ghost:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.45);
}

.hero-card-actions {
  margin-top: 18px;
}

.text-link {
  color: #8f5f6b;
  text-decoration: none;
  font-weight: 700;
}

.highlight-link {
  display: block;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.highlight-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 28px rgba(175, 145, 137, 0.12);
}
</style>
