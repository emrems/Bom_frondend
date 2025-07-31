<template>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h1>En Güzel Mücevherler</h1>
        <p>Özel tasarım altın ve mücevher koleksiyonumuzu keşfedin</p>
        <a href="#products" class="btn hero-btn">Ürünleri İncele</a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection'
};
</script>

<style scoped>
.hero {
  background: #f7f5f2;
  color: white;
  padding: 6rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(244, 208, 63, 0.1));
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-content p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: #666;
}

.btn.hero-btn {
  display: inline-block;
  font-size: 1.1rem;
  padding: 16px 32px;
  background: #d4af37;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn.hero-btn:hover {
  background: #f4d03f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn.hero-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: -1;
}

.btn.hero-btn:hover::after {
  transform: translateX(0);
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.1rem;
  }
}
</style>