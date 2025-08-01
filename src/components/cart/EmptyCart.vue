<template>
  <div class="empty-cart-state">
    <div class="empty-cart-content">
      <i class="fas fa-shopping-basket empty-cart-icon"></i>
      <h2>Sepetinizde ürün bulunmamaktadır.</h2>
      <p>Favori ürünlerinizi keşfetmeye başlayın!</p>
      <router-link to="/" class="primary-btn">Alışverişe Başla</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyCart'
}
</script>

<style scoped>
.empty-cart-state { display: flex; justify-content: center; align-items: center; min-height: 50vh; }
.empty-cart-content { text-align: center; background: white; padding: 4rem 3rem; border-radius: 15px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); max-width: 500px; }
.empty-cart-icon { font-size: 5rem; color: #ccc; margin-bottom: 1.5rem; transition: color 0.3s ease; }
.empty-cart-content:hover .empty-cart-icon { color: #d4af37; }
.empty-cart-content h2 { color: #1a1a1a; margin-bottom: 1rem; font-size: 2.2rem; font-weight: 700; }
.empty-cart-content p { color: #666; margin-bottom: 2.5rem; font-size: 1.1rem; }
.primary-btn { padding: 15px 35px; font-size: 1.15rem; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; transition: all 0.3s ease; background-color: #d4af37; color: white; box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3); text-decoration: none; }
.primary-btn:hover { background-color: #c49a2e; transform: translateY(-2px); }
</style>