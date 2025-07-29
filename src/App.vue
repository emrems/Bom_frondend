<template>
  <div id="app">
    <!-- Sadece showHeaderFooter true ise Header'ı göster -->
    <Header v-if="showHeaderFooter" />
    
    <!-- main etiketi, hem footer'ı aşağıda tutar hem de içeriği sarmalar -->
    <main>
      <router-view />
    </main>
    
    <!-- Sadece showHeaderFooter true ise Footer'ı göster -->
    <Footer v-if="showHeaderFooter" />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  computed: {
    // Bu metod, o anki sayfanın adını kontrol eder.
    showHeaderFooter() {
      // Header ve Footer'ın GÖRÜNMEYECEĞİ sayfaların isimlerini bu listeye ekliyoruz.
      const pagesWithoutLayout = ['Loginapp', 'Register', 'ForgotPassword'];
      
      // Eğer o anki sayfanın adı bu listede DEĞİLSE, true döner (yani Header/Footer görünür).
      return !pagesWithoutLayout.includes(this.$route.name);
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #1a1a1a;
  background-color: #fafafa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Bu kural, içerik kısa bile olsa footer'ın sayfanın en altında kalmasını sağlar. */
main {
  flex-grow: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.btn-secondary {
  background: #1a1a1a;
  color: white;
}

.btn-secondary:hover {
  background: #333;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
  font-size: 18px;
  color: #666;
}

.error {
  color: #e74c3c;
  text-align: center;
  padding: 40px 0;
  font-size: 16px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
