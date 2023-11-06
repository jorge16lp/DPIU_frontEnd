import {Checkbox, Col, Input, Radio, Row, Slider} from "antd";

let FilterProductsComponent = (props) => {
    let {productOptions, checkURL, setProducts, products} = props

    const { Search } = Input;

    let filteredProducts = []

    let applyFilters = async () => {
        let productsWithImage = [];
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/products",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            let promisesForImages = jsonData.map( async p =>  {
                let urlImage = process.env.REACT_APP_BACKEND_BASE_URL+"/images/"+p.id+".png"
                let existsImage = await checkURL(urlImage);
                if ( existsImage )
                    p.image = urlImage
                else
                    p.image = "/imageMockup.png"
                return p
            })
            productsWithImage = await Promise.all(promisesForImages)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
        productsWithImage.map((p) => {
            if (filtersOK(p))
                filteredProducts.push(p)
        })
        setProducts(filteredProducts)
    }

    let filtersOK = (product) => {
        let priceFilter = localStorage.getItem("priceFilter")?.split(',')
        priceFilter[0] = Number(priceFilter[0])
        priceFilter[1] = Number(priceFilter[1])
        console.log(product)
        if (product.buyerEmail !== null || product.buyerName !== null)
            return false
        if (localStorage.getItem("applyCategoryFilter") === "yes" && product.category !== localStorage.getItem("categoryFilter"))
            return false
        if (localStorage.getItem("applyTitleFilter") === "yes"
            && !product.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .includes(localStorage.getItem("titleFilter").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")))
            return false
        if (localStorage.getItem("applyPriceFilter") === "yes" && (product.price < priceFilter[0] || products.price > priceFilter[1]))
            return false
        return true
    }

    return <Row style={{margin: "2rem"}}>
        <Col span={8}>
            <Checkbox onChange={(i) => {
                if (i.target.checked)
                    localStorage.setItem("applyCategoryFilter", "yes")
                else
                    localStorage.setItem("applyCategoryFilter", "no")
                applyFilters()
                // console.log(localStorage.getItem("applyCategoryFilter"))
            }}>Filter by product category</Checkbox>
            <Radio.Group optionType={"button"}
                         options={productOptions} style={{margin: "0.7rem",}}
                         onChange={(i) => {
                             localStorage.setItem("categoryFilter", i.target.value)
                             console.log(localStorage.getItem("categoryFilter"))
                             if (localStorage.getItem("applyCategoryFilter") === "yes")
                                 applyFilters()
                             // console.log(localStorage.getItem("applyCategoryFilter"))
                         }}
            />
        </Col>
        <Col span={8} style={{ display: "flex", flexDirection: "column"}}>
            <Checkbox onChange={(i) => {
                if (i.target.checked)
                    localStorage.setItem("applyTitleFilter", "yes")
                else
                    localStorage.setItem("applyTitleFilter", "no")
                applyFilters()
            }}>Filter by product title</Checkbox>
            <Search
                placeholder="input search text"
                allowClear
                onChange={(i) => {
                    localStorage.setItem("titleFilter", i.target.value)
                    console.log(localStorage.getItem("titleFilter"))
                    if (localStorage.getItem("applyTitleFilter") === "yes")
                        applyFilters()
                }}
                onSearch={() => {}}
                style={{margin: "0.7rem", maxWidth: "80%"}}
            />
        </Col>
        <Col span={8}>
            <Checkbox onChange={(i) => {
                if (i.target.checked)
                    localStorage.setItem("applyPriceFilter", "yes")
                else
                    localStorage.setItem("applyPriceFilter", "no")
                applyFilters()
            }}>Filter by product price</Checkbox>
            <Slider range defaultValue={[20, 150]}
                    min={0} max={500} style={{margin: "0.7rem"}}
                    onChange={(i) => {
                        localStorage.setItem("priceFilter", i)
                        console.log(localStorage.getItem("priceFilter"))
                        if (localStorage.getItem("applyPriceFilter") === "yes")
                            applyFilters()
                    }}/>
        </Col>
    </Row>

}

export default FilterProductsComponent