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
import { route } from 'next/dist/server/router';
import { CheckLoginStatus, SetCookie } from '../../asset/extention/AuthCheck'

export default function Login({ showLogin, ToggleShowLogin }) {
    const router = useRouter()
    console.log(`${process.env.BASE_URL}${router.pathname}`);

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // 重設密碼
    const [showRenewParssword, setShowRenewParssword] = useState(false)
    const [verify_phone, setVerify_phone] = useState('')
    const [verify_email, setVerify_email] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [ConfirmNewPassword, setConfirmNewPassword] = useState('')

    // Line Need
    const [client_id, setClient_id] = useState('1657025850')
    const [redirect_uri, setRedirect_uri] = useState(`${process.env.BASE_URL}${router.pathname}`)
    const [client_secret, setClient_secret] = useState('43767fd63709e07c151db2fcfca23822')
    const [access_token, setAccess_token] = useState('')
    const [id_token, setId_token] = useState('')

    // 檢查網址有無code
    useEffect(() => {
        let Check = CheckLoginStatus(router);
        if (Check) {
            router.push('/')
        }
        console.log(router.query);
        if (router.query && router.query.code) {
            console.log('有code', router.query.code);
            LineGetAccessToken()
        }
    }, [router])

    // Line登入畫面
    const LineLogin = async () => {

        location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${new Date().getTime()}&scope=profile%20openid%20email`
    }

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
            let data = jwt_decode(res.data.id_token)
            console.log(data);
            setAccess_token(token => token = res.data.access_token)
            setId_token(token => token = res.data.id_token)
            CheckLineUser(data.sub)
            // 先檢查有沒有此Line user sub在資料庫，有=>直接登入 沒有=>詢問是否擁有帳戶==>有->輸入電話與密碼綁定，沒有->註冊


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
            let res = await axios.post(`${process.env.API_URL}/User/login`, { LineSub: sub })
            console.log(res);
            if (res.data.success) {
                // let date = new Date();
                // date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
                // const expires = "expires=" + date.toUTCString();
                SetCookie('userId', res.data.userId, 7)
                SetCookie('token', res.data.token, 7)
                console.log(document.cookie);
                router.push('/')
            } else {
                alert('登入失敗')
            }
        } else { //未綁定，需選擇是否註冊過
            // document.cookie = `Line_Sub=${sub}`;
            router.push({ pathname: '/user/checkRegister', query: { sub: sub } })
            // location.href='/user/checkRegister'
        }
    }

    const Login = async () => {

        let res = await axios.post(`${process.env.API_URL}/User/login`, {
            phone: phone,
            password: password
        })
        console.log(res);
        if (res.data.success) {
            // let date = new Date();
            // date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
            // const expires = "expires=" + date.toUTCString();
            // document.cookie = `userId=${res.data.userId} ${expires}`;
            // document.cookie = `token=${res.data.token} ${expires}`;
            SetCookie('userId', res.data.userId, 7)
            SetCookie('token', res.data.token, 7)
            router.push('/')

        } else {
            alert('登入失敗')
        }

    }

    // const CheckLoginStatus = () => { //未登入->login 登入->會員頁面
    //     console.log(document.cookie);
    //     let userId = getCookie('userId')
    //     let token = getCookie('token')
    //     console.log('userId', userId, 'token', token);
    //     if (userId && token) {
    //         router.push('/')
    //     } else {
    //         SetCookie('userId', '', -1)
    //         SetCookie('token', '', -1)
    //         //   router.push('/user/login')
    //     }
    // }
    // const getCookie = (cname) => {
    //     let name = cname + "=";
    //     let decodedCookie = decodeURIComponent(document.cookie);
    //     let ca = decodedCookie.split(';');
    //     for (let i = 0; i < ca.length; i++) {
    //         let c = ca[i];
    //         while (c.charAt(0) == ' ') {
    //             c = c.substring(1);
    //         }
    //         if (c.indexOf(name) == 0) {
    //             return c.substring(name.length, c.length);
    //         }
    //     }
    //     return "";
    // }
    // const SetCookie = (name, value, days) => {
    //     var date = new Date();
    //     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    //     var expires = '; expires=' + date.toGMTString();
    //     document.cookie = `${name}=${value};expires=${expires};`;
    // };
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

    const ResetPassword = async () => {
        if (!verify_phone || !newPassword || !ConfirmNewPassword || !verify_email) {
            alert('欄位填寫不完全')
            return null;
        }
        if (newPassword !== ConfirmNewPassword) {
            alert('兩次密碼輸入不同')
            return null;
        }
        let res = await axios.post(`${process.env.API_URL}/User/reset_password`, {
            verify_phone: verify_phone,
            verify_email: verify_email,
            newPassword: newPassword,
        })
        console.log(res);
        if (res.data.success) {
            alert('密碼重設成功')
            setShowRenewParssword(false)
        } else {
            alert('密碼更新失敗')
        }
    }

    return (

        <>
            <Navbar />

            <article className='min-h-screen mt-24 relative'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>

                <div className={` py-10 max-w-4xl mx-auto gap-2  `} >
                    <div className="">
                        <div>
                            <h2 className='text-3xl my-16 text-center font-light tracking-widest text-yellow-900'>會　員　登　入<br /><span className='text-lg'>Login</span></h2>

                            <form action="">
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>行動電話：</label>
                                    <input type="tel" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入行動電話' />
                                </div>
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>密碼：</label>
                                    <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入密碼' />
                                </div>

                                <div className='text-center'>
                                    <button type='button' onClick={() => Login()} className=' mx-1 px-5 py-1 mt-3 mb-5 border-2 border-gray-200 text-xl text-gray-400 hover:text-yellow-900 hover:border-yellow-900 transition-all duration-200 '>登　入</button>
                                    {/* <button type='button' onClick={() => ToggleShowLogin(false)} className=' mx-1 px-5 py-1 mt-3 mb-5 border-2 border-gray-200 text-xl text-gray-400 hover:text-yellow-900 hover:border-yellow-900 transition-all duration-200 '>取　消</button> */}

                                </div>
                                <div className='text-center flex justify-center my-3'>
                                    <button type='button' onClick={() => setShowRenewParssword(true)} className='   px-2 text-gray-300 hover:text-gray-400 '>忘記密碼</button>
                                    <div className='border-r border-gray-300'></div>
                                    <Link href={`/user/register`}>
                                        <a className='   px-2 text-gray-300 hover:text-gray-400'>立即註冊</a>
                                    </Link>
                                </div>
                            </form>
                        </div>
                        <div className='my-5 '>
                            <button type='button' onClick={() => LineLogin()} className='w-full rounded-full block my-3 text-2xl py-2 bg-green-500 hover:bg-green-400 text-white font-bold text-center' >Line 登入</button>
                            {/* <a href="" className=' block my-3 text-2xl py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold text-center'>Facebook 登入</a> */}
                            {/* <button type='button' onClick={() => checkLoginState()} className=' block my-3 text-2xl py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold text-center'>FB</button> */}
                            {/* <meta name="google-signin-client_id" content="543055673593-7urhu73eldpo1fm3phi6ikcd0jclqbmo.apps.googleusercontent.com" /> */}

                            {/* <button type='button' className='w-full block my-3 text-2xl py-2 bg-red-500 hover:bg-red-400 text-white font-bold text-center'>Google 登入</button> */}
                        </div>
                    </div>
                </div>

            </article>
            {
                showRenewParssword ? (
                    <div className="w-4/5  mx-auto z-10 my-5 lg:my-0 card  py-5 px-5 xl:px-10 bg-white shadow-xl rounded-lg fixed top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2  lg:max-w-xs xl:max-w-md" >
                        <h2 className="text-4xl font-bold pb-6 border-b border-gray-200">修改密碼</h2>
                        <section className='my-5'>
                            <label htmlFor="verify_phone" className='block text-xl p-1 my-1 text-yellow-900 font-light'>認證電話</label>
                            <input type="tel" id="verify_phone" name="verify_phone" value={verify_phone} onChange={(e) => setVerify_phone(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                        </section>

                        <div className='my-5'>
                            <label htmlFor="verify_email" className=' block my-1 text-lg text-yellow-900'>信箱：</label>
                            <input type="email" name="verify_email" id="verify_email" value={verify_email} onChange={(e) => setVerify_email(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='' />
                        </div>
                        <section className='my-5'>
                            <label htmlFor="newPassword" className='block text-xl p-1 my-1 text-yellow-900 font-light'>新密碼</label>
                            <input type="password" id="newPassword" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                        </section>
                        <section className='my-5'>
                            <label htmlFor="ConfirmNewPassword" className='block text-xl p-1 my-1 text-yellow-900 font-light'>確認新密碼</label>
                            <input type="password" id="ConfirmNewPassword" name="ConfirmNewPassword" value={ConfirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                        </section>
                        <div className="flex justify-around my-5">
                            <button type="button" onClick={() => ResetPassword()} className="py-2 px-14 transition-all duration-150  rounded-full text-xl bg-red-500 hover:bg-red-400 text-white ">送出</button>
                            <button type="button" onClick={() => setShowRenewParssword(false)} className="py-2 px-14 transition-all duration-150  rounded-full text-xl bg-gray-400 hover:bg-gray-300 text-white ">取消</button>
                        </div>
                    </div>
                ) : (
                    null
                )
            }

            <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js'></script>
            <Footer />
        </>
    )
}
