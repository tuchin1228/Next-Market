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
import Cookies from 'js-cookie'
import { route } from 'next/dist/server/router';
import { CheckLoginStatus } from '../../asset/extention/AuthCheck'
import Head from "next/head";

export default function Lineloginload() {

    const router = useRouter()

     // Line Need
     const [client_id, setClient_id] = useState('1657025850')
     const [redirect_uri, setRedirect_uri] = useState(`${process.env.BASE_URL}/user/lineloginload`)
     const [client_secret, setClient_secret] = useState('43767fd63709e07c151db2fcfca23822')
     const [access_token, setAccess_token] = useState('')
     const [id_token, setId_token] = useState('')

    // 檢查網址有無code
    useEffect(() => {

        const AuthCheck = async () => {
            let Check = await CheckLoginStatus()
            if (Check) {
                // alert('轉址')
                router.push('/')
            }
        };

        AuthCheck()

        console.log(router.query);
        if (router.query && router.query.code) {
            console.log('有code', router.query.code);
            LineGetAccessToken()
        }else{
            router.push('/')
        }
    }, [router.query])

    
    // 取得Line Access Token
    const LineGetAccessToken = async () => {
        console.log('有code', router.query.code);

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
            let data = await jwt_decode(res.data.id_token)
            // console.log('jwt', data);
            await CheckLineUser(data.sub)
            // 先檢查有沒有此Line user sub在資料庫，有=>直接登入 沒有=>詢問是否擁有帳戶==>有->輸入電話與密碼綁定，沒有->註冊
            // setAccess_token(res.data.access_token)
            // setId_token(res.data.id_token)

            // 個資法關係，要取得用戶信箱要在Provider申請啟用信箱
            // await LineGetUserInfo(res.data.id_token)
        } else {
            router.push('/user/login')
        }
    }

    const CheckLineUser = async (sub) => {
        //先檢查這個Line有沒有被綁定過
        let res = await axios.post(`${process.env.API_URL}/User/lineregister`, { LineSub: sub })
        console.log(res);
        if (res.data.success && res.data.status == 1) { //已綁定 直接登入
            // 走登入API
            Login('line', sub)
        } else { //未綁定，需選擇是否註冊過
            router.push({ pathname: '/user/checkRegister', query: { sub: sub } })
        }
    }

    const Login = async (type, sub = null) => {
        let res = await axios.post(`${process.env.API_URL}/User/login`, {
            LineSub: sub
        })

        console.log(res);
        if (res.data.success) {
            Cookies.set('userId', res.data.userId, { expires: 7 })
            Cookies.set('token', res.data.token, { expires: 7 })
            router.push('/')

        } else {
            alert('登入失敗')
        }

    }

    return (
        <div>
            <Head>
                <title>Line 登入驗證中 - 巧克力工廠</title>
            </Head>
            <p className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-yellow-900 font-bold'>Line 登入驗證中 ...</p>
        </div>
    )
}
