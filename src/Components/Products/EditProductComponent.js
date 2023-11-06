import {useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import {Card, Input, Button, Row, Col, Form, Typography, Tooltip} from "antd"
import {modifyStateProperty} from "../../Utils/UtilsState"
import {
    QuestionCircleOutlined,
    SaveOutlined,
    SwapLeftOutlined
} from "@ant-design/icons";
import {allowSubmitForm, validateFormDataInputRequired, validatePrice} from "../../Utils/UtilsValidations";

let EditProductComponent = (props) => {
    let {openNotification} = props

    const { id } = useParams();
    let navigate = useNavigate();

    let [formData, setFormData] = useState({})

    let requiredInForm = ["title","description","price"]
    let [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        getProduct(id);
    }, [])

    let getProduct = async (id) => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL+"/products/"+id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            setFormData(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let clickEditProduct = async () => {
        let formDataWithDate = formData
        let now = new Date()
        formDataWithDate.date = now.valueOf()
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL+"/products/"+id,
            {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify(formDataWithDate)
            });

        if ( response.ok ){
            let jsonData = await response.json();
            console.log(formData)
            if (jsonData) {
                navigate("/products/own")
                openNotification("top", "Product saved", "success")
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let clickReturn = () => {
        navigate("/products/own")
    }

    const dateFormat = 'YYYY/MM/DD';
    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh"}}>
            <Col>
                <Card title="Edit product" style={{ width: "500px"}}>

                    <Form.Item label=""
                               validateStatus={
                                   validateFormDataInputRequired(formData, "title", formErrors, setFormErrors) ?
                                       "success" : "error"}>
                        <Input onChange = {
                            (i) => modifyStateProperty(formData, setFormData,"title",i.currentTarget.value) }
                               size="large" type="text" placeholder="product title"
                               value={formData?.title}
                               suffix={
                                   <Tooltip title="product title">
                                       <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                   </Tooltip>
                               }>
                        </Input>
                        {formErrors?.title?.msg &&
                            <Typography.Text type="danger"> {formErrors?.title?.msg} </Typography.Text>}
                     </Form.Item>

                    <Form.Item label=""
                               validateStatus={
                                   validateFormDataInputRequired(formData, "description", formErrors, setFormErrors) ?
                                       "success" : "error"}>
                        <Input allowClear onChange = {
                            (i) => modifyStateProperty(formData, setFormData,"description",i.currentTarget.value) }
                               size="large"  type="text" placeholder="description"
                               value={formData?.description}
                               suffix={
                                   <Tooltip title="product description">
                                       <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                   </Tooltip>
                               }>
                        </Input>
                        {formErrors?.description?.msg &&
                            <Typography.Text type="danger"> {formErrors?.description?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label=""
                               validateStatus={
                                   validatePrice(formData, "price", formErrors, setFormErrors) ?
                                       "success" : "error"}>
                        <Input onChange = {
                            (i) => modifyStateProperty(formData, setFormData,"price",i.currentTarget.value) }
                               size="large"  type="number" placeholder="price (€)"
                               value={formData?.price}
                               suffix={
                                   <Tooltip title="product price (€)">
                                       <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                   </Tooltip>
                               }>
                        </Input>
                        {formErrors?.price?.msg &&
                            <Typography.Text type="danger"> {formErrors?.price?.msg} </Typography.Text>}
                    </Form.Item>

                    <div style={{display: "flex", gap: "1rem"}}>
                        <Button icon={<SwapLeftOutlined />} style={{width: "50%"}} onClick={clickReturn} block >Cancel</Button>
                        { allowSubmitForm(formData,formErrors,requiredInForm) ?
                            <Button type="primary" icon={<SaveOutlined />} onClick={clickEditProduct} block >Save Product</Button>
                            :
                            <Button type="primary" icon={<SaveOutlined />} disabled block >Save Product</Button>
                        }
                    </div>
                </Card>
            </Col>
        </Row>
    )
}

export default EditProductComponent;