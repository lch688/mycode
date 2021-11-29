var request = require('request');
var exec = class {
    /** 构造函数 接收参数并开始执行脚本
     *

     * {function} sendMessage 回调


     */
    constructor() {
        this.name='jbp'
        ///以下为 如何构造每个平台的用户选项界面，app端调出脚本写的用户选项，根据脚本的用户选项构造
        ///以下为伪代码，需后期商议出规范的写法和app端如何调用
        this.formData = [ {
            type: 'check', // 复选框
            key: 'checkTest',
            title: '接单类型',
            list: [ // 选项列表
                {
                    title: "垫付",
                    value: "2"
                }, {
                    title: "浏览",
                    value: "1"
                }, {
                    title: "礼品单",
                    value: "7"
                }],
            required: true,
            value: ['2']// 复选框默认值是选项列表中的value一维数组(变量格式需一致)
        }]


        ///构建参数
        this.header = {

            'platform': 'android',
            'version': '3556',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; CDY-AN90 Build/HUAWEICDY-AN90; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045710 Mobile Safari/537.36',
            'Referer': 'https://b.jbpsss.com/',
            'Origin': 'https://b.jbpsss.com',
            'app-plat': '3',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json,charset=UTF-8'

        }
        this.is_close=true
        this.time=8000
        this.url='https://buyer.etette.com/'
        this.error_count = 0
        this.apply_times = 0
        this.empty_times = 0
        this.comission_min=0
        this.comission_max=9999
        this.cost_min=0
        this.cost_max=9999
        this.abort_times=0
        this.final_acc=[]
        this.change_acc_index=0
        this.radioValue="pay"
        this.palt
        this.useracc=[]

        this.md5key="faf617df95b57f1f7511e42a25e98cde"
    }
    ///初始化
    intialization(){

        this.change_acc_index=0
        this.final_acc = []
        this.able_acc = []

    }



    ///调用此函数脚本向app发出信息
    sendMessage(message,top=false){
        console.log(message)
    }
    ///调用此函数，脚本向app传出用户账号，后期会规定好key名
    sendUserList(userList) {}

    //调用其，让脚本休息指定秒数，后期需要和app交互，传出休息的秒数以展示给用户
    sleep(ms) {
        if(this.is_close===false){
            throw new Error('停止运行')
        }


        return new Promise(reslove=>
            this.timer=setTimeout(reslove,ms))



    }

    //关闭函数，调用向app端传出关闭脚本信息，此函数目前为伪代码，需调用app端函数来实现
    close() {
        this.is_close =false
        if(this.timer){
            clearTimeout(this.timer)
        }
        this.options.closed()
        this.sendMessage('接单停止')

    }
    ///工具函数，后期统一放到安装包或单独的js文件中，使其能直接在脚本调用
    GetUuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(n) {
            var a = 16 * Math.random() | 0,
                i = "x" == n ? a : 3 & a | 8;
            return i.toString(16)
        }))
    }
    encode(n, a) {
        var i = "";
        for (var e in n) i += encodeURIComponent(e) + "=" + ("gbk" == a ? t(n[e]) : encodeURIComponent(n[e])) + "&";
        return i.substring(0, i.lastIndexOf("&"))
    }


    ///发送请求函数，此函数，用的nodejs request库 前端运行需要根据调用的原生方法更改，但注意让要让其保持同步
    send(options) {
        return new Promise((resolve,reject) => {
            request(options, function (error,resopnse){
                if (error) {
                    reject(error)
                }else {
                    resolve(resopnse)
                }

            })

        })
    }
    //开始函数，app端调用它来开始脚本运行，option为app端传入脚本用户填入的参数
    start(option) {
        console.log(option)
        this.option=option


        this.login()
    }
    ///以下为接单逻辑，自动嵌套调用  145行-607行
    async login(){
        if (this.is_close){
            try {

                this.uuid=this.GetUuid().toUpperCase()
                var body= JSON.stringify({"lat":"","lng":"","verifyId":"","localhost_ip":"","uuid":this.uuid,"verify":{"randstr":"","ticket":""},"username":"15853307708","password":"0208058cjb18"})

                var options = {
                    'method': 'POST',
                    'url': this.url+'buyer/base/login',
                    'headers':{
                        'app-plat': 3,
                        time: Date.parse(new Date) / 1e3,
                        uuid: this.uuid,
                        platform: "android",
                        version: "3556",
                        "User-Agent":'Mozilla/5.0 (Linux; Android 10; CDY-AN90 Build/HUAWEICDY-AN90; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045710 Mobile Safari/537.36',
                        Referer: "https://b.etette.com/",
                        Origin: "https://b.etette.com",
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body:body
                };
                console.log(options.url)
                while (1){
                    this.sendMessage('正在登录')
                    var data=await this.send(options)
                    var res=JSON.parse(data.body)
                    console.log(res)
                    if (res.code===200){
                        this.sendMessage('登录成功')



                        this.authkey=res.data.authKey
                        this.sessionid=res.data.sessionId

                        this.get_bind_acc()
                        break
                    }else {
                        if (res.error.indexOf("频率受到限制")>-1){
                            this.sendMessage(res.error,+'，休息一会儿...')
                            await this.sleep(12000)

                            //停10秒继续
                        }
                        else if (res.error.indexOf("密码错误")>-1){
                            this.sendMessage(res.error)
                            this.close()
                            break
                        }
                        else if (res.error.indexOf("帐号不存在")>-1){
                            this.sendMessage(res.error)
                            this.close()
                            break
                        }
                        else if (res.error.indexOf('登录账号不合法')>-1){
                            this.sendMessage(res.error)
                            this.close()
                            break
                        }else{
                            //上报
                            this.sendMessage(res.error)
                            this.close()
                            break
                        }
                    }

                }




            }catch (error){
                if (this.is_close===true){
                    console.log(error)
                    ///上报
                    this.sendMessage('异常请重试')
                    this.close()
                }
            }
        }


    }
    async get_bind_acc(){
        if (this.is_close){
            try {
                var time=Date.parse(new Date) / 1e3
                var url='https://buyer.etette.com/buyer/base/main'
                var body=JSON.stringify({moneys2: 500})
                var options = {
                    'method': 'POST',
                    'url': url,
                    'headers': {
                        "app-plat": 3,
                        time: time,
                        uuid: this.uuid,
                        platform: "android",
                        version: "3556",
                        authkey: this.authkey,
                        sessionid: this.sessionid,
                        sign: this.Md5(url + time + this.uuid +this.sessionid + this.md5key + "3556"),
                        "User-Agent": 'Mozilla/5.0 (Linux; Android 10; CDY-AN90 Build/HUAWEICDY-AN90; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045710 Mobile Safari/537.36',
                        Referer: "https://b.etette.com/",
                        Origin: "https://b.etette.com",
                        'Content-Type': 'application/json'
                    },
                    body: body

                }

                while (1){
                    this.sendMessage('正在获取账号')
                    await this.sleep(10000)
                    var data=await this.send(options)
                    var res=JSON.parse(data.body)
                    console.log(res)

                    if(res.code===200){
                       if (res.data.userInfo.buyerPlats.length>0 &&res.data.userInfo.status===1) {
                           var all_acc=[]
                           for(var i in res.data.userInfo.buyerPlats){
                               if (res.data.userInfo.buyerPlats[i].status === 1){
                                   var type=''
                                   if (res.data.userInfo.buyerPlats[i].plat===1){
                                       type='淘宝'
                                   }else if (res.data.userInfo.buyerPlats[i].plat===2){
                                       type='京东'
                                   }else if (res.data.userInfo.buyerPlats[i].plat===2){
                                       type='拼多多'
                                   }
                                   var this_account = {
                                       accountType: res.data.userInfo.buyerPlats[i].plat,
                                       accountId: res.data.userInfo.buyerPlats[i].id,
                                       accountName: type +'-'+ res.data.userInfo.buyerPlats[i].name
                                   }
                                   this.able_acc=res.data.userInfo.buyerPlats[i].id
                                   all_acc.push(this_account)
                               }

                           }
                           this.sendUserList(all_acc)
                           if (this.useracc.length===0){
                               this.final_acc=all_acc
                           }else {
                               this.option.userValue.forEach(item => {
                                   if (this.able_acc.indexOf(item.accountId) > -1) {
                                       this.final_acc.push(item)
                                   }
                               })


                           }
                           console.log(this.final_acc)
                           if (this.final_acc.length===0){
                               this.sendMessage('没有可用账号')
                               this.close()
                               break
                           }

                            this.get_tasks()
                           break
                       }else {
                           this.sendMessage('没有账号或账号异常')
                           this.close()
                           break
                       }

                    }else {
                        if (res.error.indexOf("频率受到限制")>-1){
                            this.sendMessage(res.error,+'，休息一会儿...')
                            await this.sleep(10000)

                        }else if (res.error==='登录已失效'){
                            this.login()
                            break
                        }
                        else {
                            if (this.error_count < 10) {
                                this.error_count += 1
                                this.sendMessage(res.message)
                                ///上报

                            } else {
                                this.sendMessage("异常请重试")
                                ////shangbao
                                this.close()
                                break

                            }
                        }

                    }



                }

            }catch (error){
                if (this.is_close===true){
                    console.log(error)
                    ///上报
                    this.sendMessage('异常请重试')
                    this.close()
                }
            }


        }


    }
    async get_tasks(){
        if (this.is_close) {

            try {
                this.sendMessage('当前接单号'+this.final_acc[this.change_acc_index].accountName)
                var url
                await this.sleep(3000)
                while (1){
                this.sendMessage('正在接单')


               if (this.radioValue==='pay'){
                    url='https://buyer.etette.com/buyer/get_task'
               }else if(this.radioValue==='scan'){
                    url='https://buyer.etette.com/buyer/get_flowtask'
               }
                var body=this.encode({plat: this.final_acc[this.change_acc_index].accountType,
                    plat_id: this.final_acc[this.change_acc_index].accountId,
                    moneys2: 500,
                    page: 0,
                    limit: 15})
                var time=Date.parse(new Date)/ 1e3

                var options = {
                    'method': 'GET',
                    'url': url+'?'+body,
                    'headers': {
                        "app-plat": 3,
                        time: time,
                        uuid: this.uuid,
                        platform: "android",
                        version: "3556",
                        authkey: this.authkey,
                        sessionid: this.sessionid,
                        sign: this.Md5(url + time + this.uuid + this.sessionid + this.md5key + "3556"),
                        "User-Agent": 'Mozilla/5.0 (Linux; Android 10; CDY-AN90 Build/HUAWEICDY-AN90; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045710 Mobile Safari/537.36',
                        Referer: "https://b.etette.com/",
                        Origin: "https://b.etette.com",
                        'Content-Type': 'application/json'
                    }

                }




                    var res = await this.send(options)
                    res = JSON.parse(res.body)
                    console.log(res)

                    if (res.code===200){

                        console.log(res.data.list)
                        if (res.data.list.length>0){
                            for (var i in res.data.list){
                                var index=res.data.list.length-1-i
                                if (this.comission_max>=parseFloat(res.data.list[index].buyer_price) || parseFloat(res.data.list[index].buyer_price>=this.comission_min)){

                                    await this.accept_task(res.data.list[index],url)
                                    break
                                }


                            }

                        }else {
                            this.sendMessage('暂无任务')
                            if (this.apply_times>100){
                                this.apply_times=0
                                this.sendMessage('多次未获得任务，可能是账号问题，若没有请上报错误',true)
                            }else {
                                this.apply_times+=1
                            }

                            if (this.empty_times>20){

                                this.empty_times=0
                                if (this.final_acc.length>1){
                                    this.change_acc_index+=1
                                    if(this.change_acc_index>=this.final_acc.length  ){
                                        this.change_acc_index =0
                                    }
                                    this.sendMessage('接单号'+this.final_acc[this.change_acc_index].accountName)
                                }

                            }else {
                                this.empty_times+=1

                            }

                        }
                        await  this.sleep(this.time)
                    }else {
                        if (res.error.indexOf("完成")>-1) {

                            this.sendMessage('接单成功',true)
                            this.close()
                            break

                        } else if (res.error.indexOf("频率受到限制") > -1) {
                            this.sendMessage(res.error)
                            await this.sleep(10000)
                        } else if (res.error.indexOf("登录已失效") > -1) {
                            await this.sleep(1500)
                            this.login()
                            break
                        } else if (res.error.indexOf("未上传") > -1) {
                            this.sendMessage(res.error)
                            this.close()
                            break
                        } else if (res.error.indexOf("已达上限") > -1) {

                            this.sendMessage(this.final_acc[this.change_acc_index].accountName+'已接满，已自动换号')
                            this.final_acc.splice(this.change_acc_index,1)
                            if (this.final_acc.length===0){
                                this.sendMessage('没有可用接单号')
                                this.close()
                                break
                            }
                            await this.sleep(1500)


                        } else {
                            this.sendMessage(res.error)///shangbao
                            await this.sleep(this.time)
                        }
                    }



                }
            }catch (error){
                if (this.is_close===true){
                    console.log(error)
                    ///上报
                    this.sendMessage('异常请重试')
                    this.close()
                }
            }
        }
    }


    async accept_task(data,url){
        if (this.is_close){
            try {
                var body=JSON.stringify({
                    ids: data.ids,
                    plat: data.plat,
                    store_id: data.store_id,
                    mer_id: data.mer_id,
                    plat_id: this.final_acc[this.change_acc_index].accountId
                })
                var new_url=url+"/grab"
                var time=Date.parse(new Date)/ 1e3
                var options = {
                    'method': 'POST',
                    'url': new_url,
                    'headers': {
                        "app-plat": 3,
                        time: time,
                        uuid: this.uuid,
                        platform: "android",
                        version: "3556",
                        authkey: this.authkey,
                        sessionid: this.sessionid,
                        sign: this.Md5(new_url + time + this.uuid + this.sessionid + this.md5key + "3556"),
                        "User-Agent": 'Mozilla/5.0 (Linux; Android 10; CDY-AN90 Build/HUAWEICDY-AN90; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045710 Mobile Safari/537.36',
                        Referer: "https://b.etette.com/",
                        Origin: "https://b.etette.com",
                        'Content-Type': 'application/json'
                    },
                    body:body

                }
                await this.sleep(500)
                var res = await this.send(options)
                res = JSON.parse(res.body)
                console.log(res)
                if (res.code===200){
                    this.sendMessage('接单成功',true)
                    await this.get_details(res.data)

                }else{
                    this.sendMessage(res.error)
                }

            }catch (error){
                if (this.is_close===true){
                    console.log(error)
                    ///上报
                    this.sendMessage('异常请重试')
                    this.close()
                }
            }
        }

    }

    async get_details(data){
        if (this.is_close){
            try {
                var url="https://buyer.etette.com/buyer/task/"+data
                var time=Date.parse(new Date)/ 1e3
                var options = {
                    'method': 'GET',
                    'url': url,
                    'headers': {
                        "app-plat": 3,
                        time: time,
                        uuid: this.uuid,
                        platform: "android",
                        version: "3556",
                        authkey: this.authkey,
                        sessionid: this.sessionid,
                        sign: this.Md5(url + time + this.uuid + this.sessionid + this.md5key + "3556"),
                        "User-Agent": 'Mozilla/5.0 (Linux; Android 10; CDY-AN90 Build/HUAWEICDY-AN90; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045710 Mobile Safari/537.36',
                        Referer: "https://b.etette.com/",
                        Origin: "https://b.etette.com",
                        'Content-Type': 'application/json'
                    }

                }
                await this.sleep(1500)
                var res = await this.send(options)
                res = JSON.parse(res.body)
                console.log(res)

                if (res.code===200){
                    this.sendMessage('本金'+res.data.buyer_price+',佣金'+res.data.moneys)


                }else {
                    //shangbao

                }
                this.close()
            }catch (error){
                if (this.is_close===true){
                    console.log(error)
                    ///上报
                    this.sendMessage('异常请重试')
                    this.close()
                }
            }
        }
    }
    ////加密方式 后期放到安装包里，能从脚本直接调用
     Md5(e,t){
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
}

///此为 nodejs环境中 实例化运行，app端需更改
exec=new exec()
exec.login()
