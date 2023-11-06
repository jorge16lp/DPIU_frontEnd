import {Col, Radio, Row} from "antd";

let SortProductsComponent = (props) => {
    let {checkURL, setProducts, products} = props

    let sortedProducts = []

    let applySort = async (sortType) => {
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
            productsWithImage = productsWithImage.filter((p) => p.buyerEmail === null && p.buyerName === null)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }

        if (sortType !== "no") {
            sortType === "price" ?
                sortedProducts = productsWithImage.sort((a, b) => {
                    return a.price > b.price ? 1 : -1
                })
                :
                sortedProducts = productsWithImage.sort((a, b) => {
                    return a.date < b.date ? -1 : 1
                })
            setProducts(sortedProducts)
        } else
            setProducts(productsWithImage)
    }

    return  <Row style={{margin: "2rem"}}>
                <Col>
                    <Radio.Group defaultValue="no" optionType={"button"}
                        onChange={(i) => {
                            console.log(i.target.value)
                            applySort(i.target.value)
                        }}>
                        <Radio.Button value="no">No sort</Radio.Button>
                        <Radio.Button value="price">By price</Radio.Button>
                        <Radio.Button value="date">By date</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>

}

export default SortProductsComponent