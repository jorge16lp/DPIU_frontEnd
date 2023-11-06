import {useState, useEffect } from "react";
import {Table, Space, Typography, Card} from 'antd';
import { Link } from "react-router-dom";
import { timestampToString} from "../../Utils/UtilsDates";

let ListMyTransactionsComponent = () => {
    let [transactions, setTransactions] = useState([])

    useEffect(() => {
        getMyTransactions();
    }, [])

    let getMyTransactions = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL+"/transactions/own/",
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
            console.log(jsonData)
            setTransactions(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    const {Text} = Typography;

    let columns = [
        {
            title: "Sold product",
            dataIndex: [],
            render: (transaction) =>
                <Link to={"/products/"+transaction.productId}>{transaction.title}</Link>,
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "Product description",
            dataIndex: "description",
            render: (desc) => {
                return desc.length > 10 ? desc.substring(0, 11) + "..." : desc
            }
        },
        {
            title: "Product category",
            dataIndex: "category",
            sorter: (a, b) => a.category.localeCompare(b.category),
        },
        {
            title: "Price (€)",
            dataIndex: "productPrice",
            render: (price) =>
                <Text style={{fontSize: 18, fontWeight: 600, color: "black",}}>{price}</Text>,
            sorter: (a, b) => a.productPrice - b.productPrice,
        },
        {
            title: "Date Range",
            dataIndex: [],
            render: (transaction) =>
                <p>
                    {timestampToString(transaction.startDate).split(' ')[0]} to {timestampToString(transaction.endDate).split(' ')[0]}
                </p>,
            sorter: (a, b) => a.buyerEmail.localeCompare(b.buyerEmail),
        },
        {
            title: "Buyer Country",
            dataIndex: "buyerCountry",
            sorter: (a, b) => a.buyerCountry.localeCompare(b.buyerCountry),
        },
        {
            title: "Buyer Address",
            dataIndex: "buyerAddress"
        },
        {
            title: "Buyer post code",
            dataIndex: "buyerPostCode"
        },
        {
            title: "Buyer",
            dataIndex: [],
            render: (transaction) =>
               <Link to={"/users/"+transaction.buyerId}>{ transaction.buyerEmail }</Link>,
            sorter: (a, b) => a.buyerEmail.localeCompare(b.buyerEmail),
        },
        {
            title: "Seller",
            dataIndex: [],
            render: (transaction) =>
                <Link to={"/users/"+transaction.sellerId}>{ transaction.sellerEmail }</Link>,
            sorter: (a, b) => a.sellerEmail.localeCompare(b.sellerEmail),
        },
    ]

    let calculateMoney = () => {
        let money = 0
        transactions.forEach(t => {
            t.buyerEmail === localStorage.getItem("email") ? money -= t.price : money += t.price
        })
        return money
    }

    let countTransactions = () => {
        return transactions.length
    }

    return (
        <div>
            <Card title={"Transactions summary"} style={{margin: "2rem 4rem"}}>
                <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
                    { calculateMoney() >= 0 ?
                        <Text style={{fontSize: 20, fontWeight: "bold", color: "greenyellow",}}>
                            Profits of {calculateMoney()}€
                        </Text>
                        :
                        <Text style={{fontSize: 20, fontWeight: "bold", color: "orangered",}}>
                            Losses  of {calculateMoney()*-1}€
                        </Text>
                    }
                    <Text style={{fontSize: 20, fontWeight: "bold", color: "mediumpurple",}}>
                        Number of transactions {countTransactions()}
                    </Text>
                </div>
            </Card>
            <Table columns={columns} dataSource={transactions} style={{margin: "2rem 4rem"}}></Table>
        </div>
    )
}

export default ListMyTransactionsComponent;