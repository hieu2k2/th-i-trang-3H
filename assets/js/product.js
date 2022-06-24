const PRODUCT = "PRODUCT_VIEWED"
let urlBase = "https://website-3h.herokuapp.com/api/v1"

const getProducts = () => $.ajax({
   url: `${urlBase}/products/true?size=100`
}).then((data) => data.content)

export const product = {
   set: async (code) => {
      let proList = await product.getWithoutInfo()
      if (!proList) {
         proList = [code]
         localStorage.setItem(PRODUCT, JSON.stringify(proList))

         return
      }
      proList.push(code)

      localStorage.setItem(PRODUCT, JSON.stringify([...new Set(proList)]))
   },
   getWithoutInfo: () => {
      return JSON.parse(localStorage.getItem(PRODUCT))
   },
   get: async () => {
      const ls = JSON.parse(localStorage.getItem(PRODUCT))
      const products = []

      if (!ls) {
         return []
      }

      const proList = await getProducts();
      return proList.filter(p => ls.some(x => x == p.code));
   }
}