import Cookies from 'js-cookie'

export function CheckLoginStatus(){ //未登入->login 登入->會員頁面
    console.log(document.cookie);
    let userId = Cookies.get('userId')
    let token =  Cookies.get('token')
    console.log('userId', userId, 'token', token);
    if (userId && token) {
        return true;
    } else {
        Cookies.remove('userId')
        Cookies.remove('token')
        return false;
        //   router.push('/user/login')
    }
}

export function getCookie(cname){
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function SetCookie(name, value, days){
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = '; expires=' + date.toGMTString();    
    document.cookie = `${name}=${value};${expires};`;
};