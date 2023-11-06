import LoginFormComponent from "./Components/User/LoginFormComponent";
import CreateUserComponent from "./Components/User/CreateUserComponent";
import ListProductsComponent from "./Components/Products/ListProductsComponent";
import EditProductComponent from "./Components/Products/EditProductComponent";
import DetailsProductComponent from "./Components/Products/DetailsProductComponent";
import CreateProductComponent from "./Components/Products/CreateProductComponent";
import ListMyProductsComponent from "./Components/Products/ListMyProductsComponent";
import ListMyCreditCardsComponent from "./Components/Creditcards/ListMyCreditCardsComponent";
import CreateCreditCardComponent from "./Components/Creditcards/CreateCreditCardComponent";
import ListMyTransactionsComponent from "./Components/Transactions/ListMyTransactionsComponent";
import DetailsUserComponent from "./Components/User/DetailsUserComponent";
import HomeComponent from "./Components/HomeComponent";
import {Route, Routes, Link, useNavigate, useLocation } from "react-router-dom"
import {Layout, Menu, Avatar, Typography, Col, Row, notification } from 'antd';
import {
    AppstoreOutlined, CheckSquareOutlined,
    CreditCardOutlined,
    HomeOutlined,
    LineChartOutlined,
    LoginOutlined,
    LogoutOutlined, ShopOutlined, ShoppingOutlined
} from '@ant-design/icons';
import {useEffect, useState} from "react";

let App = () => {
    const [api, contextHolder] = notification.useNotification();

    let navigate = useNavigate();
    let location = useLocation();
    let [login, setLogin] = useState(false);

    const productCategories = [
        {value: 'electronics',label: 'Electronics',},
        {value: 'books',label: 'Books',},
        {value: 'fashion',label: 'Clothing and Fashion',},
        {value: 'home',label: 'Home and Kitchen',},
        {value: 'health',label: 'Health and Beauty',},
        {value: 'sports',label: 'Sports and Outdoors',},
        {value: 'appliance',label: 'Home Appliance',},
    ]

    // for not using Layout.Header, Layout.Footer, etc...
    let {Header, Content, Footer} = Layout;

    useEffect(() => {
        checkAll()
    }, [])

    let checkAll = async () => {
        let isActive = await checkLoginIsActive()
        await checkUserAccess(isActive)
    }

    const openNotification = (placement, text, type) => {
        api[type]({
            message: 'Notification',
            description: text,
            placement,
        });
    };

    let checkLoginIsActive = async () => {
        if (localStorage.getItem("apiKey") == null) {
            setLogin(false);
            return;
        }

        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/isActiveApiKey",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        if (response.ok) {
            let jsonData = await response.json();
            setLogin(jsonData.activeApiKey)

            if (!jsonData.activeApiKey){
                navigate("/login")
            }
            return(jsonData.activeApiKey)
        } else {
            setLogin(false)
            navigate("/login")
            return (false)
        }
    }

    let checkUserAccess= async (isActive) => {
        let href = location.pathname
        if (!isActive && !["/","/login","/register"].includes(href) ){
            navigate("/login")
        }
    }

    let disconnect = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/disconnect",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        localStorage.removeItem("apiKey");
        setLogin(false)
        navigate("/login")
    }


    const {Text} = Typography;
    return (
        <Layout className="layout" style={{minHeight: "100vh"}}>
            {contextHolder}
            <Header>
                <Row>
                    <Col xs= {18} sm={19} md={20} lg={21} xl = {22}>
                        {!login &&
                            <Menu theme="dark" mode="horizontal" items={[
                                {key: "logo", label: <img src="/logo.png" width="40" height="40"/>},
                                {key: "menuLogin", icon: <LoginOutlined/>, label: <Link to="/login">Login</Link>},
                                {key: "menuRegister", icon: <CheckSquareOutlined />, label: <Link to="/register">Register</Link>},
                            ]}>
                            </Menu>
                        }

                        {login &&
                            <Menu theme="dark" mode="horizontal" items={[
                                {key: "logo", label: <Link to={"/"}><img src="/logo.png" width="40" height="40"/></Link>},
                                {key: "menuHome", icon: <HomeOutlined />, label: <Link to="/">Home</Link>},
                                {key: "menuProducts", icon: <ShopOutlined />, label: <Link to="/products">Products</Link>},
                                {key: "menuMyProduct", icon: <AppstoreOutlined />, label: <Link to="/products/own">My Products</Link> },
                                {key: "menuCreateProduct", icon: <ShoppingOutlined/>, label: <Link to="/products/create">Sell</Link> },
                                {key: "menuMyCreditCards", icon: <CreditCardOutlined />, label: <Link to="/creditCards/own">My Credit Cards</Link> },
                                {key: "menuMyTransactions", icon: <LineChartOutlined />, label: <Link to="/transactions/own">My Transactions</Link> },
                                {key: "menuDisconnect", icon: <LogoutOutlined />, label: <Link to="#" onClick={disconnect}>Disconnect</Link>},
                            ]}>
                            </Menu>
                        }
                    </Col>
                    <Col xs= {6} sm={5} md = {4}  lg = {3} xl = {2}
                         style={{display: 'flex', flexDirection: 'row-reverse' }} >
                        { login ? (
                            <Avatar size="large" onClick={() => navigate("/users/"+localStorage.getItem("userId"))}
                                    style={{ backgroundColor: "#297ab4", verticalAlign: 'middle', marginTop: 12, }}
                                    className="Avatar">
                                { localStorage.getItem("email").charAt(0) }
                            </Avatar>
                        ) : (
                            <></>
                        )}
                    </Col>
                </Row>
            </Header>
            <Content style={{padding: "20px 50px"}}>
                <div className="site-layout-content">
                    <Routes>
                        <Route path="/" element={
                            <HomeComponent productCategories={productCategories}/>
                        }/>
                        <Route path="/register" element={
                            <CreateUserComponent openNotification={openNotification}/>
                        }/>
                        <Route path="/login"  element={
                            <LoginFormComponent setLogin={setLogin} openNotification={openNotification}/>
                        }/>
                        <Route path="/products" element={
                            <ListProductsComponent productOptions={productCategories}/>
                        }/>
                        <Route path="/products/edit/:id" element={
                            <EditProductComponent openNotification={openNotification}/>
                        }/>
                        <Route path="/products/:id" element={
                            <DetailsProductComponent openNotification={openNotification}/>
                        }/>
                        <Route path="/products/create" element={
                            <CreateProductComponent productOptions={productCategories} openNotification={openNotification}/>
                        }></Route>
                        <Route path="/products/own" element={
                            <ListMyProductsComponent openNotification={openNotification}/>
                        }></Route>
                        <Route path="/creditCards/own" element={
                            <ListMyCreditCardsComponent openNotification={openNotification}/>
                        }></Route>
                        <Route path="/creditCards/create" element={
                            <CreateCreditCardComponent openNotification={openNotification}/>
                        }></Route>
                        <Route path="/transactions/own" element={
                            <ListMyTransactionsComponent />
                        }></Route>
                        <Route path="/users/:id" element={
                            <DetailsUserComponent />
                        }/>
                    </Routes>
                </div>
            </Content>

            <Footer style={{textAlign: "center"}}> Wallapep - Jorge López Peláez</Footer>
        </Layout>
)
}

export default App;