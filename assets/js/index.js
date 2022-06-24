let urlBase = "https://website-3h.herokuapp.com/api/v1"
const clssLatest = ['col-md-5 slideanim my-left-1', 'col-md-5 offset-md-2 slideanim my-left-2', 'col-md-5 slideanim2 my-left-1 mt-4', 'col-md-5 offset-md-2 slideanim1 my-left-2 mt-4']
const clssHot = ['col-md-6 slideanim3', 'col-md-6 slideanim4']
const clssNew = ['style-grid-2-text my-content-denim my-content-denim2', 'style-grid-2-text my-content-denim my-content-denim3', 'style-grid-2-text my-content-denim  my-content-denim3']
const clssFuture = ['col-md-5 sp-smart-watch-grid sp-smart-watch-grid1 slideanim my-left-1', 'col-md-5 offset-md-2 sp-smart-watch-grid sp-smart-watch-grid2 slideanim my-left-2']
const alts = ['alt1', 'alt2', 'alt3', 'alt4']

const product = {
    renderLatestProduct: (cls, src, alt, productName, productPrice, code) => {
        $('.latest-product').append(`
        <div class="${cls}">
            <div class="grid" style="overflow: auto">
                <figure class="effect" style="height: 445px; width: 100%">
                    <img src="${src}" alt="${alt}" class="w-100" style="height: 445px; width:100%">
                    <figcaption></figcaption>
                </figure>
            </div>
            <h4>
                <a href="chitietsanpham.html?code=${code}" class="ten">${productName}</a>
            </h4>
            <h5> ${productPrice} <span class="badge vnd">₫</span></h5>
            <h6><a href="chitietsanpham.html?code=${code}" class="xem-them">Xem thêm</a></h6>
        </div>
    `)
    },
    renderHotProduct: (cls, src, alt, productName, productPrice, code) => {
        $('.hot-product').append(`
            <div class="${cls}" style="padding: 0px 5px; height: 400px">
                <div style="padding: 5px 0px; height: 100%" class="tablet-card">
                    <img src="${src}" alt="${alt}" class="w-100" style="height: 100%">
                    <div class="my-content-denim">
                        <p class="ten">${productName}</p>
                        <p class="noi-dung"></p>
                        <h5>${productPrice}<span class="badge vnd"><sup>đ</sup></span></h5>
                        <a href="chitietsanpham.html?code=${code}" class="xem-them">
                            <span>Xem thêm</span>
                        </a>
                    </div>
                </div>
            </div>
    `)
    },
    parseNewProduct: (cls, src, alt, productName, productPrice, cls2, code) => {
        return `
            <div class="tablet-card" style="padding: 5px 0px; ${cls2}">
                <img src="${src}" alt="${alt}" class="w-100" style="height:100%">
                <div class="${cls}">
                    <p class="ten">${productName}</p>
                    <p class="noi-dung"></p>
                    <h5>${productPrice}<span class="badge vnd"><sup>đ</sup></span></h5>
                    <a href="chitietsanpham.html?code=${code}" class="xem-them">
                        <span>Xem thêm</span>
                    </a>
                </div>
            </div>
        `
    },
    renderNewProduct: ([p1, p2, p3]) => {
        $('.new-product').append(`
            <div class="col-md-6 styl slideanim4" style="padding: 0px 5px; height:600px">
				${product.parseNewProduct(clssNew[0], p1.image, alts[0], p1.name, p1.price, 'height: 100%')}
			</div>
			<div class="col-md-6 slideanim3" style="padding: 0px 5px; height: 600px">
				${product.parseNewProduct(clssNew[1], p2.image, alts[1], p2.name, p2.price, 'height: 50%')}
				${product.parseNewProduct(clssNew[2], p3.image, alts[2], p3.name, p3.price, 'height: 50%')}
			</div>
			<div class="clearfix"></div>
        `)
    },
    renderFutureProduct: (cls, src, alt, productName, productPrice, code) => {
        $('.future-product').append(`
            <div class="${cls}">
                <div class="grid">
                    <figure class="effect" style="height: 445px; width:445px">
                        <img src="${src}" alt="Đồng hồ 1" style="background-color: white; height: 100%"
                            class="w-100">
                        <figcaption></figcaption>
                    </figure>
                </div>
                <h4>
                    <a href="chitietsanpham.html?code=${code}" class="ten">${productName}</a>
                </h4>
                <h5>${productPrice}<span class="badge vnd">₫</span></h5>
                <h6><a href="chitietsanpham.html?code=${code}" class="xem-them">Xem thêm</a></h6>
            </div>
        `)
    }
}

const productsRender = {
    callApi: (urlApi, cb) => {
        $.ajax({
            url: `${urlBase}/${urlApi}`,
            success: cb
        });
    },
    renderLatestProducts: (urlApi) => {
        productsRender.callApi(urlApi, (data) => {
            console.log(data);
            [...data.content.filter(x=>x.state)].slice(0, 4).forEach((item, i) => {

                let { image: src, name: productName, price: productPrice, code } = item
                let cls = clssLatest[i]
                let alt = alts[i]

                product.renderLatestProduct(cls, src, alt, productName, productPrice, code)
            })
        })
    },
    renderHotProducts: (urlApi) => {
        productsRender.callApi(urlApi, (data) => {
            [...data.filter(x=>x.state)].slice(0, 2).forEach((item, i) => {

                let { image: src, name: productName, price: productPrice, code } = item
                let cls = clssHot[i]
                let alt = alts[i]

                product.renderHotProduct(cls, src, alt, productName, productPrice, code)
            })
        })
    },
    renderNewProducts: (urlApi) => {
        productsRender.callApi(urlApi, (data) => {
            console.log(data.content);
            product.renderNewProduct(data.content.filter(x=>x.state));
        })
    },
    renderFutureProducts: (urlApi) => {
        productsRender.callApi(urlApi, (data) => {
            [...data.content.filter(x=>x.state)].slice(0, 2).forEach((item, i) => {

                let { image: src, name: productName, price: productPrice, code } = item
                let cls = clssFuture[i]
                let alt = alts[i]

                product.renderFutureProduct(cls, src, alt, productName, productPrice, code)
            })
        })
    }
}


$(window).ready(() => {
    productsRender.renderLatestProducts('products')
    productsRender.renderHotProducts('products/hot')        // cần đưa api hot product vào param
    productsRender.renderNewProducts('products')        // cần đưa api new product vào param
    productsRender.renderFutureProducts('products')        // cần đưa api new product vào param
})


