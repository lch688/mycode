var request = require('request');
var CryptoJS=require('crypto-js');

var JSEncrypt=require('node-jsencrypt')


var exec = class {
    /** 构造函数 接收参数并开始执行脚本
     * @param {object} options 脚本需要的参数:
     * {int}      delay 脚本循环间隔(毫秒)
     * {object}   axios 请求对象
     * {object}   CryptoJS 加密对象
     * {function} sendMessage 回调
     */

    constructor() {
        this.name='xxj'
        // 回调

        // 计时器

        // 用户id 程序开始后于第二步自动获取

        // 每个步骤上一次请求时保留的参数 1对应第一步 2对应第二步 等等
        this.header = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html, application/xhtml+xml, */*',

            'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',
            'Referer':'http://23.224.87.75:8082'
        }
        this.url='http://23.224.87.75:8082'
        this.time=60000
        this.error_count = 0
        this.empty_times = 0
        this.cost_max=9999
        this.cost_min=0
        this.comission_min=0
        this.comission_max=9999

        this.is_close=true




        this.user_acc=[]

    }
    intialization(){

        this.change_acc_index=0
        this.final_acc = [{accountType: '京东', accountId: '155141', accountName: '京东-jj76081112(审核通过)'}]
        this.able_acc = []
        ',{accountType: \'京东\', accountId: \'122027\', accountName: \'京东-[降权]陈咻哄(审核通过)\'}'
        '136052'
    }
    AESDecrypt(e) {
        var t =CryptoJS.enc.Utf8.parse("Easyman-easyman3")
            , n =CryptoJS.enc.Utf8.parse("Easyman-easyman3")
            , r = CryptoJS.AES.decrypt(e, t, {
            iv: n,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
            , a = r.toString(CryptoJS.enc.Utf8);
        return a.toString()
    }
    AESEncrypt(e) {
        var t = CryptoJS.enc.Utf8.parse("Easyman-easyman3")
            , n = CryptoJS.enc.Utf8.parse("Easyman-easyman3")
            , r = CryptoJS.enc.Utf8.parse(e)
            , a =CryptoJS.AES.encrypt(r, t, {
            iv: n,
            mode: CryptoJS.mode.CBC,
            padding:CryptoJS.pad.Pkcs7
        });
        return a.toString()
    }



    sendMessage(message,top=false){
        console.log(message)
    }
    sendUserList(userList) {}

    sleep(ms) {
        if(this.is_close===false){
            throw new Error('停止运行')
        }


        return new Promise(reslove=>
            this.timer=setTimeout(reslove,ms))



    }
    encode(n, a) {
        var i = "";
        for (var e in n) i += encodeURIComponent(e) + "=" + ("gbk" == a ? t(n[e]) : encodeURIComponent(n[e])) + "&";
        return i.substring(0, i.lastIndexOf("&"))
    }

    GetUUid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(n) {
            var a = 16 * Math.random() | 0,
                i = "x" == n ? a : 3 & a | 8;
            return i.toString(16)
        }))
    }


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
    close() {
        this.is_close = false
        if(this.timer){
            clearTimeout(this.timer)
        }

        this.sendMessage('接单停止')

    }
    async login(){
        if (this.is_close){
            try {
                this.intialization()
                var form=this.encode({
                    UserName: "15169224398",
                    Password: "CXDCXD52138790.",
                    Captcha:''

                })
                var  options = {
                    'method': 'POST',
                    'url': this.url+'/login/Login',
                    'headers': {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'text/html, application/xhtml+xml, */*',

                        'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',
                        'Referer':'http://23.224.87.75:8082'
                    },

                    form:form
                };

                var data=await this.send(options)
                var res=JSON.parse(data.body)
                console.log(res)
                if (res.Code===0){
                    var cookie=data['caseless']['dict']['set-cookie'][0].split(";")
                    this.header['Cookie']=cookie[0]
                    console.log(this.header['Cookie'])
                    await this.get_bind_acc()
                    this.apply_tasks()

                }else {
                    if (res.Message==='用户不存在'){
                        this.sendMessage(res.Message)
                    }
                    else if (res.Message==='用户名或密码错误'){
                        this.sendMessage(res.Message)
                    }
                    else {
                        ///shangbao
                        this.sendMessage(res.Message)
                    }
                    this.close()
                }


            }catch (error) {
                if (this.is_close===true){
                    console.log(error)
                    ///上报
                    this.sendMessage('异常请重试')
                    this.close()
                }
            }
        }

    }
    async get_taskinfo(){
        if (this.is_close){
            try {


                var form = this.encode({
                    Page: 1,
                    PageSize: 10,
                    Status: "待操作",
                    Urge:false
                })
                var options = {
                    'method': 'POST',
                    'url': this.url+'/Ctr_DD/GetOrderList',
                    'headers': this.header,
                    form:form

                }
                var count=0
                while (count < 5){


                    await this.sleep(1000)
                    var res = await this.send(options)
                    res = JSON.parse(res.body)
                    console.log(res)

                    if (res.Code === 0 && res.Success === true){
                        if(res.Value.DataList.length > 0){
                            for(var i in res.Value.DataList) {
                                if (res.Value.DataList[i].TaskTypeName.indexOf('预售') === -1 && res.data.list[i].taskTypeName.indexOf('隔天') === -1) {
                                    this.sendMessage('接单成功')
                                    this.close()
                                    break

                                }
                            }
                        }
                        break
                    }else {
                        count+=1
                        this.sendMessage(res.Message)
                        ///shangbao

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
                
                var  options = {
                    'method': 'GET',
                    'url': this.url+'/Ctr_GetDD',
                    'headers':this.header,

                    
                };
                this.sendUserList('正在获取账号')

                await this.sleep(500)
                var res=await this.send(options)
                console.log(res.body)
                var html=res.body

                var DOM = new DOMParser
                var content = DOM.parseFromString(html, "text/html")
                var text = content.querySelector("#_body")
                var decrypt_text = this.AESDecrypt(text.innerText.trim())
                var new_text= DOM.parseFromString(decrypt_text, "text/html")
                var account = new_text.querySelectorAll(".accountlist .cell-item")

                var all_bind_acc=[]
                if (account.length>0){

                    for(var i = 0; i < account.length; i++){
                        var single_acc=account[i]
                        if(single_acc.innerHTML.indexOf("审核通过")>-1){
                            var type=""
                            var acc_type=single_acc.querySelector("img").getAttribute("src")
                            if(acc_type==="/Content/images/platform/0.png"){
                                type="淘宝"
                            }
                            else if ("/Content/images/platform/1.png"){
                                type="京东"
                            }
                            else if ("/Content/images/platform/2.png"){
                                type="拼多多"
                            }
                            else if ("/Content/images/platform/3.png"){
                                type="抖音"
                            }
                            var acc_name_str=single_acc.querySelector(".shopname").innerText.trim()
                            var str=acc_name_str.replace(/[\r\n]/g,"")
                            var new_str=str.replace(/\s/g,"");

                            var this_acc={
                                accountType: type,
                                accountId: single_acc.querySelector("input").getAttribute("value"),
                                accountName: type+"-"+new_str
                            }
                            all_bind_acc.push(this_acc)

                            if (this.option.radioValue==="pay"){

                                var allow_order=single_acc.querySelector('span[title="已接量"]')
                                var already_order=single_acc.querySelector('span[title="可接量"]')

                                if (allow_order.innerText.trim()!==already_order.innerText.trim()){

                                    this.able_acc.push(this_acc.accountId)
                                }else {
                                    this.option.userValue.forEach(item => {
                                        if (item.accountId === this_acc.accountId) {//zhiding
                                            this.sendMessage(this_acc.accountName+ '接满，已自动换号',top=true)
                                        }
                                    })
                                }
                            }

                            var show=single_acc.querySelector(".tip")
                            var show_str=show.innerText.replace(/\s/g,"");
                            var new_show_str=show_str.replace(/[\r\n]/g,"");
                            this.sendMessage("接单号"+new_str)
                            this.sendMessage(new_show_str)




                        }
                    }

                    this.sendUserList(all_bind_acc)
                    if (this.option.userValue.length===0&&this.able_acc.length===0){
                        this.final_acc=all_bind_acc
                    }else {
                        if (this.option.userValue.length === 0) {
                            all_bind_acc.forEach(item => {
                                if (this.able_acc.indexOf(item.accountId) > -1) {
                                    this.final_acc.push(item)
                                }
                            })
                        }else if (this.able_acc.length === 0){
                            this.final_acc=this.option.userValue
                        }else {
                            this.option.userValue.forEach(item => {
                                if (this.able_acc.indexOf(item.accountId) > -1) {
                                    this.final_acc.push(item)
                                }
                            })
                        }
                    }

                    if(this.final_acc.length<0){

                        this.sendMessage("无可用接单号")
                        this.close()
                        ///停
                    }else {


                        await this.apply_taks()


                    }
                }else {
                    this.sendMessage('没有账号')
                    this.close()
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

    async apply_tasks(){
        if (this.is_close){
            try {
                ////136052,122027

                this.sendMessage('当前接单号'+this.final_acc[this.change_acc_index].accountName)
                await this.sleep(1000)
                this.sendMessage('正在接单')
                while (1){

                var form=this.encode({
                    id:this.final_acc[this.change_acc_index].accountId ,
                    taskType: "pay",///this.option.radioValue,    ///                                                                            ///例 用户选择淘宝 京东 ，用户有2个淘宝种类账号，1个京东种类账号，1个拼多多种类账号 （且这些账号全部被用户选择） 我们就每次发送依次使用2个淘宝账号的id，和一个京东账号的id
                    captcha: '',
                    refundType: "all"

                })
                var  options = {
                    'method': 'POST',
                    'url': this.url+'/Ctr_GetDD/JD',
                    'headers': this.header,

                    form:form
                };


                var res=await this.send(options)
                res=JSON.parse(res.body)
                console.log(res)

                if (res.Code===0) {
                   if (res.Value!==null){
                       var judge=await this.is_abort(res)
                       if (judge===true){
                           await this.save_task(res)
                       }else {
                           await this.cancel_task(res.Value.TaskId)
                       }

                   }else {
                       this.sendMessage(res.Message)
                       if (res.Message.indexOf('只能接一次')>-1){
                           await this.sleep(10000)
                       }else if (res.Message.indexOf("登录") >-1 ) {
                           this.login()
                           break
                       }else {


                           this.apply_times+=1
                           if (this.apply_times===150&&this.abort_times===10){
                               this.apply_times=0
                               this.abort_times=0
                               this.sendMessage('长时间未接到单，可能是取消次数过多',true)
                           }
                           if (this.final_acc.length>0){
                               if (this.empty_times>2 ) {
                                   this.empty_times=0
                                   this.change_acc_index+=1
                                   if(this.change_acc_index>=this.final_acc.length  ){
                                       this.change_acc_index =0
                                   }
                                   this.sendMessage('当前接单号'+this.final_acc[this.change_acc_index].accountName)


                               }else {
                                   this.empty_times+=1
                               }
                           }
                       }
                   }

                }else {
                    if (res.Message.indexOf("登录") >-1 ) {
                        this.login()
                        break
                    }else{
                        this.sendMessage(res.Message)
                        ///shangbao
                    }
                }

                this.get_taskinfo()
                await this.sleep(this.time)
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
    async is_abort(res){
        var judge=true
        if (this.cost_max<res.Value.PostFee|| res.Value.PostFee<this.cost_min){
            judge=false
        }
        if (this.comission_max<res.Value.CommissionFee|| res.Value.CommissionFee<this.comission_min){
            judge=false
        }
        return judge
    }

    async save_task(data){
        try {


            var form=this.encode({
                id: this.final_acc[this.change_acc_index].accountId,///id 的值为第五步请求用的用户账号id
                orderId: data.Value.Id ///通过返回值["Value"]['Id']获取orderid
            })
            var  options = {
                'method': 'POST',
                'url': this.url+'/Ctr_GetDD/SaveReceiptOrder',
                'headers': this.header,
                form:form

            }
            await this.sleep(1000)
            var res = await this.send(options)
            res = JSON.parse(res.body)
            console.log(res)
            if (res.Success === true && res.Code ===0){
                this.sendMessage('接单成功',true)
                this.sendMessage('本金'+res.Value.PrincipalFeeTxt+'佣金'+res.Value.CommissionFee,true)
                this.close()
            }else {
                ///上报res.Message
                this.sendMessage('暂无任务')
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
    async cancel_task(orderid){
        if (this.is_close){
            var form={
                id: this.final_acc[this.change_acc_index].accountId,
                taskid: orderid
            }
            var options = {
                'method': 'POST',
                'url': this.url+'/Crt_GetDD/refuseOrder',
                'headers': this.header,

                form: form
            }


            await this.sleep(1000)
            var res=await this.send(options)
            res=JSON.parse(res.body)
            console.log(res)
            if (res.code===0){

                this.sendMessage('订单不符合要求，已取消，正在重新接单')

            }else {
                this.sendMessage('暂无任务')
                ///shangbao
            }


        }
    }

}
a=new exec()
a.login()