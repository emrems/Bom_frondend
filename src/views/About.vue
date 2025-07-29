<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="about-hero">
      <div class="container">
        <h1>Altın Kuyumcu Hakkında</h1>
        <p>60 yıllık gelenek, modern tasarım</p>
      </div>
    </section>

    <!-- About Content -->
    <section class="about-content">
      <div class="container">
        <div class="about-grid">
          <div class="about-text">
            <h2>Biz Kimiz?</h2>
            <p>
              1960 yılında İstanbul Kapalıçarşı'da mütevazi bir dükkanla
              başlayan yolculuğumuz, bugün Türkiye'nin önde gelen mücevher
              markalarından biri olmamızla devam ediyor.
            </p>
            <p>
              Geleneksel el işçiliğini modern tasarımlarla buluşturarak, her
              bütçeye uygun kaliteli mücevherler üretiyoruz.
            </p>

            <div class="mission-vision">
              <div class="mission">
                <h3><i class="fas fa-bullseye"></i> Misyonumuz</h3>
                <p>
                  Müşterilerimize ömür boyu saklayabilecekleri, nesilden nesile
                  aktarılacak değerli takılar sunmak.
                </p>
              </div>
              <div class="vision">
                <h3><i class="fas fa-eye"></i> Vizyonumuz</h3>
                <p>
                  Dünya çapında tanınan, Türk mücevher sanatını global arenada
                  temsil eden bir marka olmak.
                </p>
              </div>
            </div>
          </div>

          <div class="about-image">
            <img
              src="https://images.pexels.com/photos/3266710/pexels-photo-3266710.jpeg"
              alt="Kuyumcu atölyesi"
            />
            <div class="experience-badge">
              <span>60+</span>
              <p>Yıllık Deneyim</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <h2>Usta Ellerimiz</h2>
        <p>Takılarımıza ruh katan değerli ustalarımız</p>

        <div class="team-grid">
          <div class="team-member">
            <div class="member-image">
              <img
                src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
                alt="Usta Mehmet"
              />
              <div class="social-links">
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-linkedin"></i></a>
              </div>
            </div>
            <h3>Mehmet Usta</h3>
            <p>Kıymetli Taş Uzmanı</p>
            <p class="bio">
              45 yıldır pırlanta ve değerli taşlar üzerine çalışıyor.
            </p>
          </div>

          <div class="team-member">
            <div class="member-image">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                alt="Usta Ayşe"
              />
              <div class="social-links">
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-linkedin"></i></a>
              </div>
            </div>
            <h3>Ayşe Usta</h3>
            <p>Altın İşleme Uzmanı</p>
            <p class="bio">
              Geleneksel Türk telkari sanatının son temsilcilerinden.
            </p>
          </div>

          <div class="team-member">
            <div class="member-image">
              <img
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg"
                alt="Usta Ali"
              />
              <div class="social-links">
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-linkedin"></i></a>
              </div>
            </div>
            <h3>Ali Usta</h3>
            <p>Tasarım Müdürü</p>
            <p class="bio">
              Modern ve geleneksel tasarımları buluşturan ödüllü tasarımcı.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="container">
        <h2>Değerlerimiz</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">
              <i class="fas fa-gem"></i>
            </div>
            <h3>Kalite</h3>
            <p>
              Tüm ürünlerimiz %100 saf altın ve sertifikalı taşlardan üretilir.
            </p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <i class="fas fa-handshake"></i>
            </div>
            <h3>Güven</h3>
            <p>60 yıldır aynı aile olarak hizmet veriyoruz.</p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <i class="fas fa-heart"></i>
            </div>
            <h3>Aşk</h3>
            <p>İşimizi tutkuyla yapıyor, her parçaya özenle yaklaşıyoruz.</p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <i class="fas fa-lightbulb"></i>
            </div>
            <h3>Yenilik</h3>
            <p>Geleneksel teknikleri modern tasarımlarla buluşturuyoruz.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  metaInfo: {
    title: "Hakkımızda - Altın Kuyumcu",
    meta: [
      {
        name: "description",
        content:
          "Altın Kuyumcu hakkında bilgiler. 60 yıllık mücevher deneyimi ile kaliteli takılar üretiyoruz.",
      },
    ],
  },
};
</script>

<style scoped>
.about-page {
  color: #333;
}

/* Hero Section */
.about-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("https://images.pexels.com/photos/3266709/pexels-photo-3266709.jpeg");
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 8rem 0;
}

.about-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.about-hero p {
  font-size: 1.5rem;
  opacity: 0.9;
}

/* About Content */
.about-content {
  padding: 5rem 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-text h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #d4af37;
}

.about-text p {
  margin-bottom: 1.5rem;
  line-height: 1.8;
  font-size: 1.1rem;
}

.mission-vision {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 3rem;
}

.mission,
.vision {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #d4af37;
}

.mission h3,
.vision h3 {
  color: #d4af37;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.about-image {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.about-image img {
  width: 100%;
  height: auto;
  display: block;
}

.experience-badge {
  position: absolute;
  bottom: -20px;
  right: -20px;
  background: #d4af37;
  color: white;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
}

.experience-badge span {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.experience-badge p {
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
}

/* Team Section */
.team-section {
  padding: 5rem 0;
  background: #f9f9f9;
  text-align: center;
}

.team-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #d4af37;
}

.team-section p {
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.team-member {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-10px);
}

.member-image {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
}

.member-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.social-links {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  display: flex;
  justify-content: center;
  gap: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.team-member:hover .social-links {
  opacity: 1;
}

.social-links a {
  color: white;
  font-size: 1.2rem;
}

.team-member h3 {
  margin: 1rem 0 0.5rem;
  color: #333;
}

.team-member p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 1rem;
}

.bio {
  font-style: italic;
  margin-top: 1rem !important;
}

/* Values Section */
.values-section {
  padding: 5rem 0;
  text-align: center;
}

.values-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #d4af37;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.value-card {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
}

.value-icon {
  width: 80px;
  height: 80px;
  background: #f4e8c9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: #d4af37;
}

.value-card h3 {
  margin-bottom: 1rem;
  color: #333;
}

.value-card p {
  color: #666;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 992px) {
  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-image {
    order: -1;
    max-width: 600px;
    margin: 0 auto;
  }

  .mission-vision {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .about-hero h1 {
    font-size: 2.5rem;
  }

  .about-hero p {
    font-size: 1.2rem;
  }

  .team-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
