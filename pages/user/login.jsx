import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import styles from "../../styles/User.module.css";
import Link from "next/link";
import City from '../../asset/extention/tw_city'
import jwt_decode from "jwt-decode";
import qs from 'qs';


export default function Login({ showLogin, ToggleShowLogin }) {
    const router = useRouter()
    console.log(`${process.env.BASE_URL}${router.pathname}`);
    const [client_id, setClient_id] = useState('1657025850')
    const [redirect_uri, setRedirect_uri] = useState(`${process.env.BASE_URL}${router.pathname}`)
    const [client_secret, setClient_secret] = useState('43767fd63709e07c151db2fcfca23822')
    const [access_token, setAccess_token] = useState('')
    const [id_token, setId_token] = useState('')

    // 檢查網址有無code
    useEffect(() => {
        console.log(router.query);
        if (router.query && router.query.code) {
            console.log('有code',router.query.code);
            LineGetAccessToken()
        }
    }, [router])

    // Line登入畫面
    const LineLogin = async () => {

        location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${new Date().getTime()}&scope=profile%20openid%20email`
    }

    // 取得Line Access Token
    const LineGetAccessToken = async () => {
        console.log('有code',router.query.code);
        let res = await axios.post(`https://api.line.me/oauth2/v2.1/token`,
            qs.stringify({
                grant_type: 'authorization_code',
                code: router.query.code,
                redirect_uri: redirect_uri,
                client_id: client_id,
                client_secret: client_secret,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        ).catch(err => {
            console.log('有錯誤');
            router.push('/user/login')
        })
        console.log(res);
        if (res && res.data && res.data.access_token) {
            let data = jwt_decode(res.data.id_token)
            console.log(data);
            setAccess_token(token => token = res.data.access_token)
            setId_token(token => token = res.data.id_token)

            // 個資法關係，要取得用戶信箱要在Provider申請啟用信箱
            // await LineGetUserInfo(res.data.id_token)
        }else{
            router.push('/user/login')
        }
    }
    // 取得Line User
    // const LineGetUserInfo = async (id_token) => {
    //     console.log(client_id,id_token);
    //     let res = await axios.post(`https://api.line.me/oauth2/v2.1/verify`,
    //         qs.stringify({
    //             client_id: client_id,
    //             id_token: id_token,
    //         }),
    //         {
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             }
    //         })
    //     console.log('LineGetUserInfo', res);
    // }



    return (

        <>
            <Navbar />

            <article className='min-h-screen mt-24 relative'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>

                <div className={` py-10 max-w-5xl mx-auto gap-2  `} >
                    <div className="grid grid-cols-2 items-center">
                        <div>
                            <h2 className='text-3xl font-bold text-center tracking-widest text-yellow-900'>會員登入</h2>
                            <form action="">
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>行動電話：</label>
                                    <input type="tel" name="" id="" className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入行動電話' />
                                </div>
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>密碼：</label>
                                    <input type="password" name="" id="" className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入密碼' />
                                </div>

                                <div className='text-center'>
                                    <button type='button' className=' mx-1 px-5 py-1 mt-3 mb-5 border-2 border-gray-200 text-xl text-gray-400 hover:text-yellow-900 hover:border-yellow-900 transition-all duration-200 '>登　入</button>
                                    {/* <button type='button' onClick={() => ToggleShowLogin(false)} className=' mx-1 px-5 py-1 mt-3 mb-5 border-2 border-gray-200 text-xl text-gray-400 hover:text-yellow-900 hover:border-yellow-900 transition-all duration-200 '>取　消</button> */}

                                </div>
                                <div className='text-center flex justify-center my-3'>
                                    <button type='button' className='   px-2 text-gray-300 hover:text-gray-400 '>忘記密碼</button>
                                    <div className='border-r border-gray-300'></div>
                                    <Link href={`/user/register`}>
                                        <a className='   px-2 text-gray-300 hover:text-gray-400'>立即註冊</a>
                                    </Link>
                                </div>
                            </form>
                        </div>
                        <div className='my-5 px-10'>
                            <button type='button' onClick={() => LineLogin()} className='w-full block my-3 text-2xl py-2 bg-green-500 hover:bg-green-400 text-white font-bold text-center' >Line 登入</button>
                            <a href="" className=' block my-3 text-2xl py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold text-center'>Facebook 登入</a>

                            <a href="" className=' block my-3 text-2xl py-2 bg-red-500 hover:bg-red-400 text-white font-bold text-center'>Google 登入</a>
                        </div>
                    </div>
                </div>

            </article>

            <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js'></script>
            <Footer />
        </>
    )
}
