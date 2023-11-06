import {Button,} from 'antd';

let ModalFooterComponent = (props) => {
    let {isCreditCardSelected, isDateRangeSelected, currentStep, setCurrentStep, setBuying} = props

    return (
        <div style={{display: "flex"}}>
            <Button style={{alignSelf: "flex-start"}}
                    onClick={(e) => {
                        setBuying(false)
                        setCurrentStep(0)
                    }}>Cancel</Button>
            { currentStep === 0 && (
                <Button type={"primary"} disabled={!isCreditCardSelected} onClick={() => setCurrentStep(1)}>Next</Button>
            )}
            { currentStep === 1 && (
                <>
                    <Button onClick={() => setCurrentStep(0)}>Previous</Button>
                    <Button type={"primary"} disabled={!isDateRangeSelected} onClick={() => setCurrentStep(2)}>Next</Button>
                </>
            )}
            { currentStep === 2 && (
                <>
                    <Button onClick={() => setCurrentStep(1)}>Previous</Button>
                </>
            )}
        </div>
    )
}

export default ModalFooterComponent;