import {Button, Card, Col, Row, Dropdown, Descriptions, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {timestampToString} from "../../Utils/UtilsDates";
import {
    DeleteOutlined,
    InfoCircleOutlined,
    PlusCircleOutlined,
    QuestionCircleOutlined,
    UserOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

let ListMyCreditCardsComponent = (props) => {
    let {openNotification} = props

    let [creditCards, setCreditCards] = useState([])
    let [loading, setLoading] = useState([true])

    let navigate = useNavigate();

    useEffect(() => {
        getCreditCards()
    }, [])

    let getCreditCards = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/creditCards",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            // console.log(jsonData)
            setCreditCards(jsonData)
            setLoading(false)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let deleteCreditCard = async (creditCardID) => {
        // console.log(localStorage.getItem("apiKey"))
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/creditCards/"+creditCardID,
            {
                method: "DELETE",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            // console.log("deleted",jsonData)
            if (jsonData.affectedRows === 1) {
                let creditCardsAfterDelete = creditCards.filter(cc => cc.id !== creditCardID)
                // console.log(creditCardsAfterDelete)
                openNotification("top", "Credit Card deleted", "success")
                setCreditCards(creditCardsAfterDelete)
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    return  (
        <div style={{padding: "5rem", display: "flex", flexDirection: "column"}}>
            <Button icon={<PlusCircleOutlined />} type={"primary"} onClick={(e) => {
                navigate("/creditCards/create")
            }} style={{marginBottom: "0.5rem", width: "20rem", alignSelf: "center"}}>Add Credit Card</Button>
            {
                loading ?
                    <Card loading>
                        Submit
                    </Card>
                    :
                    <></>
            }
            <Row>
                { creditCards.map( c =>
                    c.expirationDate > dayjs().endOf('day') ?
                        <Col span={12}>
                            <Card style={{margin: "0.5rem", border: "0.1rem solid #cbcbcb"}} key={c.id}>
                                <Descriptions column={2} title={c.alias} style={{marginLeft: "1rem"}}>
                                    <Descriptions.Item label="Number">
                                        {c.number}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="">
                                        <Tooltip title={"your CVV code is: " + c.code}>
                                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /> Consult CVV code
                                        </Tooltip>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Expiration date">
                                        {timestampToString(c.expirationDate)}
                                    </Descriptions.Item>
                                </Descriptions>
                                <Button icon={<DeleteOutlined />} style={{marginLeft: "1rem"}}
                                    onClick={(e) => {
                                        deleteCreditCard(c.id)
                                    }}>
                                </Button>
                            </Card>
                        </Col>
                        :
                        <Col span={12}>
                            <Tooltip title="Credit Card expirated">
                                <Card style={{margin: "0.5rem", border: "0.1rem solid #de3c4f"}} key={c.id}>
                                    <Descriptions column={2} title={c.alias} style={{marginLeft: "1rem"}}>
                                        <Descriptions.Item label="Number">
                                            {c.number}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="">
                                            <Tooltip title={"your CVV code is: " + c.code}>
                                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /> Consult CVV code
                                            </Tooltip>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Expiration date">
                                            {timestampToString(c.expirationDate)}
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Button icon={<DeleteOutlined />} style={{marginLeft: "1rem"}}
                                            onClick={(e) => {
                                                deleteCreditCard(c.id)
                                            }}>
                                    </Button>
                                </Card>
                            </Tooltip>
                        </Col>
                )}
            </Row>
            {
                creditCards.length > 6 ?
                    <Button icon={<PlusCircleOutlined />} type={"primary"} onClick={(e) => {
                        navigate("/creditCards/create")
                    }} style={{marginBottom: "0.5rem", width: "20rem", alignSelf: "center"}}>Add Credit Card</Button>
                    :
                    <></>
            }
        </div>
    )
}

export default ListMyCreditCardsComponent