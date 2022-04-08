import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import styles from "../../styles/User.module.css";
import Link from "next/link";
import City from '../../asset/extention/tw_city'
import { CheckLoginStatus, SetCookie, getCookie } from '../../asset/extention/AuthCheck'

export default function UserInfo() {

    const router = useRouter()
    const [userId, setUserId] = useState('')
    const [token, setToken] = useState('')

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [CityName, setCityName] = useState('')
    const [AreaName, setAreaName] = useState('')

    // 修改密碼
    const [showRenewParssword, setShowRenewParssword] = useState(false)
    const [verify_phone, setVerify_phone] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [ConfirmNewPassword, setConfirmNewPassword] = useState('')

    const [CityArrray, setCityArrray] = useState([])
    const [AreaArrray, setAreaArrray] = useState([])

    // const []
    useEffect(() => {

        let Check = CheckLoginStatus(router);
        if (!Check) {
            CheckLoginStatus('/user/login')
        }
        let userId = getCookie('userId')
        let token = getCookie('token')
        setCityArrray(Object.keys(City))
        setUserId((value) => value = userId)
        setToken((value) => value = token)

    }, [])

    //寫入userId && token 並且都有值
    useEffect(() => {
        if (userId && token) {
            GetUserInfo()
        }
    }, [userId, token])


    // useEffect(() => {
    //     // console.log('改道CityName', CityName);
    //     if (!CityName) return null;
    //     // console.log('CityName', CityName, City[`${CityName}`]);
    //     setAreaArrray(City[`${CityName}`])
    //     setAreaName(City[`${CityName}`][0])
    // }, [CityName])

    // 縣市更新，區域陣列更新完再選第一個區域為預設值
    useEffect(() => {
        console.log('縣市更新', City[`${CityName}`]);
        if (AreaArrray && AreaArrray.length > 0) {
            console.log('有', AreaArrray);
            setAreaName(AreaArrray[0])
        }
    }, [AreaArrray])


    // 選擇縣市更新
    const UpdateCitySelect = (e) => {
        console.log('選擇縣市更新', e.target.value);
        setCityName(e.target.value)
        setAreaArrray((arr) => arr = City[`${e.target.value}`])
    }
    // 選擇區域更新
    const UpdateAreaSelect = (e) => {
        console.log('選擇區域更新');
        setAreaName(e.target.value)
    }


    const GetUserInfo = async () => {
        let res = await axios.post(`${process.env.API_URL}/User/userinfo`, {
            userId: userId,
            token: token
        });
        console.log(res);
        if (res.data.success) {
            // setUserinfo(res.data.user)
            setAreaArrray(City[`${res.data.user.country}`])
            setName(res.data.user.name)

            let phone = res.data.user.phone.split('');
            phone.forEach((num, idx) => {
                if (idx >= 2 && idx < 8) {
                    phone[idx] = '*'
                }
            })
            phone = phone.join('');
            setPhone(phone)
            setPassword('******')
            setEmail(res.data.user.email)
            setAddress(res.data.user.address)
            setCityName(res.data.user.country)
            setAreaName(res.data.user.area)
        }
    }

    const Logout = () => {
        SetCookie('userId', '', -1)
        SetCookie('token', '', -1)
        router.push('/')
    }

    const UpdateUserInfo = async () => {
        if (!name || !address || !CityName || !AreaName) {
            alert('欄位填寫不完全')
            return null;
        }

        let res = await axios.post(`${process.env.API_URL}/User/edit_userinfo`, {
            name: name,
            email: email,
            address: address,
            CityName: CityName,
            AreaName: AreaName,
            userId: userId,
            token: token
        })
        console.log(res);
        if (res.data.success) {
            alert('會員資訊更新成功')
            GetUserInfo()
        } else {
            alert('會員認證錯誤')
        }

    }

    const UpdateUserPassword = async () => {
        if (!verify_phone || !newPassword || !ConfirmNewPassword) {
            alert('欄位填寫不完全')
            return null;
        }
        if (newPassword !== ConfirmNewPassword) {
            alert('兩次密碼輸入不同')
            return null;
        }
        let res = await axios.post(`${process.env.API_URL}/User/edit_password`, {
            verify_phone: verify_phone,
            newPassword: newPassword,
            userId: userId,
            token: token
        })
        console.log(res);
        if (res.data.success) {
            alert('會員密碼更新成功')
            setShowRenewParssword(false)
            GetUserInfo()
        }else{
            alert('密碼更新失敗')
        }
    }

    return (
        <>
            <Navbar />

            <article className='min-h-screen mt-24 relative'>

                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
                <h2 className='text-3xl my-16 text-center font-light tracking-widest text-yellow-900'>會　員　資　訊<br /><span className='text-lg'>User Infomation</span></h2>

                <form action="" className="  py-10 max-w-5xl mx-auto gap-2">
                    <section className='my-5'>
                        <label htmlFor="name" className='block text-xl p-1 my-1 text-yellow-900 font-light'>姓名</label>
                        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='my-5'>
                        <label htmlFor="phone" className='block text-xl p-1 my-1 text-yellow-900 font-light'>聯絡電話</label>
                        <input type="tel" disabled id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='my-5'>
                        <div className="flex items-center ">
                            <label htmlFor="password" className='block text-xl p-1 my-1 text-yellow-900 font-light'>密碼</label>
                            <button type='button' className='text-gray-500 ml-3 text-lg border-b border-transparent hover:border-gray-400' onClick={() => setShowRenewParssword(true)}>修改密碼</button>
                        </div>
                        <input type="password" disabled id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='my-5'>
                        <label htmlFor="email" className='block text-xl p-1 my-1 text-yellow-900 font-light'>電子信箱</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='my-5'>
                        <label htmlFor="city" className='block text-xl p-1 my-1 text-yellow-900 font-light'>縣市</label>
                        <select name="city" id="city" value={CityName}
                            onChange={UpdateCitySelect} className='block w-full py-2 px-2 rounded-md border text-lg' >
                            {
                                CityArrray.map((item, idx) => (<option value={item} key={item} >{item}</option>))
                            }
                        </select>
                    </section>
                    <section className='my-5'>
                        <label htmlFor="city" className='block text-xl p-1 my-1 text-yellow-900 font-light'>區域</label>
                        <select name="city" id="city" value={AreaName} onChange={UpdateAreaSelect} className='block w-full py-2 px-2 rounded-md border text-lg' >
                            {
                                AreaArrray ? AreaArrray.map((item, idx) => (<option value={item} key={item} >{item}</option>)) : null
                            }
                        </select>
                    </section>
                    <section className='my-5'>
                        <label htmlFor="address" className='block text-xl p-1 my-1 text-yellow-900 font-light'>地址</label>
                        <input type="text" id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='col-span-2 text-center my-3'>
                        {/* <button type='button' onClick={() => setCityName('高雄市')}>測試</button> */}
                        <button type='button' onClick={() => UpdateUserInfo()} className='mx-2 text-3xl bg-yellow-900 hover:bg-yellow-800 text-white px-8 py-2 tracking-widest rounded-full transition-all duration-200'>更　新</button>
                        <button type='button' onClick={() => Logout()} className='mx-2 text-3xl bg-red-500 hover:bg-red-400 text-white px-8 py-2 tracking-widest rounded-full transition-all duration-200'>登　出</button>
                    </section>
                </form>

            </article>

            {
                showRenewParssword ? (
                    <div className="w-4/5  mx-auto z-10 my-5 lg:my-0 card  py-5 px-5 xl:px-10 bg-white shadow-xl rounded-lg fixed top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2  lg:max-w-xs xl:max-w-md" >
                        <h2 className="text-4xl font-bold pb-6 border-b border-gray-200">修改密碼</h2>
                        <section className='my-5'>
                            <label htmlFor="verify_phone" className='block text-xl p-1 my-1 text-yellow-900 font-light'>認證電話</label>
                            <input type="tel" id="verify_phone" name="verify_phone" value={verify_phone} onChange={(e) => setVerify_phone(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                        </section>
                        <section className='my-5'>
                            <label htmlFor="newPassword" className='block text-xl p-1 my-1 text-yellow-900 font-light'>新密碼</label>
                            <input type="password" id="newPassword" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                        </section>
                        <section className='my-5'>
                            <label htmlFor="ConfirmNewPassword" className='block text-xl p-1 my-1 text-yellow-900 font-light'>確認新密碼</label>
                            <input type="password" id="ConfirmNewPassword" name="ConfirmNewPassword" value={ConfirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                        </section>
                        <div className="flex justify-around my-5">
                            <button type="button" onClick={() => UpdateUserPassword()} className="py-2 px-14 transition-all duration-150  rounded-full text-xl bg-red-500 hover:bg-red-400 text-white ">送出</button>
                            <button type="button" onClick={() => setShowRenewParssword(false)} className="py-2 px-14 transition-all duration-150  rounded-full text-xl bg-gray-400 hover:bg-gray-300 text-white ">取消</button>
                        </div>
                    </div>
                ) : (
                    null
                )
            }


            <Footer />

        </>
    )
}
