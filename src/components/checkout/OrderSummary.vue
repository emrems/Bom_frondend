<template>
  <div class="order-summary">
    <h2>📋 Sipariş Özeti</h2>
    
    <div class="summary-items">
      <div v-for="item in items" :key="item.id" class="summary-item">
        <img :src="item.image" :alt="item.name" class="item-image" />
        <div class="item-info">
          <h4>{{ item.name }}</h4>
          <p>{{ item.quantity }} adet × {{ formatPrice(item.price) }} TL</p>
        </div>
        <div class="item-total">
          {{ formatPrice(item.price * item.quantity) }} TL
        </div>
      </div>
    </div>

    <div class="summary-totals">
      <div class="total-row">
        <span>Ara Toplam:</span>
        <span>{{ formatPrice(subtotal) }} TL</span>
      </div>
      <div class="total-row">
        <span>KDV (%18):</span>
        <span>{{ formatPrice(taxAmount) }} TL</span>
      </div>
      <div class="total-row">
        <span>Kargo:</span>
        <span v-if="subtotal >= 1000" class="free-shipping-text">Ücretsiz</span>
        <span v-else>{{ formatPrice(50) }} TL</span>
      </div>
      <hr>
      <div class="total-row final-total">
        <span>Toplam:</span>
        <span>{{ formatPrice(total) }} TL</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSummary',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    subtotal: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR').format(price);
    }
  }
}
</script>

<style scoped>
.order-summary {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  height: fit-content;
}
.order-summary h2 {
  color: #1a1a1a;
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1rem;
}
.summary-items {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
}
.summary-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}
.summary-item:last-child {
    border-bottom: none;
}
.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
}
.item-info {
  flex: 1;
}
.item-info h4 {
  color: #333;
  margin: 0 0 0.3rem;
  font-size: 1rem;
  font-weight: 600;
}
.item-info p {
  color: #777;
  font-size: 0.9rem;
  margin: 0;
}
.item-total {
  font-weight: 600;
  color: #333;
}
.summary-totals {
  padding-top: 1rem;
}
.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.free-shipping-text {
    color: #27ae60;
    font-weight: 600;
}
.total-row.final-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}
.total-row.final-total span:last-child {
  color: #d4af37;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 1.5rem 0;
}
</style>