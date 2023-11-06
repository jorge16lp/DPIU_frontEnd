import {Col, Row, Card, Typography} from "antd";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import './cardHover.css';
import {HomeOutlined} from "@ant-design/icons";

let HomeComponent = (props) => {
    let {productCategories} = props

    let [products, setProducts] = useState([])

    useEffect(() => {
        getProducts()
    }, [])

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
            console.log(jsonData)
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
        <div>
            <Row align="top" justify="center" style={{marginTop: "5vh"}}>
                <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                    <Card>
                        <h1><HomeOutlined /> Wallapep</h1>
                        <p>
                            At Wallapep, we've created a vibrant online community where you can discover
                            a wide array of items, from electronics and fashion to furniture and collectibles,
                            all within a few clicks.
                        </p>
                        <p>
                            Your neighborhood's marketplace is now at your fingertips. Welcome to Wallapep!
                        </p>
                    </Card>
                </Col>
            </Row>
            <h1 style={{marginTop: "5vh", textAlign: "center"}}>Products</h1>
            <Row align="top" justify="center" style={{marginTop: "5vh"}}>
                { productCategories.map( c =>
                    <Col xs={24} sm={24} md={22} lg={22} xl={22} key={c.value}>
                        <Card title={c.label} key={c.value}>
                            <Row gutter={ [16, 16] }>
                                { products.map( p => c.value === p.category ?
                                        <Col span={4} key={p.id}>
                                            <Link to={ "/products/"+p.id } key={p.id}>
                                                <Card key={p.id} title={ p.title } className={"card"}
                                                      cover={<img src= { p.image } />}>
                                                    <Text underline
                                                          style={{fontSize: 20, fontWeight: "bold",
                                                              color: "orangered",}}>
                                                        {p.price}€
                                                    </Text>
                                                </Card>
                                            </Link>
                                        </Col> :
                                        <></>
                                )}
                            </Row>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    )
}
export default HomeComponent;