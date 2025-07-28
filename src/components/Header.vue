<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo">
          <h1>✨ Altın Kuyumcu</h1>
        </router-link>
        
        <nav class="nav">
          <router-link to="/" class="nav-link">Ana Sayfa</router-link>
          <router-link to="/cart" class="nav-link cart-link">
            Sepet
            <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
          </router-link>
          <router-link to="/" class="nav-link">Hakkımızda</router-link>
          <router-link to="/" class="nav-link">İletişim</router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    cartItemCount() {
      const cart = JSON.parse(localStorage.getItem('cartItems') || '[]')
      return cart.reduce((total, item) => total + item.quantity, 0)
    }
  },
  mounted() {
    // Sepet güncellendiğinde header'ı yeniden render et
    window.addEventListener('cartUpdated', () => {
      this.$forceUpdate()
    })
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: #d4af37;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
}

.cart-link {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-badge {
  background: #d4af37;
  color: #1a1a1a;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .logo h1 {
    font-size: 1.5rem;
  }
  
  .nav {
    gap: 1rem;
  }
}
</style>