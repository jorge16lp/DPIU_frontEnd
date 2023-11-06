import {useState, useEffect } from "react";
import {Table, Space, Typography, Card} from 'antd';
import { Link } from "react-router-dom";
import {timestampToDate, timestampToString} from "../../Utils/UtilsDates";
import {DeleteOutlined, EditOutlined, UserOutlined} from "@ant-design/icons";

let ListMyProductsComponent = (props) => {
    let {openNotification} = props

    let [products, setProducts] = useState([])

    useEffect(() => {
        getMyProducts();
    }, [])

    let deleteProduct = async (id) => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL+"/products/"+id,
            {
                method: "DELETE",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            if ( jsonData.deleted){
                let productsAfterDelete = products.filter(p => p.id !== id)
                openNotification("top", "Product deleted", "success")
                setProducts(productsAfterDelete)
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            openNotification("top", "Somebody already bought the product", "error")
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let getMyProducts = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL+"/products/own/",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            jsonData.map( product => {
                product.key = product.id
                return product
            })
            setProducts(jsonData)
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
            title: "Title",
            dataIndex: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Price (€)",
            dataIndex: "price",
            render: (price) =>
                <Text style={{fontSize: 18, fontWeight: 600, color: "black",}}>{price}</Text>,
            sorter: (a, b) => a.price - b.price,
            editable: true,
        },
        {
            title: "Date",
            dataIndex: "date",
            render: (date) => {
                let pDate = timestampToDate(date)
                let now = new Date()
                let dif = now - pDate
                if (dif < 24 * 60 * 60 * 1000)
                    return <p>today</p>
                else if (dif < 2 * 24 * 60 * 60 * 1000)
                    return <p>last 2 days</p>
                else if (dif < 3 * 24 * 60 * 60 * 1000)
                    return <p>last 3 days</p>
                else if (dif < 5 * 24 * 60 * 60 * 1000)
                    return <p>last 5 days</p>
                else if (dif < 7 * 24 * 60 * 60 * 1000)
                    return <p>last week</p>
                else if (dif < 30 * 24 * 60 * 60 * 1000)
                    return <p>last month</p>
                else
                    return timestampToString(date)
            },
            sorter: (a, b) => a.date - b.date,
        },
        {
            title: "Buyer",
            dataIndex: [],
            render: (product) =>
               <Link to={"/users/"+product.buyerId}>{ product.buyerEmail ? <div><UserOutlined /> {product.buyerEmail}</div> : '' }</Link>
        },
        {
            title: "Actions",
            dataIndex: "id",
            render: (id) => {return (
                // <div id={id} hidden={true}>
                        <Space.Compact style={{gap: "1rem"}} direction="horizontal">
                            <Link to={"/products/edit/"+id}><EditOutlined /></Link>
                            <Link to={"#"} onClick={() => deleteProduct(id)}><DeleteOutlined /></Link>
                        </Space.Compact>
                // </div>
            )}
        },
    ]

    // const [hoveredRow, setHoveredRow] = useState(null);

    let calculateMoney = () => {
        let money = 0
        let total = 0
        products.forEach(p => {
            total += p.price
            money += p.buyerEmail !== null ?  p.price : 0
        })
        return {money: money, totalMoney: total}
    }

    let calculateSoldProducts = () => {
        let soldProducts = 0
        let count = 0
        products.forEach(p => {
            count++
            soldProducts += p.buyerEmail !== null ?  1 : 0
        })
        return {soldProducts: soldProducts, productsCount: count}
    }

    return (
        <div>
            <Card title={"Products summary"} style={{margin: "2rem 4rem",}}>
                <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
                    <Text style={{fontSize: 20, fontWeight: "bold", color: "forestgreen",}}>
                        Current money of products on sale {calculateMoney().money} / {calculateMoney().totalMoney}€
                    </Text>
                    <Text style={{fontSize: 20, fontWeight: "bold", color: "mediumpurple",}}>
                        Sold products {calculateSoldProducts().soldProducts}/{calculateSoldProducts().productsCount}
                    </Text>
                </div>
            </Card>
            <Table columns={columns} dataSource={products} style={{margin: "2rem 4rem"}}
                   // onRow={(record) => ({
                   //     onMouseEnter: (i) => {
                   //         const dataRowKey = i.currentTarget.getAttribute('data-row-key')
                   //         console.log(dataRowKey)
                   //         document.getElementById(dataRowKey).hidden = false
                   //     },
                   //     onMouseOut: (i) => {
                   //         const dataRowKey = i.currentTarget.getAttribute('data-row-key')
                   //         console.log(dataRowKey)
                   //         document.getElementById(dataRowKey).hidden = true
                   //     }
                   // })}
            >
            </Table>
        </div>
    )
}

export default ListMyProductsComponent;