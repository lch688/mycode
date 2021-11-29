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
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html, application/xhtml+xml, */*',

            'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',

        }
        this.time=60000
        this.error_count = 0
        this.empty_times = 0
        this.cost_max=9999
        this.cost_min=0
        this.comission_min=0
        this.comission_max=9999
        this.change_acc_index=0
        this.is_close=true




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
                    UserName: "15853307708",
                    Password: "0208058cjb18",
                    Captcha:''

                })
                var  options = {
                    'method': 'POST',
                    'url': 'http://buyer.huiju118.com/Webapp/login/lAct',
                    'headers': {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'text/html, application/xhtml+xml, */*',
                        'Referer':'http://buser.huiju118.com/login/Login'


                    },

                    form:form
                };

                var data=await this.send(options)
                var res=JSON.parse(data.body)
                console.log(res)
                if (res.code===0){

                    this.header['Cookie']=data['caseless']['dict']['set-cookie'][0].split(";")
                    this.header['user-id']=res.data.user_info.user_id
                    this.header['user-token']=res.data.user_info.user_token
                    this.get_bind_acc()

                }else {
                    if (res.msg==='登录帐号不能空'){
                        this.sendMessage(res.msg)
                    }
                    else if (res.msg==='登录账号与密码不匹配'){
                        this.sendMessage(res.msg)
                    }
                    else if (res.msg==='登录密码不能空'){
                        this.sendMessage(res.msg)
                    }
                    else {
                        ///shangbao
                        this.sendMessage(res.msg)
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


            var form={
                Page: 1,
                PageSize: 10,
                Urge: "False",
                Status: "2"
            }
                var  options = {
                    'method': 'POST',
                    'url': 'http://buyser.huijubd.com/Webapp/Order/getOrderList',
                    'headers':this.header,

                    form:form
                };

            var count=0
            while (count<3){
                await this.sleep(500)
                var res=await this.send(options)
                res=JSON.parse(res.body)
                console.log(res)

                if (res.code===0){
                    if (res.data.DataList.length>0){





                    this.sendMessage("本金:"+res.data.DataList[0].task_fee+",佣金:"+res.data.DataList[0].user_commission,true)
                    this.close()
                    break



                    }
                    break
                }else {

                        count+=1

                    ///上报
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
                var form={
                    page:'1',
                    PageSize:'10',
                    is_return_order_remind:'1'
                }
                var  options = {
                    'method': 'POST',
                    'url': 'http://buyser.huijubd.com/Webapp/account/getList',
                    'headers':this.header,

                    form:form
                };
                this.sendUserList('正在获取账号')
                while (1){
                    await this.sleep(500)
                    var res=await this.send(options)
                    res=JSON.parse(res.body)
                    console.log(res)
                    if (res.code===0){
                        console.log(res.data.DataList)
                        if (res.data.DataList.length>0){
                            var all_acc=[]
                            for(var i in res.data.DataList){
                                if (res.data.DataList[i].status_map === '审核通过' || res.data.DataList[i].status===2){
                                    var this_account = {
                                        accountType:res.data.DataList[i].account_type_name,
                                        accountId: res.data.DataList[i].account_id,
                                        accountName: res.data.DataList[i].account_type_name+'-'+res.data.DataList[i].account_name
                                    }
                                    all_acc.push(this_account)
                                    if (res.data.DataList[i].day_use_order_total < res.data.DataList[i].day_order_total){
                                        this.able_acc.push(res.data.DataList[i].account_id)
                                    }else {
                                        this.option.userValue.forEach(item => {
                                            if (item.accountId === res.data.DataList[i].account_id) {//zhiding
                                                this.sendMessage(this_account.accountName+ '接满，已自动换号',true)
                                            }
                                        })
                                    }
                                }
                            }
                            this.sendUserList(all_acc)
                            if (this.user_acc.length === 0) {
                                all_acc.forEach(item => {
                                    if (this.able_acc.indexOf(item.accountId) > -1) {
                                        this.final_acc.push(item)
                                    }
                                })
                            } else {
                                this.option.userValue.forEach(item => {
                                    if (this.able_acc.indexOf(item.accountId) > -1) {
                                        this.final_acc.push(item)
                                    }
                                })
                            }
                            if (this.final_acc.length < 1) {
                                this.sendMessage("没有可用接单号")
                                this.close()


                            } else {
                                console.log(this.final_acc)

                                this.apply_tasks()




                            }
                            break



                        }else {
                            this.sendMessage('没有账号')
                            this.close()
                            break
                        }
                    }else {
                        if (res.msg === "请先登录") {
                           this.login()
                            break
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

                this.sendMessage('当前接单号'+this.final_acc[this.change_acc_index].accountName)
                while (1){

                var form={
                    accountId: this.final_acc[this.change_acc_index].accountId
                }
                var options = {
                    'method': 'POST',
                    'url': 'http://buyser.huijubd.com/Webapp/receiptTask/getReceiptOrder',
                    'headers': this.header,

                    form: form

                }

                await this.sleep(1000)
                this.sendMessage('正在接单')



                    var res=await this.send(options)
                    res=JSON.parse(res.body)
                    console.log(res)
                    if (res.code===0) {
                        if (res.data.Id!==undefined){
                            if (this.cost_max<res.data.PrincipalFeeTxt|| res.data.PrincipalFeeTxt<this.cost_min ||this.comission_max<res.data.CommissionFee|| res.data.CommissionFee<this.comission_min){
                                await this.cancel_task(res.data.TaskId)
                            }else {
                                await this.accept_taks(res.data.PrincipalFeeTxt,res.data.CommissionFee,res.data.TaskId)
                            }

                        }else {
                            this.sendMessage('暂无任务')
                            await this.change_acc()

                        }

                    }else {
                        if (res.msg === "请先登录") {
                            this.login()
                            break
                        }else if (res.msg.indexOf('待操作')>-1) {
                            this.sendMessage('接单成功', true)
                            this.get_taskinfo()

                            break
                        }else if (res.msg.indexOf('一次')>-1){
                            this.sendMessage('暂无任务')
                            await this.sleep(5000)

                        }else if (res.msg.indexOf('待评价')>-1){
                            this.sendMessage(res.msg,true)
                            this.close()
                            break
                        }else if (res.msg.indexOf('没有找到')>-1){
                            this.sendMessage(res.msg)
                            await this.change_acc()

                        }
                        else{
                            this.sendMessage(res.msg)
                            ///shangbao
                        }
                    }
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
    change_acc(){
        if (this.is_close){
            try {
                if(this.empty_times>20){
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

    async accept_taks(cost,commsion,orderid){
        if (this.is_close){
            try {
                var form={
                    id: this.final_acc[this.change_acc_index].accountId,
                    taskid: orderid
                }
                var options = {
                    'method': 'POST',
                    'url': 'http://buyser.huijubd.com/Webapp/receiptTask/saveReceiptOrder',
                    'headers': this.header,

                    form: form
                }


                await this.sleep(1000)
                var res=await this.send(options)
                res=JSON.parse(res.body)
                console.log(res)

                    if (res.code===0){
                        this.sendMessage('接单成功', true)
                        this.sendMessage("本金:"+cost+",佣金:"+commsion,true)
                        this.close()

                    }else {
                        ///上报

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
    async cancel_task(orderid){
        if (this.is_close){
            var form={
                id: this.final_acc[this.change_acc_index].accountId,
                taskid: orderid
            }
            var options = {
                'method': 'POST',
                'url': 'http://buyser.huijubd.com/Webapp/receiptTask/refuseOrder',
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
                ///shangbao
            }


        }
    }

}
a=new exec()
a.login()