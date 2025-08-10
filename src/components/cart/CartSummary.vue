<template>
  <div class="cart-summary-panel">
    <div class="summary-card">
      <h3 class="summary-title">Sipariş Özeti</h3>
      
      <div class="summary-row">
        <span>Ara Toplam:</span>
        <span>{{ formatPrice(subtotal) }} TL</span>
      </div>
      
      <div class="summary-row">
        <span>Kargo:</span>
        <span v-if="subtotal >= 1000" class="free-shipping-text">Ücretsiz</span>
        <span v-else>{{ formatPrice(shippingCost) }} TL</span>
      </div>
      
      <hr class="summary-divider">
      
      <div class="summary-row total-row">
        <span>Toplam:</span>
        <span>{{ formatPrice(total) }} TL</span>
      </div>
      
      <div v-if="subtotal < 1000" class="free-shipping-promo">
        <p>Ücretsiz kargo için {{ formatPrice(1000 - subtotal) }} TL daha alışveriş yapın!</p>
      </div>
      
      <button @click="$emit('go-to-checkout')" class="primary-btn checkout-button">
        Ödemeye Geç
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartSummary',
  props: {
    subtotal: Number,
    shippingCost: Number,
    total: Number,
  },
  emits: ['go-to-checkout'],
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
.cart-summary-panel { position: sticky; top: 3rem; height: fit-content; }
.summary-card { background: white; border-radius: 15px; padding: 2rem; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); }
.summary-title { font-size: 1.8rem; color: #1a1a1a; margin-bottom: 1.8rem; text-align: center; font-weight: 700; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.05rem; color: #555; }
.summary-row span:last-child { font-weight: 600; color: #333; }
.summary-row.total-row { font-size: 1.5rem; font-weight: 800; color: #1a1a1a; margin-top: 1.5rem; border-top: 2px dashed #eee; padding-top: 1.5rem; }
.summary-row.total-row span:last-child { color: #d4af37; }
.summary-divider { border: none; border-top: 1px solid #f0f0f0; margin: 1.5rem 0; }
.free-shipping-promo { background: #e6ffe6; padding: 1.2rem; border-radius: 8px; margin: 1.5rem 0; text-align: center; border: 1px solid #c8e6c9; }
.free-shipping-promo p { color: #27ae60; font-size: 0.95rem; margin: 0; font-weight: 500; }
.free-shipping-text { color: #27ae60; font-weight: 700; }
.checkout-button { width: 100%; margin-top: 1.5rem; }
.primary-btn { padding: 15px 35px; font-size: 1.15rem; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; transition: all 0.3s ease; background-color: #d4af37; color: white; box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3); }
.primary-btn:hover { background-color: #c49a2e; transform: translateY(-2px); }
</style>
