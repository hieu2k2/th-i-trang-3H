let urlBase = "https://website-3h.herokuapp.com/api/v1"
import { cart } from "./cart.js";
import { formatCost } from './utilities.js'
import { user } from './user.js'

const cartObj = {
   callApi: (urlApi, cb) => {
      $.ajax({
         url: `${urlBase}/${urlApi}`,
         success: cb
      });
   },
   callApiWithData: (urlApi, data, cb) => {
      $.ajax({
         url: `${urlBase}/${urlApi}`,
         data: JSON.stringify(data),
         type: "post",
         contentType: "application/json",
         success: cb
      });
   },
   parseCartItem: ({ image: src, name, brand, description, price, quantity, code }, i) => {
      let defa = 'Resources/myImages/mua-1.png' // tạm thay cho src
      return `
         <div class="wrapper-item-gio-hang card-san-pham card-close-${i}">

      		<div class="content w-100 d-flex p-3 pr-5 row">
      			<div class="col-md-3 text-center">
      				<a href="chitietsanpham.html?code=${code}">
      					<img src="${src != 'no-image' ? src : defa}" width="100%" alt="">
      				</a>
      			</div>

      			<div class="thong-tin col-md-9">

      				<a href="chitietsanpham.html?code=${code}">
      					<h3 class="ten mt-0">${name}</h3>
      				</a>

      				<h4 class="nha-cung-cap mt-3">Cung cấp bởi ${brand ? brand.name : 'không xác định'}</h4>
      				<p class="status lead my-3" style="color: black;">${description}</p>
      				<span class="gia gia-span" style="margin-right:40px;" data-price="${price}" data-for="input1">${formatCost(price)}
      					<span class="badge vnd">đ</span></span>
      				<div class="d-flex row mt-1 contain-count">
      					<div class="so-luong d-flex justify-content-start align-items-center col-md-6">
      						<span style="margin-right:10px;">Số lượng: </span>
      						<div class="so-luong-btn tru btn-minus">-</div>
      						<input class="so-luong-number" value="${quantity}" type="number" readonly maxlength="1000" data-code="${code}" ></input>
      						<div class="so-luong-btn cong btn-plus">+</div>
      					</div>
      					<p class="col-md-6 mt-3 text-md-right" style="text-align: start; margin-bottom:0px;">Nhận hàng
      						trong vòng 3-5 ngày</p>
      				</div>
      			</div>
      		</div>
      		<button class="close close-gio-hang" id="data-close-${i}" data-cls="card-close-${i}" data-close="0" data-code="${code}">
      			<span>X</span>
      		</button>
      	</div>
      `
   },
   updatePrice: () => {
      const prices = $('.gia-span');
      let total = 0;

      [...prices].forEach((item, i) => {
         const price = $(item).data('price')
         const count = $(item).siblings('.contain-count').find('.so-luong-number').val()

         total += price * count
      })

      $('#total').text(formatCost(total) + 'đ')
      $('#total-sub').text(formatCost(total) + 'đ')
   },
   addEmptyCart: () => {
      $('#cart-items').append(`
         <div class="row w-100 text-center">
            <img class="mx-auto" style="height: 200px" src="./../../Resources/myImages/cart_empty.png">
         </div>
      `)
   },
   renderCart: () => {
      const cartItems = cart.get()
      if (cart.isEmpty()) {
         cartObj.addEmptyCart()
         return
      }

      cartObj.callApi('products?size=1000', ({ content: allProducts }) => {
         let productCartItems = allProducts.map((item) => {
            const cartItemSelected = cartItems.find((ci) => item.code == ci.code)

            if (cartItemSelected) {
               item.quantity = cartItemSelected.quantity
            }

            return item
         }).filter((item) => item.quantity);


         productCartItems.forEach((item, i) => {
            $('#cart-items').append(cartObj.parseCartItem(item, i))
         })

         cartObj.updatePrice();
      })
   },
   initMinus: () => {
      $('body').on('click', '.btn-minus', function () {
         const inputEle = $(this).parent().children('.so-luong-number')
         let inputVal = inputEle.val()
         const code = inputEle.data('code')

         if (inputVal > 1) {
            inputEle.val(inputVal * 1.0 - 1)
            cart.add(code, -1)

            cartObj.updatePrice();
         }
      })
   },
   initPlus: () => {
      $('body').on('click', '.btn-plus', function () {
         const inputEle = $(this).parent().children('.so-luong-number')
         let inputVal = inputEle.val()
         const code = inputEle.data('code')

         inputEle.val(inputVal * 1.0 + 1)
         cart.add(code, 1)

         cartObj.updatePrice();

      })
   },
   initRemove: () => {
      $('body').on('click', '.close-gio-hang', function () {
         const btnEle = $(this)
         let code = btnEle.data('code')
         let id = btnEle.attr('id')
         let cls = btnEle.data('cls')

         $(`.${cls}`).remove();
         cart.remove(code)

         if (cart.isEmpty()) {
            cartObj.addEmptyCart()
         }

         cartObj.updatePrice();
      })
   },
   initInfoWithLogin: () => {
      const us = user.get()

      if (!us || !us.name) {
         return
      }

      $('#name').val(us.name)
      $('#phone').val(us.phone)
      $('#address').val(us.address)
      $('#email').val(us.email)
   },
   initCheckout: () => {
      $('#dat-hang-submit').on('click', () => {
         if (!user.isAuthorized()) {
            alert('Bạn vui lòng đăng nhập trước khi đặt hàng')

            window.locatvion.href = '/login.html'
            return
         }

         if (user.get().role.code == 'admin') {
            alert('Bạn không thể đặt hàng!')
            return
         }

         if (cartObj.checkOk()) {
            if (!confirm('Bạn có chắc đặt hàng?')) {
               return
            }

            const cartItemList = cart.get()

            const ca = {
               name: $('#name').val(),
               email: $('#email').val(),
               phone: $('#phone').val(),
               address: $('#address').val(),
               userId: user.get().id,
               cart: cartItemList.map(({ code, quantity }) => {
                  return {
                     code: code,
                     quantity: quantity
                  }
               })
            };


            cartObj.callApiWithData('orders/checkouts', ca, (result) => {
               if (result && result.id) {
                  alert('Đặt hàng thành công');

                  [...$('.close-gio-hang.close')].forEach((item) => {
                     item.click()
                  })

               }
            })
         }
      })
   },
   checkOk: () => {
      if (cart.isEmpty()) {
         alert('Không có sản phẩm nào hết!')
         return false
      }

      const nameEle = $('#name')
      const phoneEle = $('#phone')
      const addressEle = $('#address')
      const emailEle = $('#email')
      let isOk = true

      if (!nameEle.val()) {
         nameEle.addClass('validate-input')
         isOk = false
      }

      if (!phoneEle.val()) {
         phoneEle.addClass('validate-input')
         isOk = false
      }

      if (!addressEle.val()) {
         addressEle.addClass('validate-input')
         isOk = false
      }

      if (!emailEle.val()) {
         emailEle.addClass('validate-input')
         isOk = false
      }

      if (!isOk) {
         alert('Bạn cần điền đầy đủ thông tin')
      }

      return isOk
   }
}


$(window).ready(() => {
   cartObj.renderCart()
   cartObj.initMinus()
   cartObj.initPlus()
   cartObj.initRemove()
   cartObj.initInfoWithLogin()
   cartObj.initCheckout()
})