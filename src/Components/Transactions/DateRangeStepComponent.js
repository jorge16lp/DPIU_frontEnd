import {Divider, ConfigProvider, DatePicker, Typography, Tooltip,} from 'antd';
import {modifyStateProperty} from "../../Utils/UtilsState";
import dayjs from "dayjs";
import {QuestionCircleOutlined} from "@ant-design/icons";

let DateRangeStepComponent = (props) => {
    let {formData, setFormData, setDateRangeSelected} = props

    const { RangePicker } = DatePicker;

    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center",}}>
            <ConfigProvider theme={{token: {colorSplit: '#0041b9',},}}>
                <Divider orientation="left">Select the arrival range of the product</Divider>
            </ConfigProvider>
            <Tooltip title="date format" style={{alignSelf: "center"}}>
                <Typography.Text color={"rgba(0,0,0,.45)"}>
                    <QuestionCircleOutlined style={{ marginBottom: "0.5rem", fontSize: 18, color: 'rgba(0,0,0,.45)' }} /> YYYY/MM/DD
                </Typography.Text>
            </Tooltip>
            <RangePicker style={{ alignSelf: "center", width:"20rem" }} disabledDate={disabledDate}
                onChange={(e) => {
                    // console.log(e[0].valueOf())
                    // console.log(e[1].valueOf())
                    let today = new Date()
                    let nextWeek = new Date(today)
                    nextWeek.setDate(today.getDate() + 7)
                    let datesArray = e ? [e[0].valueOf(), e[1].valueOf()] : [today.valueOf(), nextWeek.valueOf()]
                    modifyStateProperty(formData, setFormData,"datesArray", datesArray)
                    setDateRangeSelected(true)
                }}/>
        </div>
    )
}

export default DateRangeStepComponent;