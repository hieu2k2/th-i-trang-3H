import { user } from './user.js'

const header = {
   initHeader: () => {
      const us = user.get()

      if (us && us.name) {
         $('#log-out-lbl').removeClass('d-none')
         $('#name-user').text(us.name)
      } else {
         $('#name-user').text('Đăng nhập')
         $('#log-out-lbl').addClass('d-none')
      }

   },
   initUserDetail: () => {

      const us = user.get()

      if (!us || !us.name) {
         $('#name-user').parent().attr('href', '/login.html')
      } else {
         $('#name-user').parent().attr('href', '/thongtinkhachang.html')
      }
   }
}

$(window).ready(() => {
   header.initHeader()
   header.initUserDetail()
})
