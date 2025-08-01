<template>
  <div class="cart-items-list">
    <div v-for="item in items" :key="item.id" class="cart-item-card">
      <router-link :to="`/product/${item.id}`" class="item-image-wrapper">
        <img :src="item.image" :alt="item.name" class="item-thumbnail" />
      </router-link>
      
      <div class="item-details-area">
        <router-link :to="`/product/${item.id}`" class="item-name-link">
          <h3 class="item-name">{{ item.name }}</h3>
        </router-link>
        <p class="item-unit-price">{{ formatPrice(item.price) }} TL</p>
      </div>
      
      <div class="item-quantity-control">
        <div class="quantity-selector-group">
          <button @click="$emit('decrease', item)" :disabled="item.quantity <= 1" class="quantity-btn">-</button>
          <span class="item-quantity-display">{{ item.quantity }}</span>
          <button @click="$emit('increase', item)" class="quantity-btn">+</button>
        </div>
      </div>
      
      <div class="item-subtotal">
        <span class="subtotal-price">{{ formatPrice(item.price * item.quantity) }} TL</span>
      </div>
      
      <div class="item-action-area">
        <button @click="$emit('remove', item)" class="remove-item-btn" title="Sepetten Çıkar">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartItemsList',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  emits: ['increase', 'decrease', 'remove'],
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    }
  }
}
</script>

<style scoped>
.cart-items-list {
  background: white;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}
.cart-item-card {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}
.cart-item-card:last-child { border-bottom: none; }
.item-image-wrapper { width: 100px; height: 100px; border-radius: 10px; overflow: hidden; }
.item-thumbnail { width: 100%; height: 100%; object-fit: cover; }
.item-name-link { text-decoration: none; color: inherit; }
.item-name { font-size: 1.2rem; color: #1a1a1a; margin-bottom: 0.5rem; font-weight: 600; transition: color 0.2s ease; }
.item-name-link:hover .item-name { color: #d4af37; }
.item-unit-price { color: #666; font-weight: 500; font-size: 1rem; }
.quantity-selector-group { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
.quantity-btn { width: 40px; height: 40px; border: none; background: #f1f1f1; cursor: pointer; font-size: 1.2rem; font-weight: 600; color: #333; }
.quantity-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.item-quantity-display { width: 40px; text-align: center; font-weight: 600; font-size: 1.1rem; }
.subtotal-price { font-size: 1.3rem; font-weight: 700; color: #333; }
.remove-item-btn { background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #999; }
.remove-item-btn:hover { color: #e74c3c; }
</style>