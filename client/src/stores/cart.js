import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
  }),

  getters: {
    cartCount: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),

    cartTotal: (state) =>
      state.items.reduce((total, item) => total + Number(item.price) * item.quantity, 0),
  },

  actions: {
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    addToCart(product) {
      const existingItem = this.items.find((item) => item.id === product.id)

      if (existingItem) {
        if (existingItem.quantity < Number(product.stock)) {
          existingItem.quantity += 1
        }
      } else {
        this.items.push({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: Number(product.price),
          stock: Number(product.stock),
          quantity: 1,
        })
      }

      this.saveCart()
    },

    removeFromCart(productId) {
      this.items = this.items.filter((item) => item.id !== productId)
      this.saveCart()
    },

    increaseQuantity(productId) {
      const item = this.items.find((item) => item.id === productId)

      if (item && item.quantity < item.stock) {
        item.quantity += 1
        this.saveCart()
      }
    },

    decreaseQuantity(productId) {
      const item = this.items.find((item) => item.id === productId)

      if (!item) return

      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        this.items = this.items.filter((i) => i.id !== productId)
      }

      this.saveCart()
    },

    clearCart() {
      this.items = []
      this.saveCart()
    },
  },
})