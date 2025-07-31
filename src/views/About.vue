<template>
  <div class="about-page">
    <section class="about-hero">
      <div class="hero-background-animation"></div>
      <div class="container">
        <h1>60 Yıllık Gelenek, Modern Zarafet</h1>
        <p>El işçiliğinin sanatla buluştuğu yer.</p>
      </div>
    </section>

    <section class="about-content">
      <div class="container">
        <div class="about-grid">
          <div class="about-text fade-in-up">
            <h2>Biz Kimiz?</h2>
            <p>
              1960 yılında İstanbul Kapalıçarşı'da mütevazi bir atölyede başlayan
              yolculuğumuz, bugün üç nesildir süregelen bir tutkuyla
              Türkiye'nin en saygın mücevher markalarından birine dönüştü.
            </p>
            <p>
              Geleneksel zanaatkarlığı, yenilikçi ve zamansız tasarımlarla
              birleştirerek her biri birer sanat eseri olan değerli anılar
              yaratıyoruz.
            </p>

            <div class="mission-vision">
              <div class="mission">
                <h3><i class="fas fa-bullseye"></i> Misyonumuz</h3>
                <p>
                  Müşterilerimize ömür boyu gururla taşıyacakları, nesilden
                  nesile aktarılacak eşsiz ve anlamlı mücevherler sunmak.
                </p>
              </div>
              <div class="vision">
                <h3><i class="fas fa-eye"></i> Vizyonumuz</h3>
                <p>
                  Türk mücevher sanatının zarafetini ve kalitesini dünya
                  çapında temsil eden, global bir lüks marka olmak.
                </p>
              </div>
            </div>
          </div>

          <div class="about-image fade-in-right">
            <img
              src="https://images.pexels.com/photos/5442465/pexels-photo-5442465.jpeg"
              alt="Kuyumcu atölyesi"
            />
            <div class="experience-badge">
              <span>{{ experienceYears }}+</span>
              <p>Yıllık Deneyim</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="team-section">
      <div class="container">
        <h2 class="fade-in-up">Usta Ellerimiz</h2>
        <p class="fade-in-up section-subtitle">
          Takılarımıza ruh katan değerli zanaatkarlarımız.
        </p>

        <div class="team-grid">
          <div class="team-member fade-in-up">
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
              45 yıldır pırlanta ve değerli taşların gizemli dünyasında harikalar
              yaratıyor.
            </p>
          </div>

          <div class="team-member fade-in-up" style="animation-delay: 0.2s">
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
              Geleneksel Türk telkari sanatının modern tasarımlarla buluşan son
              temsilcilerinden.
            </p>
          </div>

          <div class="team-member fade-in-up" style="animation-delay: 0.4s">
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
              Modern ve klasiği harmanlayan, uluslararası ödüllere sahip vizyoner
              tasarımcı.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <h2 class="fade-in-up">Değerlerimiz</h2>
        <p class="fade-in-up section-subtitle">
          Bizi biz yapan temel ilkelerimiz.
        </p>
        <div class="values-grid">
          <div class="value-card fade-in-up">
            <div class="value-icon">
              <i class="fas fa-gem"></i>
            </div>
            <h3>Kalite</h3>
            <p>
              Tüm ürünlerimiz en saf materyaller ve sertifikalı değerli
              taşlarla, en yüksek standartlarda üretilir.
            </p>
          </div>

          <div class="value-card fade-in-up" style="animation-delay: 0.15s">
            <div class="value-icon">
              <i class="fas fa-handshake"></i>
            </div>
            <h3>Güven</h3>
            <p>
              60 yılı aşkın süredir müşterilerimizle kurduğumuz şeffaf ve dürüst
              ilişki en büyük sermayemizdir.
            </p>
          </div>

          <div class="value-card fade-in-up" style="animation-delay: 0.3s">
            <div class="value-icon">
              <i class="fas fa-heart"></i>
            </div>
            <h3>Tutku</h3>
            <p>
              İşimizi bir sanata olan aşkla yapıyor, her bir parçaya özenle ve
              sevgiyle yaklaşıyoruz.
            </p>
          </div>

          <div class="value-card fade-in-up" style="animation-delay: 0.45s">
            <div class="value-icon">
              <i class="fas fa-lightbulb"></i>
            </div>
            <h3>Yenilik</h3>
            <p>
              Köklerimize sadık kalarak, geleneksel teknikleri daima modern
              tasarım anlayışıyla buluşturuyoruz.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  data() {
    return {
      experienceYears: new Date().getFullYear() - 1960,
    };
  },
  mounted() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    document.querySelectorAll(".fade-in-up, .fade-in-right").forEach((el) => {
      observer.observe(el);
    });
  },
  metaInfo: {
    title: "Hakkımızda - Altın Kuyumcu",
    meta: [
      {
        name: "description",
        content:
          "Altın Kuyumcu hakkında bilgiler. 60 yılı aşkın mücevher deneyimi ile geleneksel el işçiliğini modern tasarımlarla buluşturuyoruz.",
      },
    ],
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Raleway:wght@400;500;700&display=swap");

:root {
  --font-serif: "Cormorant Garamond", serif;
  --font-sans: "Raleway", sans-serif;
  --color-gold: #c5a47e;
  --color-dark-gold: #b38e64;
  --color-text: #4a4a4a;
  --color-light-bg: #fdfaf6;
  --color-dark-bg: #f8f2e9;
  --shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
}

.about-page {
  color: var(--color-text);
  background-color: var(--color-light-bg);
  font-family: var(--font-sans);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.fade-in-up,
.fade-in-right {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1),
    transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.fade-in-right {
  transform: translateX(-40px);
}
.fade-in-up.visible,
.fade-in-right.visible {
  opacity: 1;
  transform: translateY(0);
}
.fade-in-right.visible {
  transform: translateX(0);
}

.about-hero {
  position: relative;
  overflow: hidden;
  color: white;
  text-align: center;
  padding: 10rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* ARKA PLAN GÖRSELİ GÜNCELLENDİ */
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("https://images.pexels.com/photos/16997083/pexels-photo-16997083/free-photo-of-is-adam-ziynet-eller-altin.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2");
  background-size: cover;
  background-position: center;
  animation: kenburns 20s ease-out infinite;
  z-index: 1;
}
.about-hero .container {
  position: relative;
  z-index: 2;
}
@keyframes kenburns {
  0% {
    transform: scale(1) translate(0, 0);
  }
  50% {
    transform: scale(1.1) translate(-2%, 2%);
  }
  100% {
    transform: scale(1) translate(0, 0);
  }
}

.about-hero h1 {
  font-family: var(--font-serif);
  font-size: 4rem;
  margin-bottom: 1rem;
  font-weight: 600;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.about-hero p {
  font-size: 1.5rem;
  opacity: 0.9;
  font-weight: 400;
}

.about-content {
  padding: 6rem 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.about-text h2 {
  font-family: var(--font-serif);
  font-size: 3rem;
  margin-bottom: 2rem;
  color: var(--color-gold);
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
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #eee;
  transition: all 0.3s ease;
}
.mission:hover,
.vision:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.mission h3,
.vision h3 {
  font-family: var(--font-serif);
  color: var(--color-dark-gold);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
}

.about-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
}
.about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.experience-badge {
  position: absolute;
  bottom: 25px;
  right: -30px;
  background: var(--color-gold);
  color: white;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(197, 164, 126, 0.4);
  border: 4px solid white;
}

.experience-badge span {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
}

.experience-badge p {
  font-size: 1rem;
  margin: 0;
  text-align: center;
}

.team-section,
.values-section {
  padding: 6rem 0;
  text-align: center;
}
.team-section {
  background: var(--color-dark-bg);
}

.team-section h2,
.values-section h2 {
  font-family: var(--font-serif);
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--color-gold);
}
.section-subtitle {
  margin-bottom: 4rem;
  font-size: 1.2rem;
  color: #777;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.team-grid,
.values-grid {
  display: grid;
  gap: 2.5rem;
}
.team-grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
.values-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.team-member {
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  overflow: hidden;
  padding-bottom: 2rem;
}
.team-member:hover {
  transform: translateY(-12px);
  box-shadow: var(--shadow);
}

.member-image {
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 1.5rem;
}
.member-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.team-member:hover .member-image img {
  transform: scale(1.05);
}

.social-links {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 2rem 1rem 1rem;
  display: flex;
  justify-content: center;
  gap: 15px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.team-member:hover .social-links {
  opacity: 1;
  transform: translateY(0);
}
.social-links a {
  color: white;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}
.social-links a:hover {
  color: var(--color-gold);
}
.team-member h3 {
  font-family: var(--font-serif);
  margin: 1rem 0 0.5rem;
  color: var(--color-text);
  font-size: 1.5rem;
}
.team-member p {
  color: #777;
  font-size: 1rem;
  padding: 0 1rem;
}
.bio {
  font-style: italic;
  margin-top: 1rem !important;
}

.value-card {
  padding: 2.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.value-card:hover {
  transform: translateY(-12px);
  box-shadow: var(--shadow);
}
.value-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(145deg, var(--color-light-bg), white);
  border: 1px solid #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2.2rem;
  color: var(--color-gold);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}
.value-card h3 {
  font-family: var(--font-serif);
  margin-bottom: 1rem;
  color: var(--color-text);
  font-size: 1.5rem;
}
.value-card p {
  color: #777;
  line-height: 1.7;
}

@media (max-width: 992px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
  .about-image {
    order: -1;
    max-width: 500px;
    margin: 0 auto;
  }
  .mission-vision {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .about-hero h1 {
    font-size: 2.8rem;
  }
  .about-hero p {
    font-size: 1.2rem;
  }
  .about-text h2,
  .team-section h2,
  .values-section h2 {
    font-size: 2.5rem;
  }
  .team-grid {
    grid-template-columns: 1fr;
    max-width: 350px;
    margin: 0 auto;
  }
}
</style>