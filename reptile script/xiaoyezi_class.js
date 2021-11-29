var request = require('request');
var CryptoJS=require('crypto-js');

function noce(e) {
    for (var t = "ABCDEF1234567890", a = t.length, n = "", r = 0; r < e; r++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}
function Md5(e,t){
    function n(e, t) {
        var a = (65535 & e) + (65535 & t), n = (e >> 16) + (t >> 16) + (a >> 16);
        return n << 16 | 65535 & a
    }
    function r(e, t) {
        return e << t | e >>> 32 - t
    }
    function s(e, t, a, s, o, i) {
        return n(r(n(n(t, e), n(s, i)), o), a)
    }
    function o(e, t, a, n, r, o, i) {
        return s(t & a | ~t & n, e, t, r, o, i)
    }
    function i(e, t, a, n, r, o, i) {
        return s(t & n | a & ~n, e, t, r, o, i)
    }
    function u(e, t, a, n, r, o, i) {
        return s(t ^ a ^ n, e, t, r, o, i)
    }
    function c(e, t, a, n, r, o, i) {
        return s(a ^ (t | ~n), e, t, r, o, i)
    }
    function d(e, t) {
        var a, r, s, d, l;
        e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
        var p = 1732584193, m = -271733879, h = -1732584194, f = 271733878;
        for (a = 0; a < e.length; a += 16)
            r = p, s = m, d = h, l = f, p = o(p, m, h, f, e[a], 7, -680876936), f = o(f, p, m, h, e[a + 1], 12, -389564586), h = o(h, f, p, m, e[a + 2], 17, 606105819), m = o(m, h, f, p, e[a + 3], 22, -1044525330), p = o(p, m, h, f, e[a + 4], 7, -176418897), f = o(f, p, m, h, e[a + 5], 12, 1200080426), h = o(h, f, p, m, e[a + 6], 17, -1473231341), m = o(m, h, f, p, e[a + 7], 22, -45705983), p = o(p, m, h, f, e[a + 8], 7, 1770035416), f = o(f, p, m, h, e[a + 9], 12, -1958414417), h = o(h, f, p, m, e[a + 10], 17, -42063), m = o(m, h, f, p, e[a + 11], 22, -1990404162), p = o(p, m, h, f, e[a + 12], 7, 1804603682), f = o(f, p, m, h, e[a + 13], 12, -40341101), h = o(h, f, p, m, e[a + 14], 17, -1502002290), m = o(m, h, f, p, e[a + 15], 22, 1236535329), p = i(p, m, h, f, e[a + 1], 5, -165796510), f = i(f, p, m, h, e[a + 6], 9, -1069501632), h = i(h, f, p, m, e[a + 11], 14, 643717713), m = i(m, h, f, p, e[a], 20, -373897302), p = i(p, m, h, f, e[a + 5], 5, -701558691), f = i(f, p, m, h, e[a + 10], 9, 38016083), h = i(h, f, p, m, e[a + 15], 14, -660478335), m = i(m, h, f, p, e[a + 4], 20, -405537848), p = i(p, m, h, f, e[a + 9], 5, 568446438), f = i(f, p, m, h, e[a + 14], 9, -1019803690), h = i(h, f, p, m, e[a + 3], 14, -187363961), m = i(m, h, f, p, e[a + 8], 20, 1163531501), p = i(p, m, h, f, e[a + 13], 5, -1444681467), f = i(f, p, m, h, e[a + 2], 9, -51403784), h = i(h, f, p, m, e[a + 7], 14, 1735328473), m = i(m, h, f, p, e[a + 12], 20, -1926607734), p = u(p, m, h, f, e[a + 5], 4, -378558), f = u(f, p, m, h, e[a + 8], 11, -2022574463), h = u(h, f, p, m, e[a + 11], 16, 1839030562), m = u(m, h, f, p, e[a + 14], 23, -35309556), p = u(p, m, h, f, e[a + 1], 4, -1530992060), f = u(f, p, m, h, e[a + 4], 11, 1272893353), h = u(h, f, p, m, e[a + 7], 16, -155497632), m = u(m, h, f, p, e[a + 10], 23, -1094730640), p = u(p, m, h, f, e[a + 13], 4, 681279174), f = u(f, p, m, h, e[a], 11, -358537222), h = u(h, f, p, m, e[a + 3], 16, -722521979), m = u(m, h, f, p, e[a + 6], 23, 76029189), p = u(p, m, h, f, e[a + 9], 4, -640364487), f = u(f, p, m, h, e[a + 12], 11, -421815835), h = u(h, f, p, m, e[a + 15], 16, 530742520), m = u(m, h, f, p, e[a + 2], 23, -995338651), p = c(p, m, h, f, e[a], 6, -198630844), f = c(f, p, m, h, e[a + 7], 10, 1126891415), h = c(h, f, p, m, e[a + 14], 15, -1416354905), m = c(m, h, f, p, e[a + 5], 21, -57434055), p = c(p, m, h, f, e[a + 12], 6, 1700485571), f = c(f, p, m, h, e[a + 3], 10, -1894986606), h = c(h, f, p, m, e[a + 10], 15, -1051523), m = c(m, h, f, p, e[a + 1], 21, -2054922799), p = c(p, m, h, f, e[a + 8], 6, 1873313359), f = c(f, p, m, h, e[a + 15], 10, -30611744), h = c(h, f, p, m, e[a + 6], 15, -1560198380), m = c(m, h, f, p, e[a + 13], 21, 1309151649), p = c(p, m, h, f, e[a + 4], 6, -145523070), f = c(f, p, m, h, e[a + 11], 10, -1120210379), h = c(h, f, p, m, e[a + 2], 15, 718787259), m = c(m, h, f, p, e[a + 9], 21, -343485551), p = n(p, r), m = n(m, s), h = n(h, d), f = n(f, l);
        return[p, m, h, f]
    }
    function l(e) {
        var t, a = "", n = 32 * e.length;
        for (t = 0; t < n; t += 8)
            a += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);

        return a
    }
    function p(e) {
        var t, a = [];
        for (a[ (e.length >> 2) - 1] = void 0, t = 0; t < a.length; t += 1)
            a[t] = 0;
        var n = 8 * e.length;
        for (t = 0; t < n; t += 8)
            a[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
        return a
    }
    function m(e) {
        return l(d(p(e), 8 * e.length))
    }
    function h(e) {
        var t, a, n = "0123456789abcdef", r = "";
        for (a = 0; a < e.length; a += 1)
            t = e.charCodeAt(a), r += n.charAt(t >>> 4 & 15) + n.charAt(15 & t);
        return r
    }
    function f(e) {
        return unescape(encodeURIComponent(e))
    }
    function g(e) {
        return m(f(e))
    }
    function b(e) {
        return h(g(e))
    }
    return b(e)
}

function inside(e){
    return c(u(s(e), 8 * e.length))
}



function  data_x(accPaw, way) {

    let vlaue = JSON.stringify(accPaw)
    let method = way
    var n = noce(8)
    var r = 'N8Oz2QQtMMKyDKW6OMcy2e'
    var time = Date.now().toString()
    var o = final(inside(first(r + method + vlaue + time + n))),
        content

    return content = CBC(vlaue, '7C3EFBEC', '6DC35F56').toLocaleUpperCase(), n = CBC(n, '7C3EFBEC', '6DC35F56').toLocaleUpperCase(), {
        appkey: r,
        method: method,
        content: content,
        timestamp: time,
        sign: o,
        nonce: n
    }
}
function first(e) {
    for (var t, a, n = "", r = -1; ++r < e.length;)
        t = e.charCodeAt(r), a = r + 1 < e.length ? e.charCodeAt(r + 1) : 0, 55296 <= t && t <= 56319 && 56320 <= a && a <= 57343 && (t = 65536 + ((1023 & t) << 10) + (1023 & a), r++), t <= 127 ? n += String.fromCharCode(t) : t <= 2047 ? n += String.fromCharCode(192 | t >>> 6 & 31, 128 | 63 & t) : t <= 65535 ? n += String.fromCharCode(224 | t >>> 12 & 15, 128 | t >>> 6 & 63, 128 | 63 & t) : t <= 2097151 && (n += String.fromCharCode(240 | t >>> 18 & 7, 128 | t >>> 12 & 63, 128 | t >>> 6 & 63, 128 | 63 & t));
    return n
}
function CBC(e, t, a) {
    var n = CryptoJS.enc.Utf8.parse(t), r = CryptoJS.enc.Utf8.parse(a);
    return  CryptoJS.DES.encrypt(e, n, {
        iv: r,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString()
}


function s(e) {
    for (var t = Array(e.length >> 2), a = 0; a < t.length; a++)
        t[a] = 0;
    for (a = 0; a < 8 * e.length; a += 8)
        t[a >> 5] |= (255 & e.charCodeAt(a / 8)) << a % 32;
    return t
}
 function u(e, t) {
    function a(e, t, a, n, r, s) {
        return i((o = i(i(t, e), i(n, s))) << (u = r) | o >>> 32 - u, a);
        var o, u
    }
    function n(e, t, n, r, s, o, i) {
        return a(t & n | ~t & r, e, t, s, o, i)
    }
    function r(e, t, n, r, s, o, i) {
        return a(t & r | n & ~r, e, t, s, o, i)
    }
    function s(e, t, n, r, s, o, i) {
        return a(t ^ n ^ r, e, t, s, o, i)
    }
    function o(e, t, n, r, s, o, i) {
        return a(n ^ (t | ~r), e, t, s, o, i)
    }
    function i(e, t) {
        var a = (65535 & e) + (65535 & t);
        return(e >> 16) + (t >> 16) + (a >> 16) << 16 | 65535 & a
    }
    return  function(e, t) {
        e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
        for (var a = 1732584193, u = -271733879, c = -1732584194, d = 271733878, l = 0; l < e.length; l += 16) {
            var p = a, m = u, h = c, f = d;
            u =  o(u = o(u = o(u = o(u = s(u = s(u = s(u = s(u = r(u = r(u = r(u = r(u = n(u = n(u = n(u = n(u, c = n(c, d = n(d, a = n(a, u, c, d, e[l + 0], 7, -680876936), u, c, e[l + 1], 12, -389564586), a, u, e[l + 2], 17, 606105819), d, a, e[l + 3], 22, -1044525330), c = n(c, d = n(d, a = n(a, u, c, d, e[l + 4], 7, -176418897), u, c, e[l + 5], 12, 1200080426), a, u, e[l + 6], 17, -1473231341), d, a, e[l + 7], 22, -45705983), c = n(c, d = n(d, a = n(a, u, c, d, e[l + 8], 7, 1770035416), u, c, e[l + 9], 12, -1958414417), a, u, e[l + 10], 17, -42063), d, a, e[l + 11], 22, -1990404162), c = n(c, d = n(d, a = n(a, u, c, d, e[l + 12], 7, 1804603682), u, c, e[l + 13], 12, -40341101), a, u, e[l + 14], 17, -1502002290), d, a, e[l + 15], 22, 1236535329), c = r(c, d = r(d, a = r(a, u, c, d, e[l + 1], 5, -165796510), u, c, e[l + 6], 9, -1069501632), a, u, e[l + 11], 14, 643717713), d, a, e[l + 0], 20, -373897302), c = r(c, d = r(d, a = r(a, u, c, d, e[l + 5], 5, -701558691), u, c, e[l + 10], 9, 38016083), a, u, e[l + 15], 14, -660478335), d, a, e[l + 4], 20, -405537848), c = r(c, d = r(d, a = r(a, u, c, d, e[l + 9], 5, 568446438), u, c, e[l + 14], 9, -1019803690), a, u, e[l + 3], 14, -187363961), d, a, e[l + 8], 20, 1163531501), c = r(c, d = r(d, a = r(a, u, c, d, e[l + 13], 5, -1444681467), u, c, e[l + 2], 9, -51403784), a, u, e[l + 7], 14, 1735328473), d, a, e[l + 12], 20, -1926607734), c = s(c, d = s(d, a = s(a, u, c, d, e[l + 5], 4, -378558), u, c, e[l + 8], 11, -2022574463), a, u, e[l + 11], 16, 1839030562), d, a, e[l + 14], 23, -35309556), c = s(c, d = s(d, a = s(a, u, c, d, e[l + 1], 4, -1530992060), u, c, e[l + 4], 11, 1272893353), a, u, e[l + 7], 16, -155497632), d, a, e[l + 10], 23, -1094730640), c = s(c, d = s(d, a = s(a, u, c, d, e[l + 13], 4, 681279174), u, c, e[l + 0], 11, -358537222), a, u, e[l + 3], 16, -722521979), d, a, e[l + 6], 23, 76029189), c = s(c, d = s(d, a = s(a, u, c, d, e[l + 9], 4, -640364487), u, c, e[l + 12], 11, -421815835), a, u, e[l + 15], 16, 530742520), d, a, e[l + 2], 23, -995338651), c = o(c, d = o(d, a = o(a, u, c, d, e[l + 0], 6, -198630844), u, c, e[l + 7], 10, 1126891415), a, u, e[l + 14], 15, -1416354905), d, a, e[l + 5], 21, -57434055), c = o(c, d = o(d, a = o(a, u, c, d, e[l + 12], 6, 1700485571), u, c, e[l + 3], 10, -1894986606), a, u, e[l + 10], 15, -1051523), d, a, e[l + 1], 21, -2054922799), c = o(c, d = o(d, a = o(a, u, c, d, e[l + 8], 6, 1873313359), u, c, e[l + 15], 10, -30611744), a, u, e[l + 6], 15, -1560198380), d, a, e[l + 13], 21, 1309151649), c = o(c, d = o(d, a = o(a, u, c, d, e[l + 4], 6, -145523070), u, c, e[l + 11], 10, -1120210379), a, u, e[l + 2], 15, 718787259), d, a, e[l + 9], 21, -343485551), a = i(a, p), u = i(u, m), c = i(c, h), d = i(d, f)
        }
        return Array(a, u, c, d)
    }(e, t)
}
function c(e) {
    for (var t = "", a = 0; a < 32 * e.length; a += 8)
        t += String.fromCharCode(e[a >> 5] >>> a % 32 & 255);
    return t
}
function final(e) {
    for (var t, a = 0, n = a ? "0123456789ABCDEF" : "0123456789abcdef", r = "", s = 0; s < e.length; s++)
        t = e.charCodeAt(s), r += n.charAt(t >>> 4 & 15) + n.charAt(15 & t);
    return r
}
///以上为加密方法
function sleep(ms){
    return new Promise(reslove=>setTimeout(reslove,ms))

}
function sendMessage(message){
    console.log(message)

}

function send(options) {
    return new Promise((resolve,reject) => {
        request(options, function (error,resopnse){
            if (error) {
                reject(error)
            }else {

                resolve(resopnse.body)
            }

        })

    })
}
function close(){

}
var header={
    'X-Requested-With': 'com.dispatch.mangosteen',
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'text/html, application/xhtml+xml, */*',
    'Referer':"http://www.gxgtjtss.com",
    'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',
    'Origin':'http://www.gxgtjtss.com'
}
var site=["taobao", "jd", "pdd", "kuaishou", "douyin"]
var uid=''
var error_count=0
var time_error=0
var all_bind_account=[]
var final_acc=[]
var able_acc=[]
var taobao_acc=[]
var pdd_acc=[]
var send_acc=['0','0','0','0','0']
var mission_type="2"
var change_taobao_index=0
var change_pdd_index=0
var change_times=0
var empty_times=0
var abort_count=0



async function login(){
    try {

        var content1={
            username: "18560309015",
            password: Md5('888888'),
            captcha:""

        }
        var way1="com.homebrew.login"
        var encr_data=data_x(content1,way1) ///将参数和方法传入加密方法 返回加密后的对象参数
        console.log(encr_data)
        var options = {
            'method': 'POST',
            'url': 'http://apicloud-ca0.5548.pw:8000/router/rest',
            'headers':header ,

            form: encr_data
        }
        console.log(1)
        while (1){

            var data=await send(options)
            console.log(1)
            var new_data=JSON.parse(data)
            console.log(new_data)
            if (new_data.code===1 && new_data.message==='success') {
                console.log("登录成功")///向用户展示内容
                uid = new_data["data"][0]["uid"]
                await abort_task()
                get_bind_account()
                break

            }else {
                if (new_data["message"]==='invaid username or password'){
                    console.log("用户名或密码错误")///展示内容 停止程序
                    close()
                    break
                }
                else if (new_data["message"]==='invalid request'){
                    console.log("登录失败,可能用户名或密码错误")///展示内容 停止程序
                    close()
                    break
                }
                else if(new_data["message"]==='member not exists'){
                    console.log("用户名或密码错误")
                    close()
                    break       ///展示内容 停止程序
                }
                else{
                    if (error_count<10){
                        error_count+=1
                        console.log(new_data['message'])
                        continue
                    }else {
                        console.log("error")
                        ////shangbao
                        close()
                        break
                    }
                    ///若message 为不匹配以上 展示“异常请重试或上报” 并停止程序 向我们服务器发送错误信息
                }
            }

        }
    }
    catch (error){
        if (error_count<10){
            error_count+=1
            console.log(error)
            ////shangbao  error
            login()
        }else {
            console.log("error")
            ////shangbao
            close()

        }
        ///若message 为不匹配以上 展示“异常请重试或上报” 并停止程序 向我们服务器发送错误信息
    }




}
async function abort_task(){

    try {
        var content2={
            uid:uid

        }
        var way2="com.homebrew.abortapplyforamission"
        var encr_data=data_x(content2,way2)
        var options = {
            'method': 'POST',
            'url': 'http://apicloud-ca0.5548.pw:8000/router/rest',
            'headers': header,
            form: encr_data
        };
        var data=await send(options)
        var new_data=JSON.parse(data)
        console.log(new_data)


    }
    catch (error){
        ///shangbao error
    }
}

async function get_bind_account() {

try{


    var way2 = "com.homebrew.getbindvestlist"

    for (var i in site) {
        var content2 = {
            uid: uid,
            site: site[i]

        }
        var encr_data = data_x(content2, way2)
        var options = {
            'method': 'POST',
            'url': 'http://apicloud-ca0.5548.pw:8000/router/rest',
            'headers': header,

            form: encr_data
            };

            var plat=site[i]
            var count=0
            while (count<6){
                await sleep(1000)
                var data=await send(options)
                var new_data=JSON.parse(data)
                console.log(new_data)
                if (new_data["code"] === 1 && new_data["message"] === 'success'){
                    var account= new_data["data"]
                    for (var i in account) {

                        if (account[i]['fblack'] === 0) {


                            var this_account = {

                                accountType: plat,
                                accountId: account[i]['id'],
                                accountName: plat + "-" + account[i]["vestname"]
                            }
                            all_bind_account.push(this_account)

                            if (account[i]["f1"] !==0){
                                able_acc.push(this_account)



                            }else {
                                ///置顶
                                console.log(account[i]["vestname"]+'接满，已自动换号')
                            }

                        }

                    }

                    break
                }else {
                    if (new_data["message"] === "too many attempts") {
                        if (time_error<5){
                            await sleep(30000)
                            time_error+=1
                        }else {
                            await sleep(180000)
                            time_error=0
                        }
                    }
                    else{
                        ///shangbao new_data['message']
                        console.log(site[i]+"账号获取失败")
                        count+=1
                    }
                }

            }


    }
    final_acc=able_acc
    console.log(all_bind_account)
    await handle_bind_account()
    apply_tasks()
    console.log(taobao_acc)
    console.log(send_acc)

    }
    catch (error){
        if (error_count<10){
            error_count+=1
            console.log(error)
            ////shangbao  error
            get_bind_account()
        }else {
            console.log("error")
            ////shangbao
            close()

        }
    }
}
async function handle_bind_account(){
    if (final_acc.length < 1) {
        close()
        console.log("没用可用接单号")
    }


    for(var i in all_bind_account){
        if (final_acc[i]['accountType']==='taobao'){
            taobao_acc.push(final_acc[i])
            if (send_acc[0]==='0'){
                send_acc[0]=final_acc[i]['accountId']
                sendMessage('当前接单号'+final_acc[i]['accountName'])
            }

        }else if (final_acc[i]['accountType']==='jd'){
            if (send_acc[1]==='0'){
                send_acc[1]=final_acc[i]['accountId']
            }

        }else if (final_acc[i]['accountType']==='pdd') {
            pdd_acc.push(final_acc[i])
            if (send_acc[2] === '0') {
                send_acc[2] = final_acc[i]['accountId']
            }
        }else if (final_acc[i]['accountType']==='kuaishou') {
            if (send_acc[3] === '0') {
                send_acc[3] =final_acc[i]['accountId']
            }
        }else if (final_acc[i]['accountType']==='douyin') {
            if (send_acc[4] === '0') {
                send_acc[4] = final_acc[i]['accountId']
            }
        }
    }
    await set_default_acc()

}
async function set_default_acc(){
    var default_acc=0
    if (send_acc[0]!=="0"){
         default_acc=send_acc[0]
    }else {
        if (send_acc[2]!=="0"){
            default_acc=send_acc[2]
        }
    }
    if (default_acc!==0){
        var content3={
            uid:uid,
            vestid:default_acc///选择一个用户选择的可用账号id


        }
        console.log(content3['vestid'])
        var way3= "com.homebrew.setdefaultvest"
        var encr_data= data_x(content3, way3)
        var options = {
            'method': 'POST',
            'url': 'http://apicloud-ca0.5548.pw:8000/router/rest',
            'headers': header,
            form: encr_data
        };
        var count=0
        while (count<5){
            var data=await send(options)
            var new_data=JSON.parse(data)
            console.log(new_data)
            if (new_data["code"] !== 1 && new_data["message"] !== 'success') {
                count+=1
                if (new_data["message"] === "too many attempts") {

                        await sleep(720000)


                }
            }else {
                break
            }

        }

    }
}
async function apply_tasks() {
    try {


        var str_send_acc = send_acc.join(',')
        console.log(str_send_acc)

        var content4 = {
            uid: uid,
            vestid: str_send_acc,
            missiontype: mission_type
        }
        var way4 = "com.homebrew.applyforamission"
        var encr_data = data_x(content4, way4)
        var options = {
            'method': 'POST',
            'url': 'http://apicloud-ca0.5548.pw:8000/router/rest',
            'headers': header,
            form: encr_data
        };

        while (1) {
            await sleep(5000)
            var data = await send(options)
            var new_data = JSON.parse(data)
            console.log(new_data)
            if (new_data["code"] === 1 && new_data["message"] === 'success') {
                do_tasks()
                break
            } else { /// ///第四步请求没有成功 根据message 判断
                var str='账号被限制接单，您可以只选择淘宝和拼多多账号再尝试，若仍被限制请联系平台处理。'
                if (new_data["message"] === "un praise") {
                    ///展示以下内容 停止程序
                    console.log('你有待好评订单请处理后接单')
                    close()
                    break
                } else if (new_data["message"] === "acquire limited") {
                    if (change_times<10){
                        change_times+=1
                        change_acc()
                    }else {
                        console.log(str)
                        close()
                        break
                    }
                    ///展示以下内容 ） 走第八步 设置新的默认账号  从用户选择了的可用账号中选择依次选择一个不是默认账号的淘宝种类账号（若没有淘宝选择其他）  然后从第三步 获得账号 开始 并且 第四步包装的参数 只发送默认账号 其他为0 例vestid: deafult_acc + ",0,0,0,0" 账号位置也是按照 种类排 第四步有写

                } else if (new_data["message"] === 'beginner limited') {
                    if (change_times<10){
                        change_times+=1
                        change_acc()
                    }else {
                        console.log(str)
                        close()
                        break

                    }
                } else if (new_data["message"] === "acquire limited2") {
                    if (change_times<10){
                        change_times+=1
                        change_acc()
                    }else {
                        console.log(str)
                        close()
                        break
                    }///***增加功能展示 默认账号名称 即发送第四步用的账号vestid
                } else if (new_data["message"] === 'acquire limited by score') {
                    if (change_times<10){
                        change_times+=1
                        change_acc()
                    }else {
                        console.log(str)
                        close()
                        break
                    }
                } else if (new_data["message"] === 'have unfinished mission') {

                    console.log('接单成功')///停止程序 展示内容
                    close()
                    break
                } else if (new_data["message"] === 'too many attempts') {
                    console.log('请求频繁sleep')
                    await sleep(720000)
                }  else if(new_data["message"].indexOf('verify expired')>-1 ){
                    ////最终账号数组删除  置顶提示 从handle—acc开始
                    var id=send_acc[0]
                    for(var k in final_acc){
                        if (final_acc[k]['accountId']===id){
                            final_acc.splice(k,1)
                            console.log('账号'+final_acc[k]['accountName']+'需要验号，已自动换号')
                        }
                    }
                    for(var s in taobao_acc){
                        if (taobao_acc[s]['accountId']===id){
                            taobao_acc.splice(s,1)
                        }
                    }
                    await handle_bind_account()
                    await apply_tasks()

                }
                else {
                    if (error_count < 10) {
                        error_count += 1
                        console.log(new_data['message'])

                    } else {
                        console.log("接单失败 您可有需要完成待确认收货的任务 若没有请上报")
                        ////shangbao
                        close()
                        break
                    }


                    ///若message 为不匹配以上 展示 以下内容 并停止程序 向我们服务器发送错误信息
                }
            }
        }

    }catch (error){
        if (error_count<10){
            error_count+=1
            console.log(error)
            ////shangbao  error
            get_bind_account()
        }else {
            console.log("error")
            ////shangbao
            close()

        }
    }
}
async function change_acc(){
    if (taobao_acc.length>1||pdd_acc.length>1){
        if (taobao_acc.length>1){
            change_taobao_index+=1
            if (change_taobao_index>=taobao_acc.length){
                change_taobao_index=0
            }
            send_acc[0]=taobao_acc[change_taobao_index]['accountId']
            sendMessage('当前接单号'+taobao_acc[change_taobao_index]['accountName'])

        }
        if (pdd_acc.length>1){
            change_pdd_index+=1
            if (change_pdd_index>=pdd_acc.length){
                change_pdd_index=0
            }
            send_acc[2]=pdd_acc[change_pdd_index]['accountId']

        }
        await sleep(3000)
        await set_default_acc()
    }

}
async function do_tasks(){
    try {


    console.log("正在接单")
    var content5 = {
        uid: uid,


    }
    var way5 = "com.homebrew.queryapplyforamission"
    var encr_data = data_x(content5, way5)
    var options = {
        'method': 'POST',
        'url': 'http://apicloud-ca0.5548.pw:8000/router/rest',
        'headers': header,

        form: encr_data
    };
    ///每次延迟5秒发送

    while (1) {
        var time=6000
        if (abort_count===3){
            time=12000
        }
        await sleep(time)
        var data = await send(options)
        var new_data = JSON.parse(data)
        console.log(new_data)
        if (new_data["code"] === 1 && new_data["message"] === 'success') {
            if (new_data["data"][0]['missionid'] > 0) {
                accept_tasks(new_data)
                break
            }else {
                if (abort_count>5){
                    await sleep(3000)
                    await abort_task()
                    await apply_tasks()
                    abort_count=0
                    break
                }
                if (empty_times<10) {
                    empty_times +=1
                    abort_count+=1
                    console.log('暂无任务')


                }
                else {
                    await change_acc()
                    apply_tasks()
                    empty_times=0
                    break
                }
            }
        }else {
            if (new_data["message"] === "apply not exists") {
                apply_tasks()

            } else if (new_data["message"] === "area limit") {
                if (change_times<10){
                    change_times+=1
                    change_acc()
                }else {
                    console.log("区域限制，您可以只选择淘宝和拼多多账号再尝试，若仍被限制请联系平台处理。")
                    close()
                    break
                }

            } else if (new_data["message"] === "too many attempts") {
                console.log('sleep')
                await sleep(720000)

            } else {
                if (error_count < 10) {
                    error_count += 1
                    console.log(new_data['message'])

                } else {
                    console.log("接单失败 您可有需要完成待确认收货的任务 若没有请上报")
                    ////shangbao
                    close()
                    break
                }
            }
        }
    }
    }catch (error){
        if (error_count<10){
            error_count+=1
            console.log(error)
            ////shangbao  error
            login()
        }else {
            console.log("error")
            ////shangbao
            close()

        }
    }

}
async function accept_tasks(new_data){
    var content6 = {
        listid: new_data["data"][0]['listid'],
        missionid: new_data["data"][0]['missionid'],
        site: new_data["data"][0]['site'],
        uid: uid,
        vestid: new_data["data"][0]['vestid']

    }
        console.log(new_data["data"][0]['missioninfo'])
        var cost =new_data["data"][0]['missioninfo']['cost']
        var commison= new_data["data"][0]['missioninfo']['commission'] / 100

    var way6 = "com.homebrew.acquiremission"
    var encr_data = data_x(content6, way6)
    var options = {
        'method': 'POST',
        'url': 'http://apicloud-ca0.5548.pw:8000/router/rest',
        'headers': header,
        form: encr_data
    };

        var data = await send(options)
        var this_data = JSON.parse(data)
        console.log(this_data)
    if (this_data["code"] === 1 && this_data["message"] === 'success') {
        ///展示 佣金和本金值 并停止程序
        console.log('接单成功')
        console.log("本金" + cost + "佣金" + commison)///***增加功能 用户 可在界面选择 佣金范围 将need_data['commison'] 的佣金与用户现在的范围比较 如果不匹配从第二步重新开始 并向用户展示“接单成功 佣金不匹配 已取消”
        close()
        ///***增加功能 展示接单成功的账号 即从第四步请求开始使用的账号
    } else {

        console.log('确认接单失败已重新接单')
        apply_tasks()
    }
}

login()