import {useState, useEffect} from "react";
import {Link, useParams} from 'react-router-dom';
import {Typography, Card, Descriptions, Image, Row, Col} from 'antd';
import BuyProductComponent from "../Transactions/BuyProductComponent";
import {ArrowRightOutlined, UserOutlined} from "@ant-design/icons";

let DetailsProductComponent = (props) => {
    let {openNotification} = props
    const {id} = useParams();
    let [product, setProduct] = useState({})

    useEffect(() => {
        getProduct(id)
    }, [])

    let getProduct = async (id) => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if (response.ok) {
            let jsonData = await response.json();

            let urlImage = process.env.REACT_APP_BACKEND_BASE_URL+"/images/"+jsonData.id+".png"
            let existsImage = await checkURL(urlImage);
            if ( existsImage )
                jsonData.image = urlImage
            else
                jsonData.image = "/imageMockup.png"

            setProduct(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
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
    let labelProductPrice = " No-Oferta"
    if (product.price < 200) {
        labelProductPrice = " Oferta"
    }
    return (
        <Card style={{margin: "2rem 4rem"}}>
            <Row>
                <Col span={12}>
                    <Image src={product.image}/>
                </Col>
                <Col span={12} style={{padding: "1rem", display: "flex", flexDirection: "column"}}>
                    <Descriptions column={1} title={product.title} style={{margin: "1rem"}}>
                        <Descriptions.Item label="Description">
                            {product.description}
                        </Descriptions.Item>
                        <Descriptions.Item label={"Seller"}>
                            <Link to={"/users/"+product.sellerId}><UserOutlined /> {product.sellerEmail}</Link>
                        </Descriptions.Item>
                    </Descriptions>
                    <Text underline style={{fontSize: 20, fontWeight: "bold", color: "orangered", marginLeft: "1.5rem"}}>{product.price}€</Text>
                    <p style={{marginLeft: "1rem"}}>{labelProductPrice}</p>
                    { product.buyerId === null ?
                        <BuyProductComponent product={product} openNotification={openNotification}/>
                        :
                        <label style={{borderTop: "0.1rem solid gray", textAlign: "center", paddingTop: "0.3rem"}}>SOLD</label>
                    }
                </Col>
            </Row>
        </Card>
    )
}

export default DetailsProductComponent;