import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    token: localStorage.getItem('authToken') || null,
    cartId: localStorage.getItem('cartId') || null,
    cartItems: JSON.parse(localStorage.getItem('cartItems') || '[]')
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('authToken', token);
    },
    CLEAR_TOKEN(state) {
      state.token = null;
      localStorage.removeItem('authToken');
    },
    SET_CART_ID(state, cartId) {
      state.cartId = cartId;
      localStorage.setItem('cartId', cartId);
    },
    CLEAR_CART_ID(state) {
      state.cartId = null;
      localStorage.removeItem('cartId');
    },
    SET_CART_ITEMS(state, items) {
      state.cartItems = items;
      localStorage.setItem('cartItems', JSON.stringify(items));
    },
    // Bu mutasyon artık doğrudan addItemToCart içinde kullanılmayacak.
    // Sadece updateCartItemQuantity veya removeItemFromCart gibi action'ların
    // 'cartId' olmadığı durumlarda yerel güncellemeler için kalacak.
    ADD_OR_UPDATE_CART_ITEM_LOCALLY(state, { productId, quantity, productName, unitPrice, imageUrl }) {
      const existingItem = state.cartItems.find(item => item.id === productId);

      if (existingItem) {
        existingItem.quantity = quantity; // Miktarı direkt set et
      } else {
        state.cartItems.push({
          id: productId,
          name: productName,
          price: unitPrice,
          image: imageUrl,
          quantity: quantity
        });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    REMOVE_FROM_CART_LOCALLY(state, productId) {
      state.cartItems = state.cartItems.filter(item => item.id !== productId);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    CLEAR_CART(state) {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },
  actions: {
    login({ commit }, token) {
      commit('SET_TOKEN', token);
    },
    logout({ commit }) {
      commit('CLEAR_TOKEN');
      commit('CLEAR_CART_ID');
      commit('CLEAR_CART');
    },
    setCartId({ commit }, cartId) {
      commit('SET_CART_ID', cartId);
    },
    clearCartId({ commit }) {
      commit('CLEAR_CART_ID');
    },
    // Sepete ürün ekleme action'ı
    async addItemToCart({ commit, state, dispatch }, { product, quantity, mainImage }) {
      // ÖNEMLİ: Yerel ADD_OR_UPDATE_CART_ITEM_LOCALLY mutasyon çağrısı kaldırıldı.
      // Sepet UI'ı artık tamamen API'den dönen veriye göre güncellenecek.

      let payload = {
        productId: product.id,
        quantity: quantity, // Bu, eklenecek miktar
        cartId: state.cartId 
      };

      const headers = {};
      if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
      }

      try {
        const response = await axios.post('http://localhost:5294/api/Cart/add', payload, { headers });
        const updatedCartFromApi = response.data; // API'den dönen sepet objesi
        console.log("aradığımız CA",response.data);

        if (updatedCartFromApi && updatedCartFromApi.cartId && updatedCartFromApi.cartId !== state.cartId) {
          commit('SET_CART_ID', updatedCartFromApi.cartId);
        }
        
        // API'den gelen güncel sepet içeriğini Vuex'e ve localStorage'a kaydet
        // BU KISIM TÜM GÜNCELLEMELERİN TEK GÜVENİLİR KAYNAĞI OLACAK.
        commit('SET_CART_ITEMS', updatedCartFromApi.items.map(item => ({
           id: item.productId,
           name: item.productName,
           price: item.unitPrice,
           image: item.imageUrl,
           quantity: item.quantity
        })));

        return true;
      } catch (error) {
        console.error('API’ye sepet güncelleme hatası:', error);
        // Hata durumunda, kullanıcının UI'da gördüğü sepetin doğru olması için,
        // API'den sepeti tekrar çekmek en güvenli yöntemdir.
        dispatch('fetchCartDetails'); // Sepeti yeniden senkronize et
        throw new Error('Ürün sepete eklenirken sunucu tarafında bir hata oluştu: ' + (error.response?.data?.message || error.message));
      }
    },
    // Sepetten ürün silme action'ı
    async removeItemFromCart({ commit, state, dispatch }, productId) {
      if (!state.cartId) {
        console.warn('Sepet kimliği (cartId) bulunamadı. Ürün yerelden silinecek ancak API\'ye istek gönderilmeyecek.');
        commit('REMOVE_FROM_CART_LOCALLY', productId); // Sadece yerelden sil
        return;
      }

      const payload = {
        productId: productId,
        cartId: state.cartId
      };

      const headers = {};
      if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
      }

      try {
        const response = await axios.delete('http://localhost:5294/api/Cart/remove', { data: payload, headers: headers }); 
        
        const updatedCartFromApi = response.data;
        commit('SET_CART_ITEMS', updatedCartFromApi.items.map(item => ({
           id: item.productId,
           name: item.productName,
           price: item.unitPrice,
           image: item.imageUrl,
           quantity: item.quantity
        })));

        return true;
      } catch (error) {
        console.error('API’den ürün silinirken hata oluştu:', error);
        dispatch('fetchCartDetails'); // Hata durumunda sepeti yeniden senkronize et
        throw new Error('Ürün sepetten silinirken bir hata oluştu: ' + (error.response?.data?.message || error.message));
      }
    },
    // Sepet öğesi miktarını güncellemek için
    async updateCartItemQuantity({ commit, state, dispatch }, { productId, quantity }) {
      if (!state.cartId) {
        console.warn('Sepet kimliği (cartId) bulunamadı. Miktar yerelden güncellenecek ancak API\'ye istek gönderilmeyecek.');
        const itemToUpdate = state.cartItems.find(item => item.id === productId);
        if(itemToUpdate) {
            commit('ADD_OR_UPDATE_CART_ITEM_LOCALLY', { 
                productId: productId, 
                quantity: quantity,
                productName: itemToUpdate.name,
                unitPrice: itemToUpdate.price,
                imageUrl: itemToUpdate.image
            });
        }
        return;
      }

      const payload = {
        productId: productId,
        quantity: quantity,
        cartId: state.cartId
      };

      const headers = {};
      if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
      }

      try {
        const response = await axios.put('http://localhost:5294/api/Cart/update', payload, { headers });
        
        const updatedCartFromApi = response.data;
        commit('SET_CART_ITEMS', updatedCartFromApi.items.map(item => ({
           id: item.productId,
           name: item.productName,
           price: item.unitPrice,
           image: item.imageUrl,
           quantity: item.quantity
        })));

        return true;
      } catch (error) {
        console.error('API’ye sepet öğesi miktarı güncellenirken hata oluştu:', error);
        dispatch('fetchCartDetails'); // Hata durumunda sepeti yeniden senkronize et
        throw new Error('Sepet öğesi miktarı güncellenirken bir hata oluştu: ' + (error.response?.data?.message || error.message));
      }
    },
    clearCart({ commit }) {
      commit('CLEAR_CART');
      commit('CLEAR_CART_ID');
    },
    // Sepeti API'den çekme action'ı (Kullanıcının durumuna göre farklı endpoint'ler kullanır)
    async fetchCartDetails({ commit, state }) {
      const headers = {};
      let response;

      try {
        if (state.token) {
          // Kullanıcı giriş yapmış: /api/Cart endpoint'ine token ile GET isteği
          headers['Authorization'] = `Bearer ${state.token}`;
          response = await axios.get('http://localhost:5294/api/Cart', { headers });
        } else if (state.cartId) {
          // Kullanıcı misafir ve daha önce bir cartId almış: /api/Cart/get endpoint'ine POST isteği
          const payload = { cartId: state.cartId };
          response = await axios.post('http://localhost:5294/api/Cart/get', payload, { headers });
        } else {
          // Kullanıcı misafir ve henüz bir cartId'si yok. Sepet boş olarak kabul edilebilir.
          // İlk ürün eklendiğinde API'den zaten yeni bir cartId gelecek.
          commit('CLEAR_CART');
          commit('CLEAR_CART_ID');
          return; 
        }
        
        const cartFromApi = response.data;
        
        if (cartFromApi) {
          if (cartFromApi.cartId && cartFromApi.cartId !== state.cartId) {
             commit('SET_CART_ID', cartFromApi.cartId);
          }
          commit('SET_CART_ITEMS', cartFromApi.items.map(item => ({
            id: item.productId,
            name: item.productName,
            price: item.unitPrice,
            image: item.imageUrl,
            quantity: item.quantity
          })));
        } else {
          commit('CLEAR_CART');
          commit('CLEAR_CART_ID');
        }
      } catch (error) {
        console.error('API’den sepet detayları çekilirken hata oluştu:', error);
        if (error.response && error.response.status === 404) {
            commit('CLEAR_CART');
            commit('CLEAR_CART_ID');
        }
        throw new Error('Sepet detayları yüklenirken bir sorun oluştu: ' + (error.response?.data?.message || error.message));
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    cartId: state => state.cartId,
    cartItems: state => state.cartItems,
    cartItemCount: state => state.cartItems.reduce((total, item) => total + item.quantity, 0),
    cartTotalPrice: state => state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }
});