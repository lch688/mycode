var request = require('request');
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
            'Content-Type': "application/json",
            'Accept': 'text/html, application/xhtml+xml, */*',
            'Referer':'http://49.233.32.148:9999/api',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',

        }
        this.time=60000
        this.error_count = 0
        this.empty_times = 0
        this.comission_min=0
        this.comission_max=9999

        this.is_close=true


        this.is_gaoyong=true

        this.user_acc=[]

    }
    intialization(){


        this.final_acc = []
        this.able_acc = []

    }




    sendMessage(message,top=false){
        console.log(message)
    }
    sendUserList(userList) {}

    sleep(ms){
        return new Promise(reslove=>setTimeout(reslove,ms))

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

    close(){
        this.is_close=false
    }
    async login(){
        if (this.is_close){
            try {
                this.intialization()

                var form={
                    mobile: "15853307708",
                    password: "0208058cjb18"
                }
                var  options = {
                    'method': 'POST',
                    'url': "http://mapi.gpjl.com.cn/api/user/login",
                    'headers': this.header,

                    form: form
                };
                    console.log(1)
                    var data=await this.send(options)

                    var res=JSON.parse(data.body)
                    console.log(res)
                    if (res.code===0){
                        this.header["Authorization"]=res.data
                        this.sendMessage('登录成功')
                        this.get_bind_acc()

                    }else {
                        if (res.msg==='用户名或密码错误'){
                            this.sendMessage(res.msg)
                        }else {
                            this.sendMessage(res.msg)  ///上报
                        }
                        this.close()
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
            var form={
                task_status:"0",
                page:"1",
                shenhao_status:"1"
            }
            var  options = {
                'method': 'POST',
                'url': "http://49.233.32.148:9999/api/buyer/taskList",
                'headers': this.header,

                form: form
            };

            var count=0
            while (count<3){
                await this.sleep(2000)
                var res=await this.send(options)
                res=JSON.parse(res.body)
                console.log(res)

                if (res.code===0){
                    if (res.data.list.length>0){


                        console.log(res.data.list)
                        for(var i in res.data.list){
                            if (res.data.list[i].title.indexOf('预售')===-1&&res.data.list[i].title.indexOf('隔天')===-1){
                                this.sendMessage('接单成功',true)
                                this.sendMessage("本金:"+res.data.list[i].spot+"佣金:"+res.data.list[i].commission,true)
                                this.close()
                                break
                            }
                        }


                    }
                    break
                }else {
                    count+=1
                    ///上报
                }

            }
        }
    }
    async get_bind_acc(){
        if (this.is_close){
            try {
                var form={}
                var  options = {
                    'method': 'POST',
                    'url': "http://49.233.32.148:9999/api/task/choose",
                    'headers': this.header,

                    form: form
                };
                this.sendUserList('正在获取账号')
                while (1){
                    await this.sleep(1000)
                    var res=await this.send(options)
                    res=JSON.parse(res.body)
                    console.log(res)
                    if (res.code===0){
                        if (res.data.length>0){
                            var all_acc=[]
                            for(var i in res.data){
                                if (res.data[i].auth_status===2 || res.data[i].auth_status_info==='已审核'){

                                    var this_acc={
                                        accountId: res.data[i].id,
                                        accountName:res.data[i].name
                                    }
                                    all_acc.push(this_acc)
                                    this.able_acc.push(res.data[i].id)

                                }
                            }
                            console.log(all_acc)
                            this.sendUserList(all_acc)
                            if (this.user_acc.length===0){
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
                            }
                            await this.set_acc()
                            await this.set_gaoyong()

                            this.apply_tasks()
                            break


                        }else {
                            this.sendMessage('没有账号')
                            this.close()
                            break
                        }
                    }else {
                        if (this.error_count < 10) {
                            this.error_count += 1
                            ////shangbao

                        } else {
                            this.sendMessage(res.msg)

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
    async set_gaoyong(){
        if (this.is_close){
            try {
                if (this.is_gaoyong===true){
                    var form={}
                    var  options = {
                        'method': 'POST',
                        'url': "http://49.233.32.148:9999/api/buyer/acceptPayAdvance",
                        'headers': this.header,

                        form: form
                    };
                    await this.sleep(500)
                    var res=await this.send(options)
                    res=JSON.parse(res.body)
                    console.log(res)
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

    async set_acc(){
        if(this.is_close){
            this.sendMessage('正在设置账号')
            for(var i in this.final_acc){
                this.sendMessage('设置账号'+this.final_acc[i].accountName)
                var form={
                    id:this.final_acc[i].accountId,
                    status:"1"
                }
                var  options = {
                    'method': 'POST',
                    'url': "http://49.233.32.148:9999/api/task/setZhanghao",
                    'headers': this.header,

                    form: form
                };
                var count=0
                while (count<3){
                    await this.sleep(1000)
                    var res=await this.send(options)
                    res=JSON.parse(res.body)
                    console.log(res)
                    if (res.code ===0){
                        break
                    }else {

                        if (res.msg.indexOf('已接满')>-1){
                            this.sendMessage(this.final_acc[i].accountName+'接满，已自动换号')
                            break
                        }else if (res.msg.indexOf('评')>-1){
                            this.sendMessage(res.msg)
                            this.close()
                            break
                        }
                        else {
                            //上报
                            count+1
                        }

                    }

                }

            }


        }

    }

    async apply_tasks(){
        if (this.is_close){
            try {
                this.sendMessage('正在接单')

                var form={
                    current_time:(new Date).getTime()
                }
                var  options = {
                    'method': 'POST',
                    'url': "http://49.233.32.148:9999/api/order/take",
                    'headers': this.header,

                    form: form
                };


                while (1){
                    await this.sleep(1000)
                    var res=await this.send(options)
                    res=JSON.parse(res.body)
                    console.log(res)
                    if (res.code===0) {
                        if (res.data.id>0){
                            if (this.comission_max<res.data.commission || res.data.commission<this.comission_min){
                                this.cancel_task(res.data.id)

                            }else {
                                this.accept_taks(res.data.mobile_price,res.data.commission,res.data.id,res.data.zhanghao)

                            }
                            break
                        }else {
                            if (res.msg.indexOf('频繁')>-1) {
                                this.sendMessage(res.msg+'休息一会儿.....')
                                await this.sleep(60000)
                            }else {
                                this.sendMessage('暂无任务')
                                this.empty_times+=1
                                if (this.empty_times>100){
                                    this.sendMessage('长时间未接到任务，可能是取消浏览单过多，或接单时间点问题',true)
                                    this.empty_times=0
                                }
                                await this.get_taskinfo()
                                await this.sleep(this.time)
                            }

                        }

                    }else {
                        if (res.msg==="暂无可用接单账号"){
                            this.sendMessage(res.msg)
                            this.close()
                            break
                        }else if (res.msg.indexOf('待操作')>-1){
                            this.sendMessage(res.msg)
                            this.close()
                            break
                        }else if (res.msg.indexOf('频繁')>-1) {
                            this.sendMessage(res.msg+'休息一会儿.....')
                            await this.sleep(60000)
                        }else if (res.msg.indexOf('评')>-1){
                            this.sendMessage(res.msg)
                            this.close()
                            break
                        } else {
                            this.sendMessage(res.msg)
                            ///上报
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

    async accept_taks(cost,commsion,orderid,zhanghao){
        if (this.is_close){
            try {
                var form={
                    zhanghao: zhanghao,
                    order_id: orderid
                }
                var  options = {
                    'method': 'POST',
                    'url': "http://49.233.32.148:9999/api/task/accept",
                    'headers': this.header,

                    form: form
                };


                    await this.sleep(1000)
                    var res=await this.send(options)
                    res=JSON.parse(res.body)
                    console.log(res)

                        if (res.code===0){

                            if (res.msg.indexOf('频繁')>-1) {
                                await this.sleep(this.time)
                                this.apply_tasks()


                            }else {
                                this.sendMessage('接单成功',true)
                                this.sendMessage("本金:"+cost+"佣金:"+commsion,true)
                                this.close()


                            }


                        }else {
                            ///上报
                            await this.sleep(this.time)
                            this.apply_tasks()

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
            var form={
                order_id:orerid
            }
            var  options = {
                'method': 'POST',
                'url': "http://49.233.32.148:9999/api/task/refuse",
                'headers': this.header,

                form: form
            };


            await this.sleep(1000)
            var res=await this.send(options)
            res=JSON.parse(res.body)
            console.log(res)
            if (res.code===0){
                if (res.msg.indexOf('频繁')>-1) {
                    this.sendMessage(res.msg+'休息一会儿.....')
                    await this.sleep(this.time)
                    this.apply_tasks()
                }else {
                    this.sendMessage('订单不符合要求，已取消，正在重新接单')
                    await this.sleep(this.time)
                    this.apply_tasks()
                }


            }else {
                await this.sleep(this.time)
                this.apply_tasks()
            }


        }
    }

}

a=new exec()
a.login()