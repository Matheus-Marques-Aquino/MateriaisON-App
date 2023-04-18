import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Link } from "react-router";
import history from './components/subcomponents/widgets/history';
//Pages
import Index from './components/index';
import VendorPage from './components/vendor_page';
import ProductPage from './components/product_page';
import LoginPage from './components/login_page';
import SearchPage from './components/search_page';
import VendorSearchPage from './components/vendor_search_page';
import CartPage from './components/cart_page';
import ConfigurantionPage from './components/configuration_page';
import HelpPage from './components/help_page';
import ProfilePage from './components/profile_page';
import AddressSelectPage from './components/address_select_page';
import NewAddressPage from './components/new_address_page';
import VendorCategoryPage from './components/vendor_category_page';
import OrdersPage from './components/orders_page';
import OrderPage from './components/order_page';
import AccountCreatePage from './components/account_create_page';
import PaymentAddressPage from './components/payment_address_page';
import PaymentMethodsPage from './components/payment_methods_page';
import LostMyPassword from './components/lost_password_page';
import ResetPasswordPage from './components/reset_password_page';
import VendorTermsPage from './components/vendor_terms_page';
import PrivacyPolicyPage from './components/privacy_policy';
import LocalizationPage from './components/localization_page';
import LocalizationByDDDPage from './components/localization_by_ddd';
import ServicePage from './components/service_page';

const routes = (
  <Router history={history}>
    <Switch>

      <Route path="/localizacao/ddd">
        <LocalizationByDDDPage/>
      </Route>

      <Route path="/localizacao">
        <LocalizationPage /> 
      </Route>

      <Route path="/pedido/">
        <OrderPage /> 
      </Route>

      <Route path="/pedidos">
        <OrdersPage /> 
      </Route>

      <Route path="/categoria/">
        <VendorCategoryPage /> 
      </Route>

      <Route path="/produto">
        <ProductPage /> 
      </Route>

      <Route path="/prestador-de-servico/">
        <ServicePage /> 
      </Route>

      <Route path="/fornecedor/buscar">
        <VendorSearchPage /> 
      </Route>

      <Route path="/fornecedor/condicoes">
        <VendorTermsPage /> 
      </Route>

      <Route path="/destinatarios/novo">
        <NewAddressPage /> 
      </Route>

      <Route path="/destinatarios">
        <AddressSelectPage /> 
      </Route>

      <Route path="/fornecedor">
        <VendorPage /> 
      </Route>

      <Route path="/buscar">
        <SearchPage />         
      </Route>

      <Route path="/carrinho">
        <CartPage />         
      </Route>

      <Route path="/menu/cartoes">
        <PaymentMethodsPage />         
      </Route>

      <Route path="/menu/perfil">
        <ProfilePage />         
      </Route>

      <Route path="/menu/ajuda">
        <HelpPage />         
      </Route>

      <Route path="/menu/cobranca">
        <PaymentAddressPage />         
      </Route>

      <Route path="/menu">
        <ConfigurantionPage />         
      </Route>

      <Route path="/entrar">
        <LoginPage />         
      </Route>

      <Route path="/registrar">
        <AccountCreatePage />         
      </Route>

      <Route path="/perdi-a-senha">
        <LostMyPassword />         
      </Route>

      <Route path="/redefinir-senha">
        <ResetPasswordPage />         
      </Route>

      <Route path="/politica-de-privacidade">
        <PrivacyPolicyPage />         
      </Route>

      <Route path="/">
        <Index />         
      </Route>

    </Switch>
  </Router>
)

Meteor.startup(() => {
  ReactDOM.render( routes, document.querySelector('.appContainer'));
});
