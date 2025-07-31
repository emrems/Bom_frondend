<template>
  <section class="campaigns">
    <div class="container">
      <h2 class="section-title">Size Özel Ayrıcalıklar</h2>
      <p class="section-subtitle">Alışverişinizi daha da keyifli hale getirecek fırsatlarımız.</p>
      
      <div class="campaign-grid">
        <div 
          v-for="campaign in campaigns" 
          :key="campaign.title" 
          class="campaign-card"
        >
          <div 
            class="card-background" 
            :style="{ backgroundImage: `url(${campaign.backgroundImageUrl})` }"
          ></div>
          <div class="card-overlay"></div>
          
          <div class="card-content">
            <div class="icon-wrapper">
              <i :class="campaign.icon"></i>
            </div>
            <div class="text-wrapper">
              <h3 class="campaign-title">{{ campaign.title }}</h3>
              <p class="campaign-description">{{ campaign.description }}</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CampaignsSection',
  data() {
    return {
      // GÜNCELLENDİ: Kampanya verilerinden gereksiz 'link' özellikleri kaldırıldı.
      campaigns: [
        {
          title: '%20 İndirim Fırsatı',
          description: 'Seçili altın yüzük koleksiyonunda net %20 indirim sizi bekliyor.',
          icon: 'fas fa-gem',
          backgroundImageUrl: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          title: 'Ücretsiz & Sigortalı Kargo',
          description: '1.500 TL ve üzeri tüm alışverişlerinizde kargonuz bizden hediye.',
          icon: 'fas fa-shipping-fast',
          backgroundImageUrl: 'https://images.pexels.com/photos/7709292/pexels-photo-7709292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          title: 'Esnek Ödeme Seçenekleri',
          description: 'Tüm kartlara peşin fiyatına 12 aya varan taksit imkanlarından yararlanın.',
          icon: 'fas fa-credit-card',
          backgroundImageUrl: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
      ]
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Raleway:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.campaigns {
  padding: 5rem 0;
  background-color: #fdfaf6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-title {
  font-family: 'Cormorant Garamond', serif;
  text-align: center;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.section-subtitle {
  font-family: 'Raleway', sans-serif;
  text-align: center;
  font-size: 1.1rem;
  color: #777;
  margin-bottom: 4rem;
}

.campaign-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
}

.campaign-card {
  position: relative;
  height: 450px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: default; /* GÜNCELLENDİ: Tıklama imleci kaldırıldı */
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s ease;
}

.campaign-card:hover .card-background {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
}

.card-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
}

.icon-wrapper {
  font-size: 4.5rem;
  color: #c5a47e;
  margin-bottom: 1.5rem;
  transition: all 0.4s ease;
}

.campaign-card:hover .icon-wrapper {
  transform: translateY(-10px) scale(0.8); /* GÜNCELLENDİ: Buton olmadığı için daha az kaysın */
}

.text-wrapper {
  transition: all 0.4s ease;
}

.campaign-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.campaign-description {
  font-family: 'Raleway', sans-serif;
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
  font-size: 1rem;
  margin: 1rem 0 0; /* GÜNCELLENDİ: Buton olmadığı için alt boşluk kaldırıldı */
  transform: translateY(10px);
  transition-delay: 0.1s;
  max-width: 280px; /* Açıklamanın çok yayılmasını engelle */
  margin-left: auto;
  margin-right: auto;
}

/* GÜNCELLENDİ: campaign-button stili kaldırıldı */

.campaign-card:hover .campaign-description {
  opacity: 1;
  transform: translateY(0);
}
</style>