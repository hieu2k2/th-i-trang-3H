$(document).ready(() => {
    // Tạo resposive cho navigation
    $('#btn-toggle').click(() => {
        if ($('#my-navs').hasClass('my-responsive')) {
            $('#my-navs').removeClass('my-responsive');
            $('#my-navs').addClass("my-nav-temp");
        }
        else {
            $('#my-navs').addClass('my-responsive');
            $('#my-navs').removeClass("my-nav-temp");
        }
    });

    // bắt sự kiện của windows để tạo hiệu ứng
    $(window).scroll(function () {
        $('slideanim').each(function () {
            var pos = $(this).offset().top;

            var winTop = $(window).scrollTop();
            if (pos < wintop) {
                $(this).addClass("slide");
            }

        });
    });

    var date = new Date();
    $(".my-show-chat2").text(date.getMinutes() + ":" + date.getHours() + ", " + date.getDate() + " Tháng " + (date.getMonth() + 1) + ", " + date.getFullYear());
    // tạo sự kiện nhấn show và hiden cho icon message
    $('.message-icon').click(() => {
        $('.message-dialog').slideDown();
        $('.message-dialog').addClass('when-show');

    })
    $('.message-minimize').click(() => {
        $('.message-dialog').slideUp();
        $('.message-dialog').removeClass('when-show');
    })



})





$(window).scroll(function () {

    // Đến một vị trí nhất định mới show ra icon lên đầu trang
    let scrolly = $(window).scrollTop();
    if (scrolly > 300) {
        $('.len-dau-trang').removeClass('dau-trang-hiden');
    }
    else {
        $('.len-dau-trang').addClass('dau-trang-hiden');
    }

    // tạo hiệu ứng scroll windows
    $('.slideanim').each(function () {
        var pos = $(this).offset().top;

        var winTop = $(window).scrollTop();
        if (pos < winTop + 650) {
            $(this).addClass("slide");
        }
        else {
            $(this).remove("slide");
        }

    });

    $('.slideanim1').each(function () {
        var pos = $(this).offset().top;

        var winTop = $(window).scrollTop();
        if (pos < winTop + 650) {
            $(this).addClass("slide1");
        }
        else {
            $(this).remove("slide1");
        }

    });

    $('.slideanim2').each(function () {
        var pos = $(this).offset().top;

        var winTop = $(window).scrollTop();
        if (pos < winTop + 650) {
            $(this).addClass("slide2");
        }
        else {
            $(this).remove("slide2");
        }

    });

    $('.slideanim3').each(function () {
        var pos = $(this).offset().top;

        var winTop = $(window).scrollTop();
        if (pos < winTop + 650) {
            $(this).addClass("slide3");
        }
        else {
            $(this).remove("slide3");
        }

    });

    $('.slideanim4').each(function () {
        var pos = $(this).offset().top;

        var winTop = $(window).scrollTop();
        if (pos < winTop + 650) {
            $(this).addClass("slide4");
        }
        else {
            $(this).remove("slide4");
        }

    });


});

//******************************************** */
// Sản phẩm
function ShowSanPham(btn) {
    var textList = btn.getAttribute("data-text");
    $("#" + textList).slideToggle(400);

}


