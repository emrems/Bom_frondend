<template>
  <div class="order-summary">
    <h2>📋 Sipariş Özeti</h2>

    <div class="coupon-section" style="margin-bottom: 1rem">
      <input
        v-model="couponCode"
        type="text"
        placeholder="Kampanya kodu girin"
        @keyup.enter="applyCoupon"
        :disabled="hasCoupon"
      />
      
      <!-- Tek buton alanı -->
      <button
        v-if="!hasCoupon"
        @click="applyCoupon"
        :disabled="hasCoupon || couponCode.trim() === ''"
        class="apply-btn"
      >
        Kuponu Uygula
      </button>
      <button
        v-else
        @click="removeCoupon"
        class="remove-btn"
      >
        İndirimi Kaldır
      </button>

      <p v-if="couponError" style="color: red; margin-top: 0.3rem">
        {{ couponError }}
      </p>
      <p v-if="couponSuccess" style="color: green; margin-top: 0.3rem">
        {{ couponSuccess }}
      </p>
    </div>

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
        <span>Kampanya İndirimi:</span>
        <span v-if="totalDiscount > 0" class="discount-text">-{{ formatPrice(totalDiscount) }} TL</span>
        <span v-else>-</span>
      </div>
      <div class="total-row">
        <span>Kargo:</span>
        <span v-if="subtotal >= 1000" class="free-shipping-text">Ücretsiz</span>
        <span v-else>{{ formatPrice(shippingFee) }} TL</span>
      </div>
      <hr />
      <div class="total-row final-total">
        <span>Toplam:</span>
        <span>{{ formatPrice(total) }} TL</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "OrderSummary",
  data() {
    return {
      couponCode: "",
      couponSuccess: "",
      couponError: "",
      hasCoupon: false,
    };
  },
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
    promoDiscount: {
      type: Number,
      default: 0,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    cartId: {
      type: String,
      required: true,
    },
  },
  computed: {
    totalDiscount() {
      return this.promoDiscount + this.couponDiscount;
    },
  },
  watch: {
    couponDiscount(newVal) {
      this.hasCoupon = newVal > 0;
      if (!this.hasCoupon) {
        this.couponCode = "";
        this.couponSuccess = "";
        this.couponError = "";
      }
    },
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat("tr-TR").format(price);
    },
    async applyCoupon() {
      this.couponError = "";
      this.couponSuccess = "";

      const code = this.couponCode.trim();
      if (!code) {
        this.couponError = "Lütfen kampanya kodu girin.";
        return;
      }

      try {
        await axios.post(
          `https://localhost:7135/api/Promotions/validate-coupon`,
          JSON.stringify(code),
          { headers: { "Content-Type": "application/json" } }
        );

        this.couponSuccess = "Kupon başarıyla doğrulandı. Sepet güncelleniyor...";

        const response = await axios.get(
          `https://localhost:7135/api/Promotions/cart/${this.cartId}/total`,
          { params: { couponCode: code } }
        );

        const data = response.data;

        this.$emit("updateTotals", {
          subtotal: data.subtotal,
          promoDiscount: data.promoDiscount,
          couponDiscount: data.couponDiscount,
          total: data.total,
        });

        this.couponSuccess = "Kupon başarıyla uygulandı.";
      } catch (error) {
        this.couponError =
          (error.response?.data &&
            (typeof error.response.data === "string"
              ? error.response.data
              : error.response.data.title)) ||
          "Kupon geçersiz veya hata oluştu.";
      }
    },
    async removeCoupon() {
      this.couponError = "";
      this.couponSuccess = "";

      try {
        const response = await axios.get(
          `https://localhost:7135/api/Promotions/cart/${this.cartId}/total`,
          { params: { couponCode: "" } }
        );

        const data = response.data;

        this.$emit("updateTotals", {
          subtotal: data.subtotal,
          promoDiscount: data.promoDiscount,
          couponDiscount: data.couponDiscount,
          total: data.total,
        });

        this.couponCode = "";
        this.couponSuccess = "İndirim kaldırıldı.";
        this.hasCoupon = false;
      } catch (error) {
        this.couponError = "İndirim kaldırılırken hata oluştu.";
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.coupon-section input {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 200px;
  margin-right: 0.5rem;
  vertical-align: middle;
}
.coupon-section button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  vertical-align: middle;
}
.apply-btn {
  background-color: #27ae60;
  color: white;
}
.apply-btn:hover:not(:disabled) {
  background-color: #219150;
}
.apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.remove-btn {
  background-color: #c0392b;
  color: white;
}
.remove-btn:hover {
  background-color: #992d22;
}
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
.discount-text {
  color: #c0392b;
  font-weight: 600;
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
