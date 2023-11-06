import {useState} from "react";
import {Button, Card, Col, Form, Input, Popover, Row, Steps, Tooltip, Typography,} from "antd";
import {useNavigate} from 'react-router-dom';
import OptionalsCreateUserComponent from "./OptionalsCreateUserComponent";
import {
    allowSubmitForm,
    validateFormDataInputEmail, validateFormDataInputRequired,
    validateStringLong
} from "../../Utils/UtilsValidations";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {CheckSquareOutlined, DownSquareOutlined, InfoCircleOutlined, QuestionCircleOutlined} from "@ant-design/icons";

let CreateUserComponent = (props) => {
    let {openNotification} = props
    let navigate = useNavigate();

    let requiredInForm = ["email","password"]
    let [formErrors, setFormErrors] = useState({})

    let [currentStep, setCurrentStep] = useState(0)

    let [formData, setFormData] = useState({
        documentIdentity: "NIF"
    })

    let clickCreate = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/users", {
            method: "POST",
            headers: {"Content-Type": "application/json "},
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            let responseBody = await response.json();
            console.log("ok " + responseBody)
            openNotification("top", "Registration successful", "success")
            navigate("/login")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh"}}>
            <Col xs={24} sm={24} md={18} lg={16} xl={8}>
                <Card title="Signup" style={{ width: "100%", margin: "15px",}}>
                    <Steps current={currentStep} items={[
                        {title: 'Mandatory Fields',content: '',},
                        {title: 'Optional Fields',content: '',},
                    ]}/>
                    { currentStep === 0 && (
                        <div style={{margin: "1rem"}}>
                            <Form.Item label=""
                                       validateStatus={
                                           validateFormDataInputEmail(
                                               formData, "email", formErrors, setFormErrors) ? "success" : "error"}
                            >
                                <Input placeholder="your email" defaultValue={formData.email?formData.email:''}
                                       prefix={<Typography.Text type="danger"> * </Typography.Text>}
                                       suffix={
                                           <Tooltip title="must follow email format (x@x.xx)">
                                               <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                           </Tooltip>
                                       } allowClear
                                       onChange={(i) => {
                                           modifyStateProperty(formData,setFormData,"email",i.currentTarget.value)
                                       }}/>
                                {formErrors?.email?.msg &&
                                    <Typography.Text type="danger"> {formErrors?.email?.msg} </Typography.Text>}
                            </Form.Item>

                            <Form.Item label=""
                                       validateStatus={
                                           validateFormDataInputRequired(
                                               formData, "password", formErrors, setFormErrors) ? "success" : "error"}
                            >
                                <Input.Password defaultValue={formData.password?formData.password:''}
                                    placeholder="your password"
                                    prefix={<Typography.Text type="danger"> * </Typography.Text>}
                                    onChange={(i) => {
                                        modifyStateProperty(formData,setFormData,"password",i.currentTarget.value)
                                    }}/>
                                {formErrors?.password?.msg &&
                                    <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>}
                            </Form.Item>

                            <div style={{display: "flex", gap: "1rem"}}>
                                { allowSubmitForm(formData,formErrors,requiredInForm) ?
                                    <Button icon={<CheckSquareOutlined />} type="primary" onClick={clickCreate} block>Register User</Button>
                                    :
                                    <Popover title="Fill mandatory fields to register a user">
                                        <Button icon={<CheckSquareOutlined />} type="primary" block disabled>Register User</Button>
                                    </Popover>
                                }
                                { allowSubmitForm(formData,formErrors,requiredInForm) ?
                                    <Button onClick={() => setCurrentStep(1)}>Fill Optional</Button>
                                    :
                                    <Popover title="Fill mandatory fields to fill optional ones">
                                        <Button disabled>Fill Optional</Button>
                                    </Popover>
                                }
                            </div>
                        </div>
                    )}
                    { currentStep === 1 && (
                        <div>
                            <OptionalsCreateUserComponent formData={formData} setFormData={setFormData}
                                                      setCurrentStep={setCurrentStep}/>
                            <div style={{display: "flex", gap: "1rem"}}>
                                <Button onClick={()=>setCurrentStep(0)}>Back to mandatory fields</Button>
                                <Button icon={<CheckSquareOutlined />} type="primary" onClick={clickCreate} block>Register User</Button>
                            </div>
                        </div>
                    )}

                </Card>
            </Col>
        </Row>
)
}

export default CreateUserComponent;