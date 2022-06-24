let urlBase = "https://website-3h.herokuapp.com/api/v1"
import { cart } from "./cart.js";
import { product as pLocal } from './product.js'
import { user } from './user.js'
import { formatDate } from "./utilities.js";

const product = {
   callApi: (urlApi, cb, failCb) => {
      $.ajax({
         url: `${urlBase}/${urlApi}`,
         success: cb,
         error: failCb
      });
   },
   loadProduct: (code) => {
      product.callApi(`products/detail/${code}`, (data) => {
         console.log(data);
         const { brand, category, description, image, images, name, price, productColors, productSizes, shortDescription } = data;
         $('.img-s-1').attr('src', image)
         

         $('#address-category').text(category.name)
         $('#address-name').text(name)
         $('#product-name').text(name)
         $('#span-gia').text(price + 'đ')
         $('#ops-text').text(brand.name)
         $('#head-title').text(`Đặc điểm nổi bật của ${name}`)
         $('#product-description').text(description)
         $('#add-to-cart').data('code', code)
      }, (error) => {
         window.location.href = '/sa'
      })
   },
   initAddToCart: () => {
      $('#add-to-cart').on('click', function () {
         const code = $(this).data('code')
         cart.add(code)
         window.location.href = '/giohang.html'
      })
   },
   initSubmitReview: (code) => {
      $('#btn-submit-review').on('click', () => {
         const us = user.get()
         if (!us || !us.id) {
            alert('Vui lòng đăng nhập trước khi đánh giá')
            return;
         }

         const messEle = $('#mess-review')
         const rating = $('.rating-review .fa').length

         if (!messEle.val()) {
            alert('Vui lòng nhập nội dung để đánh giá')
            return;
         }


         const data = {
            userId: us.id,
            code: code,
            content: messEle.val()

         }

         $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: `${urlBase}/reviews`,
            data: JSON.stringify(data),
            success: (result) => { 
               $('#reviews-content').append(product.rennderReview(result))
               messEle.val('')
            },
            error: function (jqXHR, textStatus, errorThrown) {
               $('#mess-alert').text('Dell biết gì luôn')
            }
         })

      })
   },
   loadReview: (code) => {
      product.callApi(`products/reviews/${code}`, (data) => {
         console.log('asdsa', data);
         $('#reviews-content').append(data.map(product.rennderReview).join(''))
      })
   },
   rennderReview: ({ user: { name: name, image:image }, createdAt, content }) => {
      return `
         <div class="binh-luan mt-5">
            <div class="binh-luan-header d-flex">
               <div class="icon-kh mr-3 d-flex align-items-center">
                  <span style="background-color: #eee">
                     <img src=${image} alt=${name} style="width: 50px; height: 50px; border-radius: 50%; transform: translateY(-18%);"/>
                  </span>
               </div>
               <div class="thong-tin-kh">
                  <p style="color: black;">${name}</p>
                  <p>${formatDate(createdAt)}</p>
               </div>
            </div>
            <div class="my-line mb-0" style="justify-content: start">

            </div>
            <p style="padding-top:5px;">
               ${content}</p>
         </div>
      `
   }
}


$(window).ready(() => {

   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);

   const code = urlParams.get('code')
   console.log(code);

   product.loadProduct(code)
   product.initAddToCart()
   product.initSubmitReview(code)
   product.loadReview(code)

   pLocal.set(code)
})