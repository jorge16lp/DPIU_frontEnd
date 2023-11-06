import {Card, Col, Row, Typography,} from 'antd';
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

let UserProductsComponent = (props) => {
    let {id} = props

    let [products, setProducts] = useState([])

    useEffect(() => {
        getProducts(id)
    }, [])

    let getProducts = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/products?sellerId="+id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json()

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
            console.log(productsWithImage)
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
        <Card style={{margin: "1rem"}}>
            <h2 style={{margin: "1rem 2rem"}}>Products On Sale ({products.length})</h2>
            <Row style={{margin: "1rem 1.5rem"}} gutter={ [16, 16] }>
                { products.map( p =>
                    <Col span={4} key={p.id}>
                        <Link to={ "/products/"+p.id } key={p.id}>
                            <Card key={p.id} title={ p.title }
                                  cover={<img src= { p.image } />} className={"card"}>
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
                        This user has no products for sale
                    </Text>
                )}
            </Row>
        </Card>
    )
}

export default UserProductsComponent;