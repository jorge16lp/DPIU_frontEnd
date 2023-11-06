import {useState, useEffect} from "react";
import {Button, Divider, ConfigProvider, Select, Modal, Steps} from 'antd';
import {CalendarOutlined, CheckCircleOutlined, CreditCardOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import ConfirmPurchaseComponent from "./ConfirmPurchaseComponent";
import {modifyStateProperty} from "../../Utils/UtilsState";
import ModalFooterComponent from "./ModalFooterComponent";
import DateRangeStepComponent from "./DateRangeStepComponent";
import dayjs from "dayjs";

let BuyProductComponent = (props) => {
    let {product, openNotification} = props

    let [isBuying, setBuying] = useState(false)
    let [currentStep, setCurrentStep] = useState(0)

    let [creditCards, setCreditCards] = useState({})

    let [formData, setFormData] = useState({
        buyerPaymentId: localStorage.getItem("lastCreditCardSelected_" + localStorage.getItem("userId"))
    })

    let [isCreditCardSelected, setCreditCardSelected] = useState(false)
    let [isDateRangeSelected, setDateRangeSelected] = useState(false)

    useEffect(() => {
        chargeCreditCards()
    }, [])

    let chargeCreditCards = async () => {
        await getCreditCards()
    }

    let getCreditCards = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/creditCards",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json()
            // console.log(localStorage.getItem("lastCreditCardSelected_" + localStorage.getItem("userId")))
            const index = jsonData.findIndex(
                (cc) => cc.id.toString() === localStorage.getItem("lastCreditCardSelected_" + localStorage.getItem("userId"))
            )
            if (index !== -1) {
                const selectedCreditCard = jsonData.splice(index, 1)[0]
                jsonData.unshift(selectedCreditCard)
            }
            // console.log(jsonData)
            setCreditCards(jsonData)
        } else {
            let responseBody = await response.json()
            let serverErrors = responseBody.errors
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    return (
        <div>
            <Button type="primary" icon={<ShoppingCartOutlined />} size="large" style={{margin: "1rem"}}
                    onClick={() => {
                        setBuying(true)
                        setCurrentStep(0)
                    }}>
                Buy
            </Button>
            <Modal open={isBuying} title={product.title} onCancel={() => {
                    setBuying(false)
                    setCurrentStep(0)
                }}
                footer={(_, {}) => (
                    <ModalFooterComponent isDateRangeSelected={isDateRangeSelected} isCreditCardSelected={isCreditCardSelected}
                                          setBuying={setBuying} currentStep={currentStep} setCurrentStep={setCurrentStep}/>
                )}>
                <div style={{margin: "1rem", display: "flex", flexDirection: "column"}}>
                    <Steps current={currentStep} items={[
                        {title: <CreditCardOutlined />,content: '',},
                        {title: <CalendarOutlined />,content: '',},
                        {title: <CheckCircleOutlined />,content: '',},
                    ]}/>
                    { currentStep === 0 && (
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <ConfigProvider theme={{token: {colorSplit: '#0041b9',},}}>
                                <Divider orientation="left">Select a credit card to pay</Divider>
                            </ConfigProvider>
                            { creditCards.length > 0 ?
                                <Select showSearch style={{ alignSelf: "center", width:"20rem" }} placeholder="Search to select a credit card"
                                        optionFilterProp="children"
                                        defaultValue={localStorage.getItem("lastCreditCardSelected_" + localStorage.getItem("userId"))}
                                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                        filterSort={(a, b) => (a?.expirationDate) < (b?.expirationDate) ? 1 : -1}
                                        options={creditCards.length > 0 ?
                                            creditCards
                                                .filter(cc => cc.expirationDate > dayjs().endOf('day'))
                                                .map(cc => ({
                                                    value: cc.id.toString(),
                                                    label: cc.alias + " ending in ***" + cc.number.toString().substring(3),
                                                }))
                                            : []
                                        }
                                        onChange={(e) => {
                                            // console.log(e)
                                            // console.log(localStorage.getItem("lastCreditCardSelected_" + localStorage.getItem("userId")))
                                            modifyStateProperty(formData, setFormData,"buyerPaymentId", e)
                                            setCreditCardSelected(true)
                                        }}
                                />
                                :
                                <Select loading showSearch style={{ alignSelf: "center", width:"20rem" }} placeholder="Loading credit cards"
                                        optionFilterProp="children" disabled
                                />
                            }
                        </div>
                    )}
                    { currentStep === 1 && (
                        <DateRangeStepComponent setDateRangeSelected={setDateRangeSelected} formData={formData} setFormData={setFormData}/>
                    )}
                    { currentStep === 2 && (
                        <ConfirmPurchaseComponent creditCards={creditCards} setBuying={setBuying} formData={formData}
                                                  openNotification={openNotification}/>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default BuyProductComponent;