let urlBase = "https://website-3h.herokuapp.com/api/v1"
let urlBaseAdmin = " https://website-3h.herokuapp.com/admin/api/v1"
import { cart } from "./cart.js";
import { formatCost } from "./utilities.js"

const filterRender = {
   initFilter: () => {
      $.ajax({
         url: `${urlBase}/products/fields`,
         success: (result) => {
            const { brands, categories, colors, sizes } = result

            filterRender.brandsRender(brands.filter(x=>x.state))
            filterRender.categoriesRender(categories.filter(x=>x.state))
            filterRender.colorsRender(colors.filter(x=>x.state))
            filterRender.sizesRender(sizes.filter(x=>x.state))
            filterRender.priceRender()
         }
      });
   },
   brandsRender: (brands) => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const brandCode = urlParams.get('brand-code')

      $('#show-list-1').append([...brands].map((item, i) => {
         return `
            <li value=${item.code}>
               <input type="radio" id="brand_${item.code}" ${brandCode == item.code ? 'checked' : ''} name="brand_filter" value="${item.code}" class="d-inline-block">
               <label for="brand_${item.code}" style="cursor: pointer">${item.name}</label><br>
            </li>
         `
      }).join(''))
   },
   categoriesRender: (categories) => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const categoryCode = urlParams.get('category-code')
      $('#show-list-2').append([...categories].map((item) => {
         return `
            <li >
               <input type="radio" id="category_${item.code}" ${categoryCode == item.code ? 'checked' : ''} name="category_filter" value="${item.code}" class="d-inline-block">
               <label for="category_${item.code}" style="cursor: pointer">${item.name}</label><br>
            </li>
         `
      }).join(''))
   },
   colorsRender: (colors) => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const productColor = urlParams.get('product-color')
      $('#show-list-4').append([...colors].map((item) => {
         return `
            <li >
               <input type="radio" id="color_${item.code}" ${productColor == item.code ? 'checked' : ''} name="color_filter" value="${item.code}" class="d-inline-block">
               <label for="color_${item.code}" style="cursor: pointer">${item.name}</label><br>
            </li>
         `
      }).join(''))
   },
   sizesRender: (sizes) => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const productSize = urlParams.get('product-size')
      $('#show-list-5').append([...sizes].map((item) => {
         return `
            <li >
               <input type="radio" id="size_${item.code}" ${productSize == item.code ? 'checked' : ''} name="size_filter" value="${item.code}" class="d-inline-block">
               <label for="size_${item.code}" style="cursor: pointer">${item.name}</label><br>
            </li>
         `
      }).join(''))
   },
   priceRender: () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const min = urlParams.get('min')
      const max = urlParams.get('max')

      $('#min-price').val(min)
      $('#max-price').val(max)

   },
   initSubmitFilter: () => {

      $('.submit-filter').on('click', () => {
         const brandVal = $('#show-list-1 input[name=brand_filter]:checked', '.form-filter').val()
         const categoryVal = $('#show-list-2 input[name=category_filter]:checked', '.form-filter').val()
         const colorVal = $('#show-list-4 input[name=color_filter]:checked', '.form-filter').val()
         const sizeVal = $('#show-list-5 input[name=size_filter]:checked', '.form-filter').val()
         const minPriceVal = $('#min-price').val()
         const maxPriceVal = $('#max-price').val()
         const page = 0
         const size = 8

         let combineUrl = `?page=${page}&size=${size}`

         if (brandVal) {
            combineUrl += `&brand-code=${brandVal}`
         }

         if (categoryVal) {
            combineUrl += `&category-code=${categoryVal}`
         }

         if (colorVal) {
            combineUrl += `&product-color=${colorVal}`
         }

         if (sizeVal) {
            combineUrl += `&product-size=${sizeVal}`
         }

         if (minPriceVal && maxPriceVal && !isNaN(minPriceVal) && !isNaN(maxPriceVal) && minPriceVal > 0 && maxPriceVal > 0 && minPriceVal * 1.0 <= maxPriceVal * 1.0) {
            combineUrl += `&min=${minPriceVal}&max=${maxPriceVal}`
         }

         const newUrl = `${window.location.origin}${window.location.pathname}${combineUrl}`

         history.pushState({}, null, newUrl.replace(`page=${page}`, `page=${page + 1}`));


         productsRender.callApi(`products/filter${combineUrl}`, ({ content: data }) => {
            // Thiếu trường tổng số sản phẩm theo filter
            productsRender.renderProducts(data)
         })

      })
   }
}

const product = {
   parseProduct: (src, alt, productName, productPrice, code, competitive) => {
      return `
            <div class="col-md-3 col-6 div-img-hover" >
               <div>
                  <div class="text-center wrap-img-sp">
                     <img src="${src}" class="img-hover" alt="${alt}" style="height:150px">
                        <div class="xem-chi-tiet">
                           <a href="chitietsanpham.html?code=${code}">Xem chi tiết</a>
                        </div>
                        <span class="product-new-top">Trả góp 0%</span>
               </div>
                     <div class="text-center mt-2">
                        <h4 class="pt-1 ten-san-pham">
                           <a href="single.html">${productName}</a>
                        </h4>
                        <div class="mt-2 text-center mb-0">
                           <p class="text-center mx-auto text-danger mb-0">${formatCost(productPrice)}
                              <span class="VND badge badge-danger"
                                 style="vertical-align: top; font-size: 10px;">đ
                              </span>
                           </p>
                           <del class="text-center">${formatCost(competitive)} <span class="VND badge badge-default"
                              style="vertical-align: top; font-size: 10px; background-color: gray;">đ</span></del>
                        </div>
                        <button class="btn-them" data-code="${code}">Thêm vào giỏ</button>
                     </div>
                  </div>
               </div>
         `
   },
   initProductPagination: (count, size, current) => {
      const paginCount = parseInt((count + size - 1) / size)

      $('.pagination-product').empty()

      if (paginCount > 0) {

         $('.pagination-product').append(`
            <li class="page-item" >
               <a class="page-link" href="${productsRender.getUrlToPagination(1)}" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
               </a>
            </li>
               ${Array.apply(null, { length: paginCount }).map((v, i) => {
            return `<li class="page-item ${i == current - 1 ? 'active' : ''}"><a class="page-link" href="${productsRender.getUrlToPagination(i + 1)}">${i + 1}</a></li>`
         }).join('')
            }
            <li class="page-item">
               <a class="page-link" href="${productsRender.getUrlToPagination(paginCount)}" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
               </a>
            </li>
`)
      }
   },
   initAddToCart: () => {
      $('body').on('click', '.btn-them', function () {
         cart.add($(this).data('code'))
         alert('Thêm thành công')
      })
   }
}

