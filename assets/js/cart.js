const CART = 'CART_LOCAL_STORAGE'

const cart = {
   empty: () => {
      localStorage.removeItem(CART)
   },
   get: () => {
      return JSON.parse(localStorage.getItem(CART))
   },
   add: (code, count = 1) => {
      if (!code) {
         return
      }

      let products = cart.get()
      if (!products) {
         products = [
            { code, quantity: count }
         ]
         localStorage.setItem(CART, JSON.stringify(products))
         return
      }

      let product = products.find((item) => item.code == code)

      if (!product) {
         products.push({
            code,
            quantity: count
         })

      } else {
         product.quantity += count

         if (product.quantity <= 0) {
            products = products.filter(({ code: cod }) => cod != code)
         }
      }

      localStorage.setItem(CART, JSON.stringify(products))
   },
   remove: (code) => {
      let products = cart.get()
      products = products.filter((item) => item.code != code)

      localStorage.setItem(CART, JSON.stringify(products))
   },
   isEmpty: () => {
      const ca = cart.get()

      return !ca || ca.length <= 0
   }
}

export { CART, cart }