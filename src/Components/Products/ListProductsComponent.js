import {useState, useEffect } from "react";
import { Link } from "react-router-dom"
import {Card, Col, Row, Typography} from 'antd';
import FilterProductsComponent from "./FilterProductsComponent"
import SortProductsComponent from "./SortProductsComponent"
import "../cardHover.css"
import {ShopOutlined, SlidersOutlined, SortAscendingOutlined} from "@ant-design/icons";

let ListProductsComponent = (props) => {
    let {productOptions} = props

    let [products, setProducts] = useState([])

    useEffect(() => {
        getProducts()
        deactivateFilters()
        cleanFilters()
    }, [])

    let deactivateFilters = () => {
        localStorage.setItem("applyCategoryFilter", "no")
        localStorage.setItem("applyTitleFilter", "no")
        localStorage.setItem("applyPriceFilter", "no")
    }

    let cleanFilters = () => {
        localStorage.setItem("categoryFilter", "")
        localStorage.setItem("titleFilter", "")
        localStorage.setItem("priceFilter", "")
    }

    let getProducts = async () => {
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

            let productsWithImage = await Promise.all(promisesForImages)
            productsWithImage = productsWithImage.filter((p) => p.buyerEmail === null && p.buyerName === null)
            // console.log(productsWithImage)
            setProducts(productsWithImage)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let checkURL = async (url) => {
        try {
            let response = await fetch(url);
            // console.log(response.ok)
            return response.ok; // Returns true if the status is in the 200-299 range.
        } catch (error) {
            return false; // URL does not exist or there was an error.
        }
    }

    const {Text} = Typography;

    return (
        <div style={{margin: "2rem"}}>
            <h2><SlidersOutlined /> Filter products</h2>
            <FilterProductsComponent productOptions={productOptions} checkURL={checkURL} setProducts={setProducts}
                                     products={products}/>
            <h2><SortAscendingOutlined /> Sort products</h2>
            <SortProductsComponent checkURL={checkURL} setProducts={setProducts} products={products}/>
            <h2 style={{fontWeight: 800}}><ShopOutlined /> Products ({products.length})</h2>
            <Row gutter={ [16, 16] } style={{margin: "2rem"}}>
                { products.map( p =>
                    <Col span={4} key={p.id}>
                        <Link to={ "/products/"+p.id } >
                            <Card key={p.id} title={(
                                <div>
                                    <h3 style={{fontWeight: 600}}>{p.title.length < 14 ? p.title : p.title.substring(0,14) + "..."}</h3>
                                    <p style={{fontSize: "0.8rem"}}>{p.sellerEmail}</p>
                                </div>
                            )} className={"card"}
                                  cover={<img src= { p.image } />}>
                                <Text underline
                                      style={{fontSize: 20, fontWeight: "bold",
                                          color: "orangered",}}>
                                    {p.price}€
                                </Text>
                            </Card>
                        </Link>
                    </Col>
                )}
                { products.length === 0 && (
                    <Text style={{marginLeft: "0.5rem", fontSize: 20, fontWeight: "bold", color: "gray",}}>
                        There are no products for sale at this time
                    </Text>
                )}
            </Row>
        </div>
    )
}

export default ListProductsComponent;