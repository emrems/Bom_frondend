<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>✨ Altın Kuyumcu</h3>
          <p>En kaliteli altın ve mücevher ürünleri</p>
        </div>
        
        <div class="footer-section">
          <h4>İletişim</h4>
          <p>📞 0212 555 0123</p>
          <p>📧 info@altinkuyumcu.com</p>
        </div>
        
        <div class="footer-section">
          <h4>Adres</h4>
          <p>Kapalıçarşı, İstanbul</p>
          <p>Türkiye</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 Altın Kuyumcu. Tüm hakları saklıdır.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background: #1a1a1a;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: #d4af37;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.footer-section h4 {
  color: #d4af37;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

.footer-section p {
  margin-bottom: 0.5rem;
  color: #ccc;
  line-height: 1.6;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding-top: 1rem;
  text-align: center;
  color: #999;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>