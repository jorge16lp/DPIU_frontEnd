import {useState, useEffect} from "react";
import {useParams, useNavigate} from 'react-router-dom';
import {Button, Descriptions} from 'antd';
import {ShoppingCartOutlined} from '@ant-design/icons';
import {timestampToString} from "../../Utils/UtilsDates";

let ConfirmPurchaseComponent = (props) => {
    let {creditCards, setBuying, formData, openNotification} = props
    const {id} = useParams();
    let navigate = useNavigate();

    let [creditCardSelected, setCreditCardSelected] = useState({})

    useEffect(() => {
        getCreditCardSelected()
    }, [])

    let getCreditCardSelected = () => {
        // console.log(creditCards)
        let creditCard = creditCards.filter((c) => {return c.id.toString() === formData.buyerPaymentId})[0]
        // console.log(creditCard)
        setCreditCardSelected(creditCard)
    }

    let buyProduct = async () => {
        localStorage.setItem("lastCreditCardSelected_" + localStorage.getItem("userId"), formData.buyerPaymentId)
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/transactions/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify({
                    productId: id,
                    buyerPaymentId: formData.buyerPaymentId,
                    startDate: formData.datesArray[0],
                    endDate: formData.datesArray[1],
                })
            });

        if (response.ok) {
            let jsonData = await response.json();
            if (jsonData.affectedRows === 1) {
                openNotification("top", "Successful transaction", "success")
                navigate("/products")
            }
        } else {
            openNotification("top", "Something went wrong when buying", "error")
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    return (
        <div style={{display: "flex", flexDirection: "column",}}>
            <Descriptions column={1} title={"Summary"} style={{margin: "2rem 1rem 0rem 1rem"}}>
                <Descriptions.Item label={"Credit Card"}>
                    {creditCardSelected?.alias} ending in ***{creditCardSelected?.number?.toString().substring(3)}
                </Descriptions.Item>
                <Descriptions.Item label={"Date Range"}>
                    {timestampToString(formData.datesArray[0])} to {timestampToString(formData.datesArray[1])}
                </Descriptions.Item>
            </Descriptions>
            <Button type="primary" style={{margin: "2rem"}}
                    onClick={(e) => {
                        buyProduct()
                        setBuying(false)
                    }} icon={<ShoppingCartOutlined />}>
                Confirm purchase
            </Button>
        </div>
    )
}

export default ConfirmPurchaseComponent;