const productsRender = {
   callApi: (urlApi, cb) => {
      $.ajax({
         url: `${urlBase}/${urlApi}`,
         success: cb
      });
   },
   renderProductsRow: (data, iS, iE) => {
      let productStr = '';

      [...data].slice(iS, iE).forEach((item, i) => {
         console.log(item);
         let { image: src, name: productName, price: productPrice, code, id, competitive } = item
         let alt = ''
         // khi nào có hình ảnh thì sửa 'Resources/myImages/s1.png' -> src
         productStr += product.parseProduct(src !== 'no-image' ? src : 'Resources/myImages/s1.png', alt, productName, productPrice, code, competitive)

      })

      $('.entire-products').append(`
            <div class="px-sm-1 px-1 py-sm-5">
                  <div class="row ">
                     ${productStr}
                  </div>
               </div>
         `)
   },
   renderProducts: (data) => {
      let count = data.length

      $('.pagination-product').empty()
      $('.entire-products').empty()
      $('.Page.navigation.example').empty()

      if (count <= 0) {
         $('.entire-products').append(`
            <div class="text-center">
               <img src="Resources/myImages/search-no.png"/>
               <br/>
               <p class="lead text-center">Không có sản phẩm nào</p>
               <a href="sanpham.html" class="btn btn-warning">xóa bộ lọc</a>
            </div>
         `)

         return
      }

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sizeFixed = 8
      const pageFixed = 1

      const page = parseInt(urlParams.get('page'))
      const size = parseInt(urlParams.get('size'))

      productsRender.renderPagination(productsRender.getUrlInit(true), isNaN(page) ? pageFixed : page, isNaN(size) ? sizeFixed : size)


      if (count > 0) {
         productsRender.renderProductsRow(data, 0, 4)
      }

      if (count > 4) {
         productsRender.renderProductsRow(data, 4, 8)
      }
   },
   renderAllProducts: (urlApi, page, size) => {

      productsRender.callApi(`${urlApi}`, ({ content: data }) => {

         productsRender.renderProducts(data)

      })
   },
   renderPagination: (urlApi, current, size) => {

      productsRender.callApi(urlApi, ({ content: data }) => {

         let count = data.length

         product.initProductPagination(count, size, current)

      })
   },
   getUrlInit: (isAll = false) => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      let page = urlParams.get('page')
      let size = urlParams.get('size')
      const brandCode = urlParams.get('brand-code')
      const categoryCode = urlParams.get('category-code')
      const productSize = urlParams.get('product-size')
      const productColor = urlParams.get('product-color')
      const min = urlParams.get('min')
      const max = urlParams.get('max')

      if (isAll) {
         page = 0
         size = 1000
      }

      let urlCombine = `products/filter?page=${page ? page - 1 : 0}&size=${size ? size : 8}`

      if (brandCode) {
         urlCombine += `&brand-code=${brandCode}`
      }

      if (categoryCode) {
         urlCombine += `&category-code=${categoryCode}`
      }

      if (productSize) {
         urlCombine += `&product-size=${productSize}`
      }

      if (productColor) {
         urlCombine += `&product-color=${productColor}`
      }

      if (min) {
         urlCombine += `&min=${min}`
      }

      if (max) {
         urlCombine += `&max=${max}`
      }

      return urlCombine
   },
   getUrlToPagination: (pageIn = 1, sizeIn = 8) => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      const brandCode = urlParams.get('brand-code')
      const categoryCode = urlParams.get('category-code')
      const productSize = urlParams.get('product-size')
      const productColor = urlParams.get('productColor')
      const min = urlParams.get('min')
      const max = urlParams.get('max')


      let urlCombine = `sanpham.html?page=${pageIn}&size=${sizeIn}`

      if (brandCode) {
         urlCombine += `&brand-code=${brandCode}`
      }

      if (categoryCode) {
         urlCombine += `&category-code=${categoryCode}`
      }

      if (productSize) {
         urlCombine += `&product-size=${productSize}`
      }

      if (productColor) {
         urlCombine += `&product-color=${productColor}`
      }

      if (min) {
         urlCombine += `&min=${min}`
      }

      if (max) {
         urlCombine += `&max=${max}`
      }


      return urlCombine
   }
}

$(window).ready(() => {

   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const sizeFixed = 8
   const pageFixed = 1

   const page = parseInt(urlParams.get('page'))
   const size = parseInt(urlParams.get('size'))

   filterRender.initFilter()

   productsRender.renderAllProducts(productsRender.getUrlInit(), isNaN(page) ? pageFixed : page, isNaN(size) ? sizeFixed : size)
   productsRender.renderPagination(productsRender.getUrlInit(true), isNaN(page) ? pageFixed : page, isNaN(size) ? sizeFixed : size)

   filterRender.initSubmitFilter()

   product.initAddToCart()
})