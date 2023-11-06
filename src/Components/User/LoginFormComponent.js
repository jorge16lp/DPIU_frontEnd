import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Card, Col, Row, Form, Input, Button, Typography, Tooltip} from "antd";
import {useNavigate} from 'react-router-dom';
import {
    validateFormDataInputRequired,
    validateFormDataInputEmail,
    allowSubmitForm,
    setServerErrors,
    joinAllServerErrorMessages
} from "../../Utils/UtilsValidations"
import {LoginOutlined, QuestionCircleOutlined} from "@ant-design/icons";

let LoginFormComponent = (props) => {
    let {setLogin, openNotification} = props
    let navigate = useNavigate();

    // validación
    let requiredInForm = ["email","password"]
    let [formErrors, setFormErrors] = useState({})

    let [formData, setFormData] = useState({})

    let clickLogin = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/login", {
                method: "POST",
                headers: {"Content-Type": "application/json "},
                body: JSON.stringify(formData)
            })

        if (response.ok) {
            let responseBody = await response.json();
            if (responseBody.apiKey && responseBody.email && responseBody.id) {
                localStorage.setItem("apiKey", responseBody.apiKey)
                localStorage.setItem("email", responseBody.email)
                localStorage.setItem("userId", responseBody.id)
            }
            console.log("ok " + responseBody)
            setLogin(true)
            openNotification("top", "Login successful", "success")
            navigate("/")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;

            setServerErrors(serverErrors,setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top",notificationMsg, "error" )

        }
    }

    return (
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col xs={24} sm={24} md={12} lg={12} xl={10}>
                <Card title="Login" style={{width: "100%", margin: "15px"}}>
                    <Form.Item label=""
                               validateStatus={
                                   validateFormDataInputEmail(
                                       formData, "email", formErrors, setFormErrors) ? "success" : "error"}>
                        <Input placeholder="your email" allowClear
                               suffix={
                                   <Tooltip title="must follow email format (x@x.xx)">
                                       <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                   </Tooltip>
                               }
                               onChange={(i) => {
                                   modifyStateProperty(formData, setFormData,
                                       "email", i.currentTarget.value)
                               }}/>
                        {formErrors?.email?.msg &&
                            <Typography.Text type="danger"> {formErrors?.email?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label=""
                               validateStatus={
                                   validateFormDataInputRequired(
                                       formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                        <Input.Password
                            placeholder="your password"
                            onChange={(i) => {
                                modifyStateProperty(formData, setFormData,
                                    "password", i.currentTarget.value)
                            }}/>
                        {formErrors?.password?.msg &&
                            <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>}
                    </Form.Item>

                    { allowSubmitForm(formData,formErrors,requiredInForm) ?
                        <Button icon={<LoginOutlined/>} type="primary" onClick={clickLogin} block >Login</Button> :
                        <Button icon={<LoginOutlined/>} type="primary" block disabled>Login</Button>
                    }


                </Card>
            </Col>
        </Row>
    )
}

export default LoginFormComponent;