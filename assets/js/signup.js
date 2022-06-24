let urlBase = "https://website-3h.herokuapp.com/api/v1"

const account = {
   getData: () => {
      const name = $('#txt-name').val()
      const email = $('#txt-email').val()
      const address = $('#txt-address').val()
      const phone = $('#txt-phone').val()
      const username = $('#txt-username').val()
      const password = $('#txt-password').val()
      const passwordConfirm = $('#txt-confirm-password').val()
      const file = document.getElementById('file').files[0]

      if (!name || !email || !address || !phone || !username || !password || !passwordConfirm || !file) {
         alert('Bạn cần nhập đầy đủ thông tin')
         return null
      }

      if (password != passwordConfirm) {
         alert('Mật khẩu và nhập lại mật khẩu không trùng nhau')
         return null
      }


      let fd = new FormData()
      fd.append('name', name)
      fd.append('email', email)
      fd.append('address', address)
      fd.append('phone', phone)
      fd.append('username', username)
      fd.append('password', password)
      fd.append('confirmPassword', passwordConfirm)
      fd.append('file', file)


      return fd
   },
   initSubmit: () => {
      $('#submit').on('click', () => {
         if (confirm('Bạn có chắc chắn muốn đăng ký?')) {
            const data = account.getData()

            if (!data) {
               return
            }

            $.ajax({
               url: `${urlBase}/register`,
               type: 'POST',
               data: data,
               dataType: 'json',
               mimeType: 'multipart/form-data',
               processData: false,
               contentType: false,
               success: function (data, status, jqXHR) {
                  if (status == 'success') {
                     alert('Bạn đã đăng ký thành công')
                     window.location.href = '/login.html'
                  }

               },
               error: function (jqXHR, status, error) {

                  alert(jqXHR.responseJSON.message)
               }
            });
         }
      })
   }
}

$(window).ready(() => {
   account.initSubmit()
})