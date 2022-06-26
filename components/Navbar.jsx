import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Image from "next/image";
import Link from "next/link";
import Login from "./Login";
import Cart from "./Cart";
import Logo from "../asset/image/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faClipboardList, faUser, faBars } from '@fortawesome/free-solid-svg-icons'
import { CheckLoginStatus } from '../asset/extention/AuthCheck'
import Cookies from 'js-cookie'
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const router = useRouter()
  const [LoginStatus, setLoginStatus] = useState(false);
  const [showCart, setShowCart] = useState(false)
  const [NavActive, setNavActive] = useState(false)

  useEffect(() => {

    // const AuthCheck = async () => {
    //   let Check = await CheckLoginStatus()
    //   // console.log('Check', Check);
    //   if (!Check) {
    //     setLoginStatus(false)
    //   } else {
    //     setLoginStatus(true)
    //   }
    // };

    // AuthCheck()

    // let Check = AuthCheck();
    // console.log('Check', Check);




  }, [])

  const UserUrl = async () => {
    let Check = await CheckLoginStatus()
    if (Check) {
      router.push('/user/userinfo')
    } else {
      router.push('/user/login')

    }

  }

  const ToggleCart = async () => {
    // 檢查登入狀態

    if (!showCart) {
      let Check = await CheckLoginStatus()
      if (!Check) {
        alert('請先登入會員')
        router.push('/user/login')
      } else {
        setShowCart(!showCart)
      }
    } else {
      setShowCart(!showCart)
    }
  }

  const GoOrder = async () => {
    let Check = await CheckLoginStatus()
    if (Check) {
      router.push('/order')
    } else {
      router.push('/user/login')

    }

  }
  // const ToggleShowLogin = (status) => {
  //   setShowLogin(status)
  // }


  // const CheckLoginStatus = () => { //未登入->login 登入->會員頁面
  //   console.log(document.cookie);
  //   let userId = getCookie('userId')
  //   let token = getCookie('token')
  //   console.log('userId',userId,'token',token);
  //   if (userId && token) {
  //     router.push('/')
  //   } else {
  //     document.cookie = "userId= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
  //     document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
  //     router.push('/user/login')
  //   }
  // }
  // const getCookie = (cname) => {
  //   let name = cname + "=";
  //   let decodedCookie = decodeURIComponent(document.cookie);
  //   let ca = decodedCookie.split(';');
  //   for (let i = 0; i < ca.length; i++) {
  //     let c = ca[i];
  //     while (c.charAt(0) == ' ') {
  //       c = c.substring(1);
  //     }
  //     if (c.indexOf(name) == 0) {
  //       return c.substring(name.length, c.length);
  //     }
  //   }
  //   return "";
  // }

  const ToggleBar = () => {
    setNavActive(!NavActive)
  }


  return (
    <>
      <div className=" bg-white shadow fixed top-0 w-full left-0 z-50 ">
        <div className="relative container lg:py-5 mx-auto flex items-center justify-between">
          <div className=" bg-white py-4 px-4 w-full lg:w-auto flex justify-between items-center z-20">
            <Link href={'/'}>
              <a className="max-w-150 md:max-w-200">
                <Image src={Logo} alt="Logo" />
                {/* <img src="" alt="" /> */}
              </a>
            </Link>
            <div className={`${NavActive ? styles.navActive : ''} lg:hidden`}>
              <a href="javascript:;" onClick={() => ToggleBar()} className={`${styles.nav__trigger}  `} >
                <span className={`${styles.nav__icon}  nav__icon bg-yellow-900`} ></span>
              </a>
            </div>
            {/* <FontAwesomeIcon className="text-2xl text-yellow-900 block lg:hidden" style={{ }} icon={faBars} /> */}
          </div>
          <div className={`absolute bottom-0 left-0 transform translate-y-full bg-white lg:bg-transparent lg:transform-none  transition-all duration-150 w-full lg:relative lg:w-auto lg:block z-10 ${ NavActive ? '' : 'translate-y-0'}`}>
            {/* <ul className="flex items-center justify-end">
              <li className="text-lg  py-1 px-3 text-gray-700">購物車</li>
              <li className="text-lg  py-1 px-3 text-gray-700">訂單查詢</li>
            </ul> */}
            <ul className=" text-center lg:flex items-center mt-1">
              <li className="font-light text-lg my-2 lg:my-0 py-1 mx-2 px-5 transition-all duration-200 text-gray-600 hover:text-orange-800 rounded-full hover:bg-orange-100">
                <Link href={'/about'}>
                  <a className="block w-full">品牌故事</a>
                </Link>
              </li>
              <li className="font-light text-lg my-2 lg:my-0 py-1 mx-2 px-5 transition-all duration-200 text-gray-600 hover:text-orange-800 rounded-full hover:bg-orange-100">
                <Link href={'/news'}>
                  <a className="block w-full">最新消息</a>
                </Link>
              </li>
              <li className="font-light text-lg my-2 lg:my-0 py-1 mx-2 px-5 transition-all duration-200 text-gray-600 hover:text-orange-800 rounded-full hover:bg-orange-100">
                <Link href={'/product'}>
                  <a className="block w-full">產品介紹</a>
                </Link>
              </li>
              <li className="font-light text-lg my-2 lg:my-0 py-1 mx-2 px-5 transition-all duration-200 text-gray-600 hover:text-orange-800 rounded-full hover:bg-orange-100">
                <Link href={'/contact'}>
                  <a className="block w-full">聯絡我們</a>
                </Link>
              </li>

              {/* lg up hidden */}
              <li className="lg:hidden">
                <ul className="flex items-center justify-center relative my-4  ">
                  <li className="text-lg  py-1 px-3 text-gray-700 relative" onClick={() => ToggleCart()}>
                    <p className="text-lg rounded-full  bg-orange-50 text-yellow-800 hover:bg-orange-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200" style={{ width: '45px', height: '45px' }}><FontAwesomeIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} icon={faShoppingCart} /></p>
                  </li>
                  <li className="text-lg  py-1 px-3 text-gray-700 relative" onClick={() => GoOrder()}>
                    <p className="text-lg rounded-full  bg-orange-50 text-yellow-800 hover:bg-orange-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200" style={{ width: '45px', height: '45px' }}><FontAwesomeIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} icon={faClipboardList} /></p>
                  </li>
                  <li className="text-lg  py-1 px-3 text-gray-700 relative" onClick={() => UserUrl()}>
                    <p className="text-lg rounded-full  bg-orange-50 text-yellow-800 hover:bg-orange-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200" style={{ width: '45px', height: '45px' }}><FontAwesomeIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} icon={faUser} /></p>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="hidden lg:block">
            <ul className="flex items-center justify-end relative">
              <li className="text-lg  py-1 px-3 text-gray-700 relative" onClick={() => ToggleCart()}>
                <p className="text-lg rounded-full  bg-orange-50 text-yellow-800 hover:bg-orange-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200" style={{ width: '45px', height: '45px' }}><FontAwesomeIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} icon={faShoppingCart} /></p>
              </li>
              <li className="text-lg  py-1 px-3 text-gray-700 relative" onClick={() => GoOrder()}>
                <p className="text-lg rounded-full  bg-orange-50 text-yellow-800 hover:bg-orange-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200" style={{ width: '45px', height: '45px' }}><FontAwesomeIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} icon={faClipboardList} /></p>
              </li>
              <li className="text-lg  py-1 px-3 text-gray-700 relative" onClick={() => UserUrl()}>
                <p className="text-lg rounded-full  bg-orange-50 text-yellow-800 hover:bg-orange-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200" style={{ width: '45px', height: '45px' }}><FontAwesomeIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} icon={faUser} /></p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* <Login showLogin={showLogin} ToggleShowLogin={ToggleShowLogin} /> */}
      {
        showCart ? (<><Cart ToggleCart={() => ToggleCart()} /></>) : ''
      }
    </>
  );
}
