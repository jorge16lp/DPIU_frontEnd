import {Typography, Card, Row, Col, Descriptions, Table} from 'antd';
import {Link} from "react-router-dom";
import {timestampToString} from "../../Utils/UtilsDates";
import {useEffect, useState} from "react";

let UserTransactionsComponent = (props) => {
    let {id} = props

    let [transactions, setTransactions] = useState([])

    useEffect(() => {
        getUserTransactions(id)
    }, [])

    let getUserTransactions = async (id) => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL+"/transactions/public?sellerId="+id+"&buyerId="+id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            jsonData.map( t => {
                t.key = t.id
                return t
            })
            // console.log(jsonData)
            setTransactions(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let columns = [
        {
            title: "Sold product",
            dataIndex: [],
            render: (transaction) =>
                <Link to={"/products/"+transaction.productId}>{transaction.title}</Link>
        },
        {
            title: "Product description",
            dataIndex: "description",
            render: (desc) => {
                return desc.length > 30 ? desc.substring(0, 30) + "..." : desc
            }
        },
        {
            title: "Price (€)",
            dataIndex: "productPrice",
        },
        {
            title: "Buyer",
            dataIndex: [],
            render: (transaction) =>
                <Link to={"/users/"+transaction.buyerId}>{ transaction.buyerEmail }</Link>
        },
        {
            title: "Seller",
            dataIndex: [],
            render: (transaction) =>
                <Link to={"/users/"+transaction.sellerId}>{ transaction.sellerEmail }</Link>
        },
    ]

    let calculateMoney = () => {
        let money = 0
        transactions.forEach(t => {
            t.buyerEmail === localStorage.getItem("email") ? money -= t.price : money += t.price
        })
        return money
    }

    let calculateTransactions = () => {
        let buyer = 0
        let seller = 0
        let count = 0
        transactions.forEach(t => {
            t.buyerEmail === localStorage.getItem("email") ? buyer++ : seller++
            count++
        })
        return {buyer: buyer, seller: seller, transactionsCount: count}
    }

    const {Text} = Typography;

    return (
        <Card style={{margin: "1rem"}}>
            <h2 style={{margin: "1rem 2rem"}}>User Transactions</h2>
            <Card style={{margin: "1rem 2rem"}}>
                <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
                    <Text style={{fontSize: 20, fontWeight: "bold", color: "mediumpurple",}}>
                        Number of purchases {calculateTransactions().seller}/{calculateTransactions().transactionsCount}
                    </Text>
                    <Text style={{fontSize: 20, fontWeight: "bold", color: "mediumpurple",}}>
                        Number of sales {calculateTransactions().buyer}/{calculateTransactions().transactionsCount}
                    </Text>
                </div>
            </Card>
            <Table columns={columns} dataSource={transactions} style={{margin: "1rem 2rem"}}></Table>
        </Card>
    )
}

export default UserTransactionsComponent;