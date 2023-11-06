import {useState} from "react"
import {modifyStateProperty} from "../../Utils/UtilsState"
import {Card, Input, Button, Row, Col, Form, DatePicker, Typography, Tooltip} from "antd"
import {useNavigate} from 'react-router-dom'
import {dateFormatTemplate, timestampToDate} from "../../Utils/UtilsDates"
import Password from "antd/es/input/Password"
import {
    allowSubmitForm,
    validateCreditCardCode,
    validateCreditCardNumber,
    validateFormDataInputRequired,
} from "../../Utils/UtilsValidations"
import dayjs from "dayjs"
import {PlusCircleOutlined, QuestionCircleOutlined, SwapLeftOutlined} from "@ant-design/icons"

let CreateCreditCardComponent = (props) => {
    let {openNotification} = props

    let [loadingAddition, setLoadingAddition] = useState(false)

    let navigate = useNavigate();

    let requiredInForm = ["alias","number","expirationDate","code"]
    let [formErrors, setFormErrors] = useState({})

    let [formData, setFormData] = useState({

    })

    let clickCreateCreditCard = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/creditCards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify(formData)
            })

        if (response.ok) {
            // let data = await response.json()
            openNotification("top", "Credit Card added", "success")
            navigate("/creditCards/own")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    let clickReturn = () => {
        navigate("/creditCards/own")
    }

    return (
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col>
                <Card style={{width: "500px"}}>
                    <Form.Item label=""
                               validateStatus={
                                   validateFormDataInputRequired(formData, "alias", formErrors, setFormErrors) ?
                                       "success" : "error"}>
                        <Input onChange={
                            (i) => modifyStateProperty(
                                formData, setFormData, "alias", i.currentTarget.value)}
                               size="large" type="text" placeholder="alias"
                               suffix={
                                   <Tooltip title="credit card alias">
                                       <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                   </Tooltip>
                               }></Input>
                        {formErrors?.alias?.msg &&
                            <Typography.Text type="danger"> {formErrors?.alias?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label=""
                               validateStatus={
                                   validateCreditCardNumber(formData, "number", formErrors, setFormErrors) ?
                                       "success" : "error"}>
                        <Input size="large" type="text" placeholder="number"
                               suffix={
                                   <Tooltip title="credit card number">
                                       <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                   </Tooltip>
                               }
                               onChange={(i) => modifyStateProperty(
                                   formData, setFormData, "number", i.currentTarget.value)
                               }></Input>
                        {formErrors?.number?.msg &&
                            <Typography.Text type="danger"> {formErrors?.number?.msg} </Typography.Text>}
                    </Form.Item>

                    <Tooltip title="date format">
                        <Typography.Text color={"rgba(0,0,0,.45)"}>
                            <QuestionCircleOutlined style={{ marginBottom: "0.5rem", fontSize: 18, color: 'rgba(0,0,0,.45)' }} /> YYYY/MM/DD
                        </Typography.Text>
                    </Tooltip>
                    <Form.Item label="">
                        <DatePicker value={ formData.date && timestampToDate(formData.date) }
                                    format={ dateFormatTemplate } placeholder="expiration date"
                                    disabledDate={disabledDate}
                                    onChange={ (inDate, inString) => {
                                        modifyStateProperty(formData, setFormData, "expirationDate", inDate?.valueOf())
                                    }}
                        />
                    </Form.Item>

                    <Form.Item label=""
                               validateStatus={
                                   validateCreditCardCode(formData, "code", formErrors, setFormErrors) ?
                                       "success" : "error"}>
                        <Password onChange={
                            (i) => modifyStateProperty(
                                formData, setFormData, "code", i.currentTarget.value)}
                               size="large" type="text" placeholder="code"></Password>
                        {formErrors?.code?.msg &&
                            <Typography.Text type="danger"> {formErrors?.code?.msg} </Typography.Text>}
                    </Form.Item>

                    <div style={{display: "flex", gap: "1rem"}}>
                        <Button icon={<SwapLeftOutlined />} block style={{width: "50%"}} onClick={clickReturn}>Cancel</Button>
                        { allowSubmitForm(formData,formErrors,requiredInForm) ?
                            <Button type="primary" icon={<PlusCircleOutlined />} block loading={loadingAddition} onClick={(e) => {
                                setLoadingAddition(true)
                                clickCreateCreditCard()
                            }}>Add Credit Card</Button>
                            :
                            <Button icon={<PlusCircleOutlined />} type="primary" block disabled>Add Credit Card</Button>
                        }
                    </div>

                </Card>
            </Col>
        </Row>
    )
}

export default CreateCreditCardComponent;