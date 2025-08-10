<template>
  <div class="checkout">
    <div class="container">
      <div class="checkout-header">
        <h1>💳 Ödeme</h1>
        <router-link to="/cart" class="back-to-cart">← Sepete Dön</router-link>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Ödeme sayfası hazırlanıyor...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <h3>❌ Hata</h3>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="orderSuccess" class="order-success-state">
        <i class="fas fa-check-circle"></i>
        <h2>Siparişiniz Alındı!</h2>
        <p>
          Sipariş numaranız: <strong>{{ createdOrder.orderNumber }}</strong>
        </p>
        <p v-if="orderSuccessType === 'guest'">
          Sipariş detayları e-posta adresinize gönderilmiştir.
        </p>
        <p v-else>
          Siparişiniz hesabınıza tanımlandı. Detayları profilinizden
          görebilirsiniz.
        </p>
        <router-link
          v-if="orderSuccessType === 'authenticated'"
          to="/orders"
          class="btn"
          >Siparişlerim</router-link
        >
        <router-link v-else to="/" class="btn">Alışverişe Devam Et</router-link>
      </div>

      <div v-else-if="!cartItems || cartItems.length === 0" class="empty-cart">
        <EmptyCart />
      </div>

      <div v-else class="checkout-content">
        <OrderSummary
          :items="processedCartItems"
          :subtotal="displaySubtotal"
          :promoDiscount="updatedPromoDiscount"
          :couponDiscount="updatedCouponDiscount"
          :shippingFee="displayShippingFee"
          :total="displayTotal"
          :cartId="cartId"
          @updateTotals="onUpdateTotals"
        />

        <div v-if="isAuthenticated">
          <AuthenticatedCheckout
            :paymentToken="paymentToken"
            @initiate-payment="handleAuthenticatedPayment"
            :isSubmitting="isSubmitting"
          />
        </div>
        <div v-else>
          <GuestPaymentForm
            :paymentToken="paymentToken"
            @initiate-payment="handleGuestPayment"
            :isSubmitting="isSubmitting"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import OrderSummary from "@/components/checkout/OrderSummary.vue";
import GuestPaymentForm from "@/components/checkout/GuestPaymentForm.vue";
import AuthenticatedCheckout from "@/components/checkout/AuthenticatedCheckout.vue";
import EmptyCart from "@/components/cart/EmptyCart.vue";

