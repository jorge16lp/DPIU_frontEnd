import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import {Typography, Row, } from 'antd';
import UserPublicInfoComponent from "./UserPublicInfoComponent";
import UserTransactionsComponent from "./UserTransactionsComponent";
import UserProductsComponent from "./UserProductsComponent";

let DetailsUserComponent = () => {
    const {id} = useParams();
    let [user, setUser] = useState({})

    useEffect(() => {
        getUser(id)
    }, [])

    let getUser = async (id) => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/" + id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if (response.ok) {
            let jsonData = await response.json();
            // console.log(jsonData)
            setUser(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    const {Text} = Typography;

    return (
        <Row style={{display: "flex",flexDirection:"column", margin: "2rem 3rem"}}>
            <UserPublicInfoComponent user={user}/>
            <UserTransactionsComponent id={id}/>
            <UserProductsComponent id={id}/>
        </Row>
    )
}

export default DetailsUserComponent;