import React from 'react'
import Image from "next/image";
import Logo from "../asset/image/logo.png";

export default function footer() {
    return (
        <footer className='py-16 bg-orange-100 '>
            <div className="text-center">
                <div className="mt-2 mx-auto" style={{ maxWidth: '200px' }}>
                    <Image src={Logo} alt="Logo" />
                </div>
            </div>
            <div className="flex justify-center my-5">
                <div className=' px-12 border-yellow-800 border-l border-r'>
                    <ul>
                        <li className='text-xl mb-3 font-light text-yellow-800'>關於我們</li>
                        <li className='my-1 text-lg text-gray-500 font-light border-b border-transparent hover:border-gray-400'><a href="">最新消息</a></li>
                        <li className='my-1 text-lg text-gray-500 font-light border-b border-transparent hover:border-gray-400'><a href="">聯絡我們</a></li>
                        <li className='my-1 text-lg text-gray-500 font-light border-b border-transparent hover:border-gray-400'><a href="">隱私權政策</a></li>
                    </ul>
                </div>
                <div className=' px-12 border-yellow-800 border-r'>
                    <ul>
                        <li className='text-xl mb-3 font-light text-yellow-800'>線上購物</li>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                    </ul>
                </div>
                <div className=' px-12 border-yellow-800 border-r'>
                    <ul>
                        <li className='text-xl mb-3 font-light text-yellow-800'>購物須知</li>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                    </ul>
                </div>
                <div className=' px-12 border-yellow-800 border-r'>
                    <ul>
                        <li className='text-xl mb-3 font-light text-yellow-800'>會員中心</li>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}
