import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Login from './Components/Auth/Login'
import Customers from './Pages/Customers'
import AddGrocery from './Pages/Grocery/AddGrocery'
import List from './Pages/Grocery/List'
import EditGrocery from './Pages/Grocery/EditGrocery'
import AddProduct from './Pages/Products/AddProduct'
import EditProduct from './Pages/Products/EditProduct'
import ProductList from './Pages/Products/ProductList'
import Createadmin from './Components/Auth/CreateAdmin'
import EditAdmin from './Components/Auth/EditAdmin'
import LoginList from './Components/Auth/LoginList'
import Orders from './Pages/Order/Order'
import AddSub from './Pages/SubGrocery/AddSub'
import SubList from './Pages/SubGrocery/SubList'
import EditSub from './Pages/SubGrocery/EditSub'
const PageRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path='/Dashboard' element={<Dashboard/>}/>
            <Route path='/CustomerList' element={<Customers/>}/>
            <Route path='/AddGrocery' element={<AddGrocery/>}/>
            <Route path='/List' element={<List/>}/>
            <Route path='/EditGrocery/:id' element={<EditGrocery/>}/>
            <Route path='/CustomerList' element={<Customers/>}/>
            <Route path='/AddSubGrocery' element={<AddSub/>}/>
            <Route path='/SubList' element={<SubList/>}/>
            <Route path='/EditSubGrocery/:id' element={<EditSub/>}/>
            <Route path='/AddProduct' element={<AddProduct/>}/>
            <Route path='/EditProduct/:id' element={<EditProduct/>}/>
            <Route path='/ProductList' element={<ProductList/>}/>
            <Route path='/CreateAdmin' element={<Createadmin/>}/>
            <Route path='/EditAdmin/:id' element={<EditAdmin/>}/>
            <Route path='/AdminList' element={<LoginList/>}/>
            <Route path='/Orders' element={<Orders/>}/>
            <Route path="/" element={<Login/>}/>
        </Routes>

    </div>
  )
}

export default PageRoutes
