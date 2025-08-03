<template>
  <div class="order-error">
    <h2>Sipariş Oluşturulamadı</h2>
    <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>
  </div>
</template>

<script>
export default {
  name: "OrderError"
}
</script>

<style scoped>
.order-error {
  padding: 20px;
  border: 1px solid #F44336;
  background-color: #FFEBEE;
  color: #C62828;
  border-radius: 10px;
  text-align: center;
}
</style>
