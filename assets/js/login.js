import { cart } from './cart.js';
import { user } from './user.js'

const login = {
   initEnter: () => {
      $(".login-form input").keypress(function (e) {
         if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            $('#submit').click();
            return false;
         } else {
            return true;
         }
      });
   },
   initSubmit: () => {
      $('#submit').on('click', () => {
         const us = $('#txtUserName').val()
         const pw = $('#txtPassword').val()

         $('#mess-alert').text('')

         if (!us || !pw) {
            $('#mess-alert').text('Tài khoản hoặc mật khẩu không được để trống')

            return
         }

         $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: `https://website-3h.herokuapp.com/api/v1/auth/signin`,
            data: JSON.stringify({
               username: us,
               password: pw
            }),
            success: (result) => {
               user.set(result)

               window.location.href = 'https://hieu2k2.github.io/3H/'
            },
            error: function (jqXHR, textStatus, errorThrown) {
               $('#mess-alert').text('Tài khoản hoặc mật khẩu không đúng')
            }
         })
      })
   }
}

$(document).ready(() => {
   user.remove()

   login.initEnter()
   login.initSubmit()
})
