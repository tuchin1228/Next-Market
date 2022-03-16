import React from "react";
import Image from "next/image";
import Logo from "../asset/image/logo.png";
export default function Navbar() {
  return (
    <>
      <div className=" bg-white shadow fixed top-0 w-full left-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-xl max-w-sm">
            <Image src={Logo} alt="Logo" width={80} height={80} />
          </div>
          <div>
            <ul className="flex items-center justify-end">
              <li className="text-sm  py-1 px-3 text-gray-700">購物車</li>
              <li className="text-sm  py-1 px-3 text-gray-700">訂單查詢</li>
            </ul>
            <ul className="flex items-center mt-1">
              <li className="font-normal text-md py-1 mx-2 px-2 transition duration-150 text-gray-700 hover:text-orange-500 border-b-2 border-transparent hover:border-orange-500">
                品牌故事
              </li>
              <li className="font-normal text-md py-1 mx-2 px-2 transition duration-150 text-gray-700 hover:text-orange-500 border-b-2 border-transparent hover:border-orange-500">
                最新消息
              </li>
              <li className="font-normal text-md py-1 mx-2 px-2 transition duration-150 text-gray-700 hover:text-orange-500 border-b-2 border-transparent hover:border-orange-500">
                產品介紹
              </li>
              <li className="font-normal text-md py-1 mx-2 px-2 transition duration-150 text-gray-700 hover:text-orange-500 border-b-2 border-transparent hover:border-orange-500">
                聯絡我們
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
