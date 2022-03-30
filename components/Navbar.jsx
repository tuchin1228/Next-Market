import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../asset/image/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faClipboardList ,faUser } from '@fortawesome/free-solid-svg-icons'
export default function Navbar() {
  return (
    <>
      <div className=" bg-white shadow fixed top-0 w-full left-0 z-50 ">
        <div className="container  py-5 mx-auto flex items-center justify-between">
          <Link href={'/'}>
            <a className="mt-2" style={{ maxWidth: '200px' }}>
              <Image src={Logo} alt="Logo" />
              {/* <img src="" alt="" /> */}
            </a>
          </Link>
          <div>
            {/* <ul className="flex items-center justify-end">
              <li className="text-lg  py-1 px-3 text-gray-700">購物車</li>
              <li className="text-lg  py-1 px-3 text-gray-700">訂單查詢</li>
            </ul> */}
            <ul className="flex items-center mt-1">
              <li className="font-light text-lg py-1 mx-2 px-5 transition-all duration-200 text-gray-600 hover:text-orange-800 rounded-full hover:bg-orange-100">
                <Link href={'/about'}>
                  <a>品牌故事</a>
                </Link>
              </li>
              <li className="font-light text-lg py-1 mx-2 px-5 transition-all duration-200 text-gray-600 hover:text-orange-800 rounded-full hover:bg-orange-100">
                <Link href={'/news'}>
                  <a>最新消息</a>
                </Link>
              </li>
              <li className="font-light text-lg py-1 mx-2 px-5 transition-all duration-200 text-gray-600 hover:text-orange-800 rounded-full hover:bg-orange-100">
                <Link href={'/product'}>
                  <a>產品介紹</a>
                </Link>
              </li>
              <li className="font-light text-lg py-1 mx-2 px-5 transition-all duration-200 text-gray-600 hover:text-orange-800 rounded-full hover:bg-orange-100">
                <Link href={'/contact'}>
                  <a>聯絡我們</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="flex items-center justify-end relative">
              <li className="text-lg  py-1 px-3 text-gray-700 relative">
                <p className="text-lg rounded-full  bg-orange-50 text-yellow-800 hover:bg-orange-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200" style={{ width: '45px', height: '45px' }}><FontAwesomeIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} icon={faShoppingCart} /></p>
              </li>
              <li className="text-lg  py-1 px-3 text-gray-700 relative">
                <p className="text-lg rounded-full  bg-orange-50 text-yellow-800 hover:bg-orange-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200" style={{ width: '45px', height: '45px' }}><FontAwesomeIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} icon={faClipboardList} /></p>
              </li>
              <li className="text-lg  py-1 px-3 text-gray-700 relative">
                <p className="text-lg rounded-full  bg-orange-50 text-yellow-800 hover:bg-orange-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200" style={{ width: '45px', height: '45px' }}><FontAwesomeIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} icon={faUser} /></p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