export default {
  name: "Checkout",
  components: {
    OrderSummary,
    GuestPaymentForm,
    AuthenticatedCheckout,
    EmptyCart,
  },
  data() {
    return {
      loading: false,
      error: null,
      shippingCost: 50,
      paymentToken: null,
      apiBaseUrl: "http://localhost:5294",
      isSubmitting: false,
      orderSuccess: false,
      orderSuccessType: null, // 'guest' veya 'authenticated'
      createdOrder: null,

      // Backend'ten gelen güncel değerler (kupon/ promosyon sonrası)
      updatedSubtotal: null,
      updatedPromoDiscount: 0,
      updatedCouponDiscount: 0,
      updatedTotal: null,
      
      // YENİ: OrderSummary'den gelen geçerli kupon kodunu saklamak için.
      appliedCouponCode: "",
    };
  },
  computed: {
    ...mapGetters(["cartItems", "isAuthenticated", "user", "cartId"]),

    processedCartItems() {
      if (!this.cartItems) return [];
      return this.cartItems.map((item) => ({
        ...item,
        image:
          item.image && !item.image.startsWith("http")
            ? `${this.apiBaseUrl}${item.image}`
            : item.image || "https://via.placeholder.com/150?text=Resim+Yok",
      }));
    },

    subtotal() {
      return this.processedCartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    shippingFee() {
      return this.subtotal >= 1000 ? 0 : this.shippingCost;
    },

    total() {
      return this.subtotal + this.shippingFee;
    },

    displaySubtotal() {
      return this.updatedSubtotal !== null ? this.updatedSubtotal : this.subtotal;
    },

    displayShippingFee() {
      return this.displaySubtotal >= 1000 ? 0 : this.shippingCost;
    },

    displayTotal() {
      return this.updatedTotal !== null
        ? this.updatedTotal
        : this.displaySubtotal + this.displayShippingFee;
    },
  },
  async created() {
    this.loading = true;
    await this.fetchCartDetails();
    this.loading = false;
  },
  methods: {
    ...mapActions(["fetchCartDetails", "clearCart"]),

    // GÜNCELLENDİ: Bu metot artık kupon kodunu da yakalayıp saklıyor.
    onUpdateTotals(totals) {
      this.updatedSubtotal = totals.subtotal;
      this.updatedPromoDiscount = totals.promoDiscount;
      this.updatedCouponDiscount = totals.couponDiscount;
      this.updatedTotal = totals.total;

      // YENİ: Eğer OrderSummary bize bir kupon kodu gönderirse, bunu sakla.
      if (typeof totals.appliedCoupon !== 'undefined') {
        this.appliedCouponCode = totals.appliedCoupon;
      }
    },

    async handleGuestPayment(payload) {
      this.isSubmitting = true;
      const { shippingAddress, billingAddress, notes, guestInfo } = payload;

      const orderData = {
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        notes,
        cartId: this.cartId,
        guestFirstName: guestInfo.firstName,
        guestLastName: guestInfo.lastName,
        guestEmail: guestInfo.email,
        guestPhone: guestInfo.phone,
        // GÜNCELLENDİ: Kupon kodu artık payload'dan değil, data'da sakladığımız yerden geliyor.
        couponCode: this.appliedCouponCode,
      };

      try {
        const response = await axios.post(
          `${this.apiBaseUrl}/api/Orders/place`,
          orderData
        );
        if (response.data && response.data.orderNumber) {
          this.orderSuccess = true;
          this.orderSuccessType = "guest";
          this.createdOrder = response.data;
          this.clearCart();
        } else {
          throw new Error("API'den beklenen sipariş bilgisi alınamadı.");
        }
      } catch (error) {
        this.error =
          error.response?.data || "Siparişiniz oluşturulurken bir hata oluştu.";
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },

    async handleAuthenticatedPayment(payload) {
      this.isSubmitting = true;
      // payload'dan gelen 'couponCode' artık kullanılmıyor, çünkü hep boş geliyordu.
      const { shippingAddressId, billingAddressId, notes } = payload;
      
      const orderData = {
        cartId: this.cartId,
        shippingAddressId,
        billingAddressId,
        notes,
        // GÜNCELLENDİ: Kupon kodu artık payload'dan değil, data'da sakladığımız yerden geliyor.
        couponCode: this.appliedCouponCode,
      };

      try {
        const token = this.$store.state.token;
        if (!token) {
          this.error = "Giriş yapılmamış veya token bulunamadı.";
          this.isSubmitting = false;
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.post(
          `${this.apiBaseUrl}/api/Orders/place-authenticated`,
          orderData,
          { headers }
        );

        if (response.data && response.data.orderNumber) {
          this.orderSuccess = true;
          this.orderSuccessType = "authenticated";
          this.createdOrder = response.data;
          this.clearCart();
        } else if (response.data && response.data.iframe_token) {
          this.paymentToken = response.data.iframe_token;
        } else {
          throw new Error("API'den beklenen yanıt alınamadı.");
        }
      } catch (error) {
        this.error = error.response?.data || "Siparişiniz oluşturulurken bir hata oluştu.";
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
/* BU BÖLÜMDE HİÇBİR DEĞİŞİKLİK YAPILMADI */
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Raleway:wght@400;500;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.checkout {
  padding: 3rem 0;
  min-height: 80vh;
  background-color: #f9f9f9;
  font-family: "Raleway", sans-serif;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.checkout-header h1 {
  font-family: "Cormorant Garamond", serif;
  font-size: 2.8rem;
  color: #1a1a1a;
  margin: 0;
}
.back-to-cart {
  color: #c5a47e;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border: 2px solid #c5a47e;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.back-to-cart:hover {
  background: #c5a47e;
  color: white;
}
.loading-state,
.error-state,
.empty-cart,
.order-success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #c5a47e;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.error-state h3 {
  font-family: "Cormorant Garamond", serif;
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-size: 2rem;
}
.error-state p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}
.order-success-state i {
  font-size: 5rem;
  color: #27ae60;
  margin-bottom: 1.5rem;
}
.order-success-state h2 {
  font-family: "Cormorant Garamond", serif;
  font-size: 2.5rem;
}
.order-success-state p {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
  max-width: 450px;
  margin: 1rem auto 2rem;
}
.checkout-content {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 3rem;
  align-items: start;
}
.btn {
  padding: 14px 35px;
  font-size: 1.15rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #c5a47e;
  color: white;
  box-shadow: 0 8px 20px rgba(197, 164, 126, 0.3);
  text-decoration: none;
}
.btn:hover {
  background-color: #b38e64;
  transform: translateY(-2px);
}
@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}
</style>