import {Typography, Card, Descriptions} from 'antd';
import {timestampToString} from "../../Utils/UtilsDates";

let UserPublicInfoComponent = (props) => {
    let {user} = props

    const {Text} = Typography;

    return (
        <Card style={{margin: "1rem"}}>
            <Text style={{fontSize: 30, fontWeight: "bold", color: "mediumpurple", marginLeft: "1rem",
                display:"flex", flexDirection:"column",}}>{user.email}</Text>
            <Descriptions column={2} style={{margin: "1rem",}}>
                <Descriptions.Item label="User name">
                    {user.name + " " + user.surname}
                </Descriptions.Item>
                <Descriptions.Item label={user.documentIdentity}>
                    {user.documentNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                    {user.country}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                    {user.address}
                </Descriptions.Item>
                <Descriptions.Item label="Postal Code">
                    {user.postalCode}
                </Descriptions.Item>
                <Descriptions.Item label="Birthday">
                    {timestampToString(user.birthday)}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    )
}

export default UserPublicInfoComponent;