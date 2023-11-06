import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState"
import {Card, Input, Button, Row, Col, Form, Upload, Radio, Typography, Tooltip} from "antd"
import {useNavigate} from 'react-router-dom'
import {QuestionCircleOutlined, ShoppingOutlined} from "@ant-design/icons"
import {
    allowSubmitForm,
    validateFormDataInputRequired,
    validatePrice
} from "../../Utils/UtilsValidations"


let CreateProductComponent = (props) => {
    let {productOptions, openNotification} = props
    let navigate = useNavigate();

    let [formData, setFormData] = useState({})

    let requiredInForm = ["title","description","category","price","image"]
    let [formErrors, setFormErrors] = useState({})

    let clickCreateProduct = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify(formData)
            })

        if (response.ok) {
            let data = await response.json()
            await uploadImage(data.productId)
            openNotification("top", "Product successfully put on sale", "success")
            navigate("/products/own")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    let uploadImage = async (productId) => {
        let formDataPhotos = new FormData();
        formDataPhotos.append('image', formData.image);
        formDataPhotos.append('productId', productId);

        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/"+productId+"/image", {
                method: "POST",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
                body: formDataPhotos
            })
        if (response.ok) {

        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }

    }

    return (
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col>
                <Card style={{width: "500px"}}>
                    <Form.Item label=""
                               validateStatus={
                                   validateFormDataInputRequired(formData, "title", formErrors, setFormErrors) ?
                                       "success" : "error"}>
                        <Input onChange={
                            (i) => modifyStateProperty(
                                formData, setFormData, "title", i.currentTarget.value)}
                               size="large" type="text" placeholder="product title"
                               suffix={
                                   <Tooltip title="product title">
                                       <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                   </Tooltip>
                               }></Input>
                        {formErrors?.title?.msg &&
                            <Typography.Text type="danger"> {formErrors?.title?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label=""
                               validateStatus={
                                   validateFormDataInputRequired(formData, "description", formErrors, setFormErrors) ?
                                       "success" : "error"}>
                        <Input onChange={
                            (i) => modifyStateProperty(
                                formData, setFormData, "description", i.currentTarget.value)}
                               size="large" type="text" placeholder="description"
                               suffix={
                                   <Tooltip title="product description">
                                       <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                   </Tooltip>
                               }></Input>
                        {formErrors?.description?.msg &&
                            <Typography.Text type="danger"> {formErrors?.description?.msg} </Typography.Text>}
                    </Form.Item>

                    <Tooltip title="product category">
                        <QuestionCircleOutlined style={{ marginBottom: "0.5rem", fontSize: 20, color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                    <Form.Item label="">
                        <Radio.Group optionType={"button"}
                                options={productOptions}
                                onChange={(i) => {
                                    modifyStateProperty(formData, setFormData,
                                        "category", i.target.value)
                                    console.log(i.target.value)
                                }}
                        />
                    </Form.Item>

                    <Form.Item label=""
                               validateStatus={
                                   validatePrice(formData, "price", formErrors, setFormErrors) ?
                                       "success" : "error"}>
                        <Input onChange={
                            (i) => modifyStateProperty(
                                formData, setFormData, "price", i.currentTarget.value)}
                               size="large" type="number" placeholder="price (€)"
                               suffix={
                                   <Tooltip title="product price (€)">
                                       <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                   </Tooltip>
                               }></Input>
                        {formErrors?.price?.msg &&
                            <Typography.Text type="danger"> {formErrors?.price?.msg} </Typography.Text>}
                    </Form.Item>

                    <Tooltip title="product image">
                        <QuestionCircleOutlined style={{ marginBottom: "0.5rem", fontSize: 20, color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                    <Form.Item name="image">
                        <Upload maxCount={1} action={
                            (file) => modifyStateProperty(
                                formData, setFormData, "image", file)} listType="picture-card">
                            Upload
                        </Upload>
                    </Form.Item>

                    { allowSubmitForm(formData,formErrors,requiredInForm) ?
                        <Button type="primary" block icon={<ShoppingOutlined/>} onClick={clickCreateProduct}>Sell Product</Button>
                        :
                        <Button block icon={<ShoppingOutlined/>} disabled>Sell Product</Button>
                    }
                </Card>
            </Col>
        </Row>
    )
}

export default CreateProductComponent;