<template>
  <div id="app">
    <!-- Header/Footer gösterme mantığı korunuyor -->
    <Header v-if="showHeaderFooter" />
    
    <main>
      <router-view />
    </main>
    
    <Footer v-if="showHeaderFooter" />

    <!-- Çerez Yönetim Sistemi -->
    <CookieConsentBanner 
      :is-visible="showBanner" 
      @accept-all="acceptAllCookies" 
      @customize="openSettingsModal"
      @close="closeBanner"
    />
    <CookieSettingsModal
      v-if="showSettingsModal"
      @close="closeSettingsModal"
      @save-preferences="saveCookiePreferences"
    />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import CookieConsentBanner from './components/CookieConsentBanner.vue';
import CookieSettingsModal from './components/CookieSettingsModal.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    CookieConsentBanner,
    CookieSettingsModal
  },
  data() {
    return {
      showBanner: false, 
      showSettingsModal: false,
    };
  },
  computed: {
    showHeaderFooter() {
      const pagesWithoutLayout = ['Loginapp', 'Register', 'ForgotPassword'];
      return !pagesWithoutLayout.includes(this.$route.name);
    }
  },
  mounted() {
    this.handleInitialCookieConsent();
  },
  methods: {
    handleInitialCookieConsent() {
      const consentCookie = this.getCookie('cookie_consent');
      if (consentCookie) {
        this.showBanner = false;
        try {
          const preferences = JSON.parse(consentCookie);
          this.applyCookiePreferences(preferences);
        } catch (e) {
          console.error("Çerez verisi okunamadı:", e);
          this.showBanner = true;
        }
      } else {
        this.showBanner = true;
      }
    },

    acceptAllCookies() {
      const preferences = {
        necessary: true,
        performance: true,
        targeting: true
      };
      this.saveCookiePreferences(preferences);
    },
    
    openSettingsModal() {
      this.showBanner = false;
      this.showSettingsModal = true;
    },
    
    closeSettingsModal() {
      this.showSettingsModal = false;
      if (!this.getCookie('cookie_consent')) {
        this.showBanner = true;
      }
    },
    
    saveCookiePreferences(preferences) {
      this.setCookie('cookie_consent', JSON.stringify(preferences), 365);
      this.showBanner = false;
      this.showSettingsModal = false;
      console.log('Çerez tercihleri kaydedildi:', preferences);
      this.applyCookiePreferences(preferences);
    },

    applyCookiePreferences(preferences) {
      if (preferences.performance) {
        this.loadGoogleAnalytics();
      } else {
        this.unloadGoogleAnalytics();
      }
      
      if (preferences.targeting) {
        this.loadFacebookPixel();
      } else {
        this.unloadFacebookPixel();
      }
    },

    loadGoogleAnalytics() {
      if (document.getElementById('google-analytics-script')) return;

      // GÜNCELLENDİ: Google Analytics ID'niz buraya eklendi.
      const GA_MEASUREMENT_ID = 'G-2JYJHC64P0';
      
      const gaScript = document.createElement('script');
      gaScript.id = 'google-analytics-script';
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`; 
      document.head.appendChild(gaScript);

      const dataLayerScript = document.createElement('script');
      dataLayerScript.id = 'google-analytics-datalayer';
      dataLayerScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
      `;
      document.head.appendChild(dataLayerScript);
      console.log(`Google Analytics (ID: ${GA_MEASUREMENT_ID}) YÜKLENDİ.`);
    },
    
    unloadGoogleAnalytics() {
      this.deleteCookie('_ga');
      this.deleteCookie('_gid');
      this.deleteCookie('_gat');
      const gaMeasurementId = 'G-2JYJHC64P0';
      this.deleteCookie(`_ga_${gaMeasurementId.substring(2)}`);
      console.log("Google Analytics DEVRE DIŞI BIRAKILDI ve çerezleri temizlendi.");
    },

    loadFacebookPixel() {
      if (document.getElementById('facebook-pixel-script')) return;
      
      // !!! ÖNEMLİ: Facebook Pixel ID'nizi aldığınızda bu kısmı güncelleyin !!!
      const FB_PIXEL_ID = 'YOUR_PIXEL_ID';
      
      const fbpScript = document.createElement('script');
      fbpScript.id = 'facebook-pixel-script';
      fbpScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${FB_PIXEL_ID}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbpScript);
      console.log(`Facebook Pixel (ID: ${FB_PIXEL_ID}) YÜKLENDİ.`);
    },

    unloadFacebookPixel() {
      this.deleteCookie('_fbp');
      console.log("Facebook Pixel DEVRE DIŞI BIRAKILDI ve çerezleri temizlendi.");
    },

    closeBanner() {
      this.showBanner = false;
    },

    // --- ÇEREZ YARDIMCI METODLARI ---
    setCookie(name, value, days) {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
  // Siteniz HTTPS olduğu için 'Secure' parametresi kalmalı.
  // Domain belirtmiyoruz, böylece tarayıcı bunu mevcut domain için doğru şekilde ayarlar.
  // Bu, 'www' olan ve olmayan versiyonlar arasındaki sorunları engeller.
      document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
    },

    getCookie(name) {
  // Bu metodunuz zaten doğru çalışıyor, değiştirmeye gerek yok.
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
    
    deleteCookie(name) {
  // Bir çerezi silmenin en güvenilir yolu, onu geçmiş bir tarihte sona erecek şekilde
  // yeniden oluşturmaktır. Bu, 'path', 'domain' ve 'secure' ayarlarının tutarlı olmasını sağlar.
      this.setCookie(name, '', -1);
    }
  }
}
</script>

<style>
/* Mevcut global stillerinizde herhangi bir değişiklik yapılmadı */
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