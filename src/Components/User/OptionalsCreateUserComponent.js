import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Form, Input, Radio, Select, DatePicker, Typography, Button, Popover, Tooltip,} from "antd";
import {dateFormatTemplate, timestampToDate, timestampToString} from "../../Utils/UtilsDates";
import {
    allowSubmitForm,
    validateDocumentNumberFormat, validatePostalCodeFormat
} from "../../Utils/UtilsValidations";
import {QuestionCircleOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

let OptionalsCreateUserComponent = (props) => {
    let {formData, setFormData} = props

    let [formErrors, setFormErrors] = useState({})

    const countryOptions = [
        {value: 'Australia',label: 'Australia',},
        {value: 'Brazil',label: 'Brazil',},
        {value: 'Canada',label: 'Canada',},
        {value: 'China',label: 'China',},
        {value: 'England',label: 'England',},
        {value: 'France',label: 'France',},
        {value: 'Germany',label: 'Germany',},
        {value: 'India',label: 'India',},
        {value: 'Italy',label: 'Italy',},
        {value: 'Japan',label: 'Japan',},
        {value: 'Spain',label: 'Spain',},
        {value: 'Sweden',label: 'Sweden',},
        {value: 'USA',label: 'USA',},
    ]
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const docIdentityOptions = [
        {label: 'NIF',value: 'NIF',},
        {label: 'Passport',value: 'Passport',},
    ];

    let [docId, setDocId] = useState("NIF")

    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day');
    }

    return (
        <div style={{margin: "1rem"}}>
            <Form.Item label="">
                <Input placeholder="your name" defaultValue={formData.name?formData.name:''} allowClear
                       suffix={
                           <Tooltip title="name">
                               <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                           </Tooltip>
                       }
                       onChange={(i) => {
                           modifyStateProperty(formData, setFormData,"name", i.currentTarget.value)
                       }}/>
            </Form.Item>

            <Form.Item label="">
                <Input placeholder="your surname" defaultValue={formData.surname?formData.surname:''} allowClear
                       suffix={
                           <Tooltip title="surname">
                               <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                           </Tooltip>
                       }
                       onChange={(i) => {
                           modifyStateProperty(formData, setFormData,"surname", i.currentTarget.value)
                       }}/>
            </Form.Item>

            <Tooltip title="document identity">
                <QuestionCircleOutlined style={{ marginBottom: "0.5rem", fontSize: 20, color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
            <Form.Item label="">
                <Radio.Group defaultValue="NIF" options={docIdentityOptions} optionType={"button"} value={docId}
                             onChange={(i) => {
                                 setDocId(i.target.value)
                                 modifyStateProperty(formData, setFormData,"documentIdentity", i.target.value)
                             }}>
                </Radio.Group>
                <Radio.Group style={{ display: "none"}}></Radio.Group>
            </Form.Item>

            <Form.Item label=""
                       validateStatus={
                           validateDocumentNumberFormat(docId, formData, "documentNumber", formErrors, setFormErrors) ?
                               "success" : "error"}>
                <Input placeholder={"your " + docId + " number"} allowClear
                       suffix={
                           <Tooltip title={docId+" number"}>
                               <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                           </Tooltip>
                       }
                       onChange={(i) => {
                           modifyStateProperty(formData, setFormData,"documentNumber", i.currentTarget.value)
                       }}/>
                { formData.documentNumber !== "" && formErrors?.documentNumber?.msg &&
                    <Typography.Text type="danger"> {formErrors?.documentNumber?.msg} </Typography.Text> }
            </Form.Item>

            <Form.Item label="">
                <Select showSearch placeholder="select a country" optionFilterProp="children"
                        filterOption={filterOption} options={countryOptions}
                        defaultValue={formData.country?formData.country:'select a country'}
                        onChange={(i) => {
                            modifyStateProperty(formData, setFormData,"country", i)
                        }}
                />
            </Form.Item>

            <Form.Item label="">
                <Input placeholder="your address" defaultValue={formData.address?formData.address:''} allowClear
                       suffix={
                           <Tooltip title="address">
                               <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                           </Tooltip>
                       }
                       onChange={(i) => {
                           modifyStateProperty(formData, setFormData,"address", i.currentTarget.value)
                       }}/>
            </Form.Item>

            <Form.Item label=""
                       validateStatus={
                           validatePostalCodeFormat(formData, "postalCode", formErrors, setFormErrors) ?
                               "success" : "error"}>
                <Input placeholder="your postal code" allowClear
                       suffix={
                           <Tooltip title="postal code">
                               <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                           </Tooltip>
                       }
                       onChange={(i) => {
                           modifyStateProperty(formData, setFormData,
                               "postalCode", i.currentTarget.value)
                       }}/>
                {formErrors?.postalCode?.msg &&
                    <Typography.Text type="danger"> {formErrors?.postalCode?.msg} </Typography.Text>}
            </Form.Item>

            <Tooltip title="date format">
                <Typography.Text color={"rgba(0,0,0,.45)"}>
                    <QuestionCircleOutlined style={{ marginBottom: "0.5rem", fontSize: 18, color: 'rgba(0,0,0,.45)' }} /> YYYY/MM/DD
                </Typography.Text>
            </Tooltip>
            <Form.Item label="">
                <DatePicker value={ formData.date && timestampToDate(formData.date) } disabledDate={disabledDate}
                            format={ dateFormatTemplate } placeholder={"birthday date"}
                            onChange={ (inDate, inString) => {
                                modifyStateProperty(formData, setFormData, "birthday", inDate?.valueOf())
                            } }
                />
            </Form.Item>
        </div>
    )
}

export default OptionalsCreateUserComponent;