//******************************************** */
// Giỏ hàng
$(document).ready(() => {

    $('#voucher-check').click(() => {
        $('#voucher-text').slideToggle(500);
    })

    for (let i = 1; i < 20; i++) {
        $(`#data-close-${i}`).click(() => {
            $(`.card-close-${i}`).slideUp(500);
        })
    }

    var so = 0;
    $(document).ready(function () {
        $(".tru").click(function () {
            so = parseInt($("#" + $(this).attr("data-for")).val()) - 1;
            if (so <= 0) {
                $("#" + $(this).attr("data-for")).val(1);
            } else {
                $("#" + $(this).attr("data-for")).val(so);
            }
            TinhLaiTien();
        })
        $(".cong").click(function () {
            so = parseInt($("#" + $(this).attr("data-for")).val()) + 1;
            if (so > parseInt($("#" + $(this).attr("data-for")).attr("data-max"))) {
                $("#" + $(this).attr("data-for")).val(so - 1 + "");
            } else {
                $("#" + $(this).attr("data-for")).val(so + "");
            }
            TinhLaiTien();
        })
    })

    function TinhLaiTien() {
        var total = 0;
        var dem = 1;
        $(".gia-span").each(function () {
            var donGia = parseInt($(this).attr("data-gia"));
            var soLuong = parseInt($("#" + $(this).attr("data-for")).val());
            var check = $("#data-close-" + dem).attr("data-close");

            if (check == 0)
                total += donGia * soLuong;

            dem++;
        })

        $("#total").text(ChuanHoaStringToTien(total.toString()) + " đ");
        $("#total-del").text(ChuanHoaStringToTien((total * 0.1).toString()) + " đ");
        $("#total-sub").text(ChuanHoaStringToTien((total * 0.9).toString()) + " đ");

    }

    function ChuanHoaStringToTien(s) {
        var result = [];
        while (s.length > 3) {
            var temp = s.substr(s.length - 3, 3);
            result.unshift(temp);
            s = s.substring(0, s.length - 3);
        }
        result.unshift(s);

        return result.join(".");
    }

    // close trừ tiền ra == aodshnasjdnasndansdanskdnansdajsd
    $(".close-gio-hang").click(function () {
        $(this).attr("data-close", "1");
        TinhLaiTien();
    })

    $(".so-luong-number").change(function () {
        var text = $(this).val();
        var maxSo = parseInt($(this).attr("data-max"));

        if (text == "" || isNaN(text)) {
            $(this).val("1");
        }
        if (parseInt(text) > maxSo) {
            $(this).val(maxSo);
        }

        TinhLaiTien();
    });

    $(".validate-input-dat-hang").on("focus", function () {
        $(this).removeClass("validate-input");
    })

    $(".validate-input-dat-hang").on("blur", function () {
        var text = $(this).val().trim();
        if (text == null || text == "") {
            var pl = $(this).attr("data-meta");
            $(this).attr("placeholder", pl + " không được bỏ trống...")
            $(this).addClass("validate-input");
        }
    })

    $("#dat-hang").click(function () {
        var check = true;
        $(".validate-input-dat-hang").each(function () {
            var text = $(this).val().trim();
            if (text == "" || text == null) {
                $(this).addClass("validate-input");
                check = false;
            }
        })
        var total = $("#total-sub").text();
        total = total.split(" ")[0];

        if (check) {
            alert("Bạn đã đặt hàng thành công!\nSố tiền bạn phải thanh toán là " + total + " VNĐ");
        } else {
            if ($(".dat-hang #name").val().trim() == "")
                $(".dat-hang #name").addClass("validate-input");
            if ($(".dat-hang #phone").val().trim() == "")
                $(".dat-hang #phone").addClass("validate-input");
            if ($(".dat-hang #address").val().trim() == "")
                $(".dat-hang #address").addClass("validate-input");
            alert("Vui lòng nhập đầy đủ thông tin.");
        }
    })
})


//******************************************** */

// khách hàng

$(document).ready(() => {
    $('.btn-submit').click(() => {
        $('.my-modal').slideDown(400);
    })

    $('.modal-close').click(() => {
        $('.my-modal').slideUp(400);
    })

    $(".them-dia-chi-card").slideUp();
    $('#btn-them').click(() => {
        $(".them-dia-chi-card").slideDown(500);
    });
    $('#btn-them-back').click(() => {
        $(".them-dia-chi-card").slideDown(500);
    });

    $('#close-them-dia-chi').click(() => {
        $(".them-dia-chi-card").slideUp();
    })

    $(".btn-them").click(() => {
        $(".my-modal").slideDown(400);
    })
    $(".btn-them-back").click(() => {
        $(".my-modal").slideDown(400);
    })
})

// $(document).ready(function () {
//     var sOld = 1;
//     var sNew = 1;
//     $("#as1").addClass("active-section");
//     $(window).scroll(function () {
//         var top = $(this).scrollTop();

//         // if(sOld != sNew) { đổi màu }

//         // s1
//         if (top < 740 - 100) {
//             sNew = 1;
//         }
//         // s2
//         else if (top < 2399 - 300) {
//             sNew = 2;
//         }
//         // s3
//         else if (top < 3350 - 300) {
//             sNew = 3;
//         }
//         // s4
//         else if (top < 4200 - 300) {
//             sNew = 4;
//         }
//         // s5
//         else {
//             sNew = 5;
//         }
//         if (sNew != sOld) {
//             sOld = sNew;
//             for (var j = 1; j <= 5; j++) {
//                 $("#as" + j).removeClass("active-section");
//             }
//             $("#as" + sNew).addClass("active-section");
//         }
//     })
// })

//******************************************** */

// Giói thiệu
$(document).ready(function () {
    $(".team-click").click(function () {
        var secFor = $(this).attr("data-for");
        $(".text-sec").removeClass("cau-noi-active");
        $("#" + secFor).addClass("cau-noi-active");

    })
})


//******************************************** */
//******************************************** */