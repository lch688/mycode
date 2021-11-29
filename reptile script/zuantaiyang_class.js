var request = require('request');

///此为nodejs中用的 加密库，需要封装到app安装包，或放倒统一的js文件，脚本可以向以下一样可以在app端直接调用加密就行（加密库会有好几种，需要什么都封装起来），加密调用在 426
var JSEncrypt=require('node-jsencrypt')


var zty = class {


    constructor() {


        this.header = {
            'X-Requested-With': 'com.app.zty',
            'Content-Type': "application/x-www-form-urlencoded",
            "Host":"app.w123w123.com:17008",
            'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',
        }
        this.time=6000
        this.error_count = 0
        this.apply_times = 0
        this.empty_times = 0
        this.comission_min=0
        this.comission_max=9999
        this.cost_min=0
        this.cost_max=9999
        this.is_close=true
        this.is_liulan=true
        this.huofan=true
        this.shenhe=true


        this.user_acc=[]

    }
    intialization(){

        this.change_acc_index=0
        this.final_acc = []
        this.able_acc = []
        this.taobao_acc=[]
        this.send_acc = ['0', '0', '0', '0']
    }




    getFormData() {
        return this.formData
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
    close() {
        this.is_close =false
        if(this.timer){
            clearTimeout(this.timer)
        }
        this.options.closed()
        this.sendMessage('接单停止')

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

    start(option) {
        console.log(option)
        this.option=option


        this.before_login()
    }

    async login(){
        if (this.is_close){
            try {
                this.intialization()
                var form={
                    cellphone: "15853307708",
                    password: "0208058cjb18",
                    verify: "",
                    system_type: "android",
                    ver:"3.0.0.202106090",
                    ip_mac: "865166028236662"
                }
                var  options = {
                    'method': 'POST',
                    'url': "http://app.w123w123.com:17008/api/member/login.html",
                    'headers': this.header,

                    form: form
                };
                while (1){
                    var data=await this.send(options)
                    var res=JSON.parse(data.body)
                    console.log(res)
                    if (res.code===0){
                        this.token=res.data
                        var cookie=data.caseless.dict['set-cookie'][0].split(";")
                        console.log(cookie)
                        this.header['Cookie']=cookie
                        await this.get_taskinfo()
                        this.get_bind_acc()
                        break
                    }else {
                        if (res.msg==='手机号码格式不正确'){
                            this.sendMessage(res.msg)
                            this.close()
                            break
                        }
                        else if (res.msg==='手机号或者密码错误'){
                            this.close()
                            break
                        }else {
                            if (this.error_count < 10) {
                                this.error_count += 1
                                this.sendMessage(res.message)

                            } else {
                                this.sendMessage("异常请重试")
                                ////shangbao
                                this.close()
                                break

                            }
                        }
                    }
                }

            }catch (e) {
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
            var body=this.encode({
                status:"2",
                page:"1",
                verify:this.token,
                ver:"3.0.0.202106090"
            })
            var  options = {
                'method': 'GET',
                'url': "http://app.w123w123.com:17008/api/order/getMyOrderList?"+body,
                'headers': this.header,


            };
            var count=0
            while (count<3){
                await this.sleep(500)
                var res=await this.send(options)
                res=JSON.parse(res.body)
                console.log(res)
                if (res.code===0){
                    if (res.data.data.length>0){
                        console.log(res.data.data)
                        for(var i in res.data.data){
                            if (res.data.data[i].ordertype[0].indexOf('预售')===-1&&res.data.data[i].ordertype[0].indexOf('隔天')===-1){
                                this.sendMessage('接单成功',true)
                                this.sendMessage("本金:"+res.data.data[i].buyprice+"佣金:"+res.data.data[i].commission,true)
                                this.close()
                                break
                            }
                        }
                    }
                    break
                }else {
                    count+=1
                }

            }
        }
    }
    async get_bind_acc(){
        if (this.is_close){
            try {
                var body=this.encode({
                    verify:this.token,
                    ver:"3.0.0.202106090"
                })
                var  options = {
                    'method': 'GET',
                    'url': "http://app.w123w123.com:17008/api/member/platform?"+body,
                    'headers': this.header,


                };
                while (1){
                    await this.sleep(500)
                    var res=await this.send(options)
                    res=JSON.parse(res.body)
                    console.log(res)
                    if (res.code===0){
                        this.sendMessage('正在获取账号')
                        if (res.data.length>0) {

                            var all_bind_acc = []
                            for (var i in res.data) {
                                if (res.data[i].status === 1) {
                                    var type = ''
                                    if (res.data[i].type === 1) {
                                        type = "淘宝"
                                    } else if (res.data[i].type === 2) {
                                        type = "拼多多"
                                    } else if (res.data[i].type === 3) {
                                        type = "京东"
                                    } else if (res.data[i].type === 3){
                                        type='抖音'
                                    }

                                    var this_acc = {
                                        accountType: type,
                                        accountId: res.data[i].id,
                                        accountName: type + "-" + res.data[i].account
                                    }
                                    all_bind_acc.push(this_acc)
                                    if (this.is_liulan === false) {
                                        var num = res.data[i]['accept_num'].split("/")
                                        if (num[0] < num[1]) {
                                            this.able_acc.push(res.data[i].id)
                                        } else {
                                            this.option.userValue.forEach(item => {
                                                if (item.accountId === res.data[i].id) {//zhiding
                                                    this.sendMessage(res.data[i].account + '接满，已自动换号', true)
                                                }
                                            })
                                        }
                                    }


                                }

                            }
                            this.sendUserList(all_bind_acc)
                            if (this.user_acc.length === 0 && this.able_acc.length === 0) {
                                this.final_acc = all_bind_acc
                            } else {
                                if (this.user_acc.length === 0) {
                                    all_bind_acc.forEach(item => {
                                        if (this.able_acc.indexOf(item.accountId) > -1) {
                                            this.final_acc.push(item)
                                        }
                                    })
                                } else if (this.able_acc.length === 0) {
                                    this.final_acc = this.option.userValue
                                } else {
                                    this.option.userValue.forEach(item => {
                                        if (this.able_acc.indexOf(item.accountId) > -1) {
                                            this.final_acc.push(item)
                                        }
                                    })
                                }
                            }
                            console.log(this.final_acc)
                            if (this.final_acc.length<1){
                                this.sendMessage('没有可用接单号')
                                this.close()
                                break

                            }
                            for(var i in this.final_acc){
                                if (this.final_acc[i]['accountType']==='淘宝'){
                                    this.taobao_acc.push(this.final_acc[i])
                                    if (this.send_acc[0]==='0'){
                                        this.send_acc[0]=this.final_acc[i]['accountId']
                                        this.sendMessage('当前接单号:'+this.final_acc[i]['accountName'])
                                    }

                                }else if (this.final_acc[i]['accountType']==='京东'){
                                    if (this.send_acc[1]==='0'){
                                        this.send_acc[1]=this.final_acc[i]['accountId']
                                    }

                                }else if (this.final_acc[i]['accountType']==='拼多多') {
                                    if (this.send_acc[2] === '0') {
                                        this.send_acc[2] = this.final_acc[i]['accountId']
                                    }
                                }else if (this.final_acc[i]['accountType']==='抖音') {
                                    if (this.send_acc[3] === '0') {
                                        this.send_acc[3] = this.final_acc[i]['accountId']
                                    }
                                }
                            }
                            console.log(this.send_acc)
                            await this.set_acc('open')
                            this.apply_tasks()

                        }else {
                            this.sendMessage('没有接单号')

                        }
                        break
                    }else {
                        if (this.error_count < 10) {
                            this.error_count += 1
                            this.sendMessage(res.message)

                        } else {
                            this.sendMessage("异常请重试")
                            ////shangbao
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

    async set_acc(judge){
        if(this.is_close){
            this.sendMessage('正在设置账号')

                var is_close

                if (judge==="close"){
                    is_close='0'
                    var close_id=this.send_acc[0]
                    this.send_acc=[]
                    this.send_acc.push(close_id)

                }else if (judge==='open'){
                    is_close='1'

                }
                var new_send=this.send_acc.filter((item)=>{
                    return item!=="0";
                })
                console.log(new_send)

                for(var z=0;z<new_send.length;z++){
                    var body=this.encode({
                        id: new_send[z],
                        isaccept: is_close,
                        ver: "3.0.0.202106090",
                        verify: this.token
                    })
                    var  options = {
                        'method': 'GET',
                        'url': "http://app.w123w123.com:17008/api/member/platform_isaccept"+"?"+body,
                        'headers': this.header
                    };

                    var count=0
                    while (count<3){

                        await this.sleep(500)
                        var res=await this.send(options)
                        res=JSON.parse(res.body)
                        console.log(res)
                        if (res.code===0){
                            break
                        }else {
                            count+=1
                        }
                    }

                }


        }

    }
    async get_auth(judge,orderid){
        if (this.is_close){
            try {
                var uuid=this.GetUUid().substring(0, 8)
                var bodys=this.encode({
                    uuid: uuid,
                    ver: "3.0.0.202106090",
                    verify: this.token
                })
                console.log(uuid)
                var  options = {
                    'method': 'GET',
                    'url': "http://app.w123w123.com:17008/api/order/getAuth?"+bodys,
                    'headers': this.header
                };
                while (1){
                    await this.sleep(500)
                    var res=await this.send(options)
                    res=JSON.parse(res.body)
                    console.log(res)
                    if (res.code===0){
                        var data_arr=[]
                        var secure=new JSEncrypt
                        var key=JSON.stringify({
                            encrypt: res.data.unique_key
                        })
                        secure.setPublicKey("-----BEGIN PUBLIC KEY-----" + res.data.public_key + "-----END PUBLIC KEY-----")
                        var auth=secure.encrypt(key)
                        if (judge==='apply'){
                            data_arr[0]=auth
                            data_arr[1]=uuid
                            return data_arr

                        }else if (judge==='accept')
                            var data=JSON.stringify({
                                orderid: orderid
                            })

                            data_arr[0]=auth
                            data_arr[1]=uuid
                            data_arr[2]=secure.encrypt(data)
                            return data_arr

                    }else {
                        if (this.error_count < 10) {
                            this.error_count += 1
                            this.sendMessage(res.message)

                        } else {
                            this.sendMessage("异常请重试")
                            ////shangbao
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
                //上报
            }
        }

    }

    async apply_tasks(){
        if (this.is_close){
            try {
                this.sendMessage('正在接单')
                var auth_uuid=await this.get_auth('apply')
                console.log(auth_uuid)
                var body=this.encode({
                    token: auth_uuid[0],
                    uuid: auth_uuid[1],
                    ver: "3.0.0.202106090",
                    verify: this.token
                })
                var  options = {
                    'method': 'GET',
                    'url': "http://app.w123w123.com:17008/api/order/acceptV2"+"?"+body,
                    'headers': this.header
                };
                while (1){
                    var res=await this.send(options)
                    res=JSON.parse(res.body)
                    console.log(res)
                    if (res.code===0){
                        if (res.data.accept_code===0){
                            var judge=await this.is_cancel(res)
                            if (judge===true){
                                this.accept_taks(res.data.buyprice,res.data.commission,res.data.orderid)
                            }else {
                                this.cancel_task(res.data.orderid)
                            }
                            break
                        }else {
                            this.sendMessage(res.data.msg)

                            if (this.taobao_acc>1){
                                if (this.empty_times>50 ) {
                                    await this.set_acc('close')
                                    this.empty_times=0
                                    this.change_acc_index+=1
                                    if(this.change_acc_index>=this.taobao_acc.length  ){
                                        this.change_acc_index =0
                                    }
                                    this.send_acc[0]=this.taobao_acc[this.change_acc_index].accountId
                                    await this.set_acc('open')
                                    this.sendMessage('接单号'+this.taobao_acc[this.change_acc_index].accountName)
                                    this.sendMessage('正在接单')



                                }else {
                                    this.empty_times+=1
                                }
                            }
                            await this.sleep(this.time)
                        }
                    }else {
                        if (res.msg==='休息一下'){
                            await this.sleep(10000)
                        }else {
                            if (this.error_count < 10) {
                                this.error_count += 1
                                this.sendMessage(res.message)

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
    async is_cancel(res){
        if (this.is_close){
            try {
                var judge=true
                if (this.huofan === false && res.data.isrefundaferconfirm === 1){
                    judge=false
                }
                if (this.shenhe === false && res.data.isneedselleraudit === 1){
                    judge=false
                }
                if (this.is_liulan === false && res.data.tasktype === 100){
                    judge=false
                }
                if (this.cost_max<res.data.buyprice||res.data.buyprice<this.cost_min){
                    judge=false
                }
                if (this.comission_max<res.data.commission || res.data.commission<this.comission_min){
                    judge=false
                }
                return judge
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
    async accept_taks(cost,commsion,orderid){
        if (this.is_close){
            try {
                var data_arr=await this.get_auth('accept',orderid)
                console.log(data_arr)
                var body = this.encode({
                    token: data_arr[0],
                    data: data_arr[2],
                    uuid: data_arr[1],
                    ver: "3.0.0.202106090",
                    verify: this.token
                })
                var  options = {
                    'method': 'GET',
                    'url': "http://app.w123w123.com:17008/api/order/sureOrderV2"+"?"+body,
                    'headers': this.header
                };
                var count=0
                while (1){
                    await this.sleep(1000)
                    var res=await this.send(options)
                    res=JSON.parse(res.body)
                    console.log(res)
                    if (res.code===0){
                        this.sendMessage('接单成功',true)
                        this.sendMessage("本金:"+cost+"佣金:"+commsion,true)
                        this.close()
                        break
                    }else {
                        if (count<3){
                            count+=1
                        }else {
                            this.sendMessage('确认接单失败，已重新接单')
                            this.apply_tasks()
                            break
                        }
                    }
                }



            }catch(error) {
                if (this.is_close===true){
                    console.log(error)
                    ///上报
                    this.sendMessage('异常请重试')
                    this.close()
                }
            }

        }
    }
    async cancel_task(orerid){
        if (this.is_close){
            var body=this.encode({
                orderid: orerid,///new_data['data']['orderid'],
                ver: "3.0.0.202106090",
                verify: this.token
            })
            var  options = {
                'method': 'GET',
                'url': "http://app.w123w123.com:17008/api/order/noOrder"+"?"+body,
                'headers':this.header
            };


                await this.sleep(1000)
                var res=await this.send(options)
                res=JSON.parse(res.body)
                console.log(res)
                if (res.code===0){
                    this.sendMessage('订单不符合要求，已取消，正在重新接单')
                    this.apply_tasks()

                }else {
                        this.apply_tasks()
                    }


        }
    }

}

zty=new zty()
zty.login()