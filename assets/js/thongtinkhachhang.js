let urlBase = "https://website-3h.herokuapp.com/api/v1"
import { product } from './product.js'
import { user } from "./user.js";
import { formatCost, formatDate } from "./utilities.js";
import { cart } from "./cart.js";


const profileRender = {
   renderInfo: () => {
      const us = user.get()
      $('#name-active').text(us.name)
      $('#name').val(us.name)
      $('#phone').val(us.phone)
      $('#email').val(us.email)
      $('#address').val(us.address)
   },
   updateInfo: ()=>{ 
      $('#btn-update-info').on('click', ()=>{
         let us = user.get()
         const nameActiveEle = $('#name-active');
         const nameEle = $('#name');
         const phoneEle = $('#phone');
         const emailEle = $('#email');
         const addressEle = $('#address');

         const name = nameEle.val()
         const phone = phoneEle.val()
         const email = emailEle.val()
         const address = addressEle.val()

         if(!name || !phone || !email || !address){
            alert('Vui lòng nhập đầy đủ thông tin!')
            return
         }
         
         if(confirm('Bạn có muốn cập nhật thông tin?')){
            us = {
               ...us,
               name:name,
               phone:phone,
               email:email,
               address:address
            } 

            $.ajax({
               type: "PUT",
               dataType: "json",
               contentType: "application/json",
               url: `https://website-3h.herokuapp.com/api/v1/accounts`,
               data: JSON.stringify({
                  ...us
               }),
               success: (result) => {
                  nameActiveEle.text(name)
                  user.set(us)  
               },
               error: function (jqXHR, textStatus, errorThrown) { 
                  alert('Cập nhật thông tin không thành công')
               }
            })
            
         }
      })
   },
   renderViewedProduct: async () => {
      const proList = await product.get()
      $('.viewed-products').append(profileRender.renderRow(proList))

   },
   renderRow: (items) => {
      return `
      <div class="px-sm-4 px-3 py-sm-5 py-3 mt-4" style="margin-top: 0px !important;">
         <div class="row">
               ${items.map((it, i) => profileRender.renderItem(it, i)).join('')}
               ${profileRender.renderPagination(items)}
            </div>
         </div>
      `
   },
   renderItem: (item, i) => {
      return `
         <div class="col-md-4 col-6 div-img-hover ${i > 2 ? 'mt-5' : ''} order__all order__${Math.floor(i / 6) + 1} ${Math.floor(i / 6) + 1 == 1 ? '' : 'd-none'}">
            <div>
               <div class="text-center wrap-img-sp" style="height:200px">
                     <img src="${item.image == 'no-image' ? 'Resources/myImages/si1.jpg' : item.image}" class="img-hover" alt="" style="height:185px">
                     <div class="xem-chi-tiet">
                        <a href="chitietsanpham.html?code=${item.code}">Xem chi tiết</a>
                     </div>
                     <span class="product-new-top">Trả góp 0%</span>
               </div>
               <div class="text-center mt-2">
                     <h4 class="pt-1 ten-san-pham">
                        <a href="chitietsanpham.html?code=${item.code}">${item.name}</a>
                     </h4>
                     <div class="mt-2 text-center mb-0">
                        <p class="text-center mx-auto text-danger mb-0">${formatCost(item.price)}
                           <span class="VND badge badge-danger"
                                 style="vertical-align: top; font-size: 10px;">đ
                           </span>
                        </p>
                     </div>
                     <button class="btn-them" data-code='${item.code}'>Thêm vào giỏ</button>
               </div>
            </div>
         </div>
      `
   },
   initAddToCart: () => {
      $('body').on('click', '.btn-them', function () {
         cart.add($(this).data('code'))
         alert('Thêm thành công')
      })
   },
   renderPagination: (items) => {
      const count = items.length
      const countPaginItem = Math.floor((count + 5) / 6)

      const arr = Array.from({ length: countPaginItem - 1 }, i => i)

      $('body').on('click', '.viewed__pagin', function () {
         const order = $(this).data('order');

         [...$('.viewed__pagin')].forEach(item => {
            if (order == $(item).data('orderactive')) {
               $(item).addClass('item-active')
            } else {
               $(item).removeClass('item-active')
            }
         })

         $('.order__all').addClass('d-none')
         $(`.order__${order}`).removeClass('d-none')


      })

      return `
         <div class="my-pagination mt-5 text-center w-100">
            <a href="javascript:void(0)" data-order="1" class="viewed__pagin">&laquo;</a>
            <a href="javascript:void(0)" data-order="1"  data-orderactive="1" class="item-active viewed__pagin">1</a>
            ${arr.map((it, i) => {
         return `<a href="javascript:void(0)" data-order="${i + 2}" data-orderactive="${i + 2}" class="viewed__pagin">${i + 2}</a>`
      }).join('')}
            <a href="javascript:void(0)" data-order="${countPaginItem}" class="viewed__pagin">&raquo;</a>
         </div>
      `
   },
   renderOrder: () => {
      const us = user.get()
      $.ajax({
         url: `${urlBase}/accounts/${us.id}/histories`,
         success: (data) => {

            const itemRender = data.map(({ id, orderAt, orderDetails }) => orderDetails.map(od => ({
               id: id + od.id,
               createAt: formatDate(new Date(orderAt)),
               productName: od.product.name,
               quantity: od.quantity,
               price: od.product.price,
               code: od.product.code
            }))).flat()

            itemRender.forEach(profileRender.renderOrderDetail)
         }
      });
   },
   renderOrderDetail: ({ id, createAt, productName, quantity, price, code }, i) => {
      const table = $('#table-order')
      const row = `
        <tr class="thanh-cong">
            <td>${i + 1} </td>
            <td>${createAt}</td>
            <td><a href="chitietsanpham.html?code=${code}">${productName}</a></td>
            <td>${price}₫ </td>
            <td>Thành công </td>
         </tr>
      `
      table.append(row)
   }
}

$(window).ready(async () => {
   profileRender.renderInfo()
   profileRender.updateInfo()
   profileRender.renderViewedProduct()
   profileRender.renderOrder()
   profileRender.initAddToCart()
})