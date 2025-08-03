<template>
  <div class="order-success">
    <h2>Sipariş Başarılı</h2>
    <p>Siparişiniz başarılı bir şekilde oluşturulmuştur.</p>
    <p>Hesabım / Siparişlerim kısmından siparişlerinizi takip edebilirsiniz.</p>
  </div>
</template>

<script>
export default {
  name: "OrderSuccess"
}
</script>

<style scoped>
.order-success {
  padding: 20px;
  border: 1px solid #4CAF50;
  background-color: #E8F5E9;
  color: #2E7D32;
  border-radius: 10px;
  text-align: center;
}
</style>
