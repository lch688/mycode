var request = require('request');
var mqw = class {
    /** 构造函数 接收参数并开始执行脚本
     * @param {object} options 脚本需要的参数:
     * {int}      delay 脚本循环间隔(毫秒)
     * {object}   axios 请求对象
     * {object}   CryptoJS 加密对象
     * {function} sendMessage 回调
     */
    constructor() {

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
        this.is_close=true
        this.time=3000
        this.url="http://sk.hlcmj.cn"
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
        this.radio="1"
        this.palt
        this.useracc=[]

    }
    intialization(){

        this.change_acc_index=0
        this.final_acc = []
        this.able_acc = []
        this.send_acc = ['0', '0', '0', '0', '0']
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
                var form=this.encode({
                    userName: "15853307708",
                    passWord: "0208058cjb18",
                    mobile: "",
                    picCode: "",
                    smsCode: "",
                    loginType: "1",
                    roleType: "1"
                })
                var  options = {
                    'method': 'POST',
                    'url': this.url+'/api/account/userlogin',
                    'headers': this.header,

                    form: form
                };
                while (1){
                    var data=await this.send(options)
                    var res=JSON.parse(data.body)
                    console.log(res)
                    if (res.code===0){
                        var cookie=data.caseless.dict['set-cookie'][0].split(";")
                        this.header['Cookie']=cookie[0]
                        this.sendMessage('登录成功')
                        this.get_bind_acc()
                        break
                    }else {
                        if (res.msg==='用户名或者密码错误!'){
                            this.sendMessage(res.msg)
                        }else if (res.msg.indexOf('审核')>-1){
                            this.sendMessage(res.msg)
                        }
                        else {
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
                console.log(error)
            }
        }


    }
    async get_bind_acc(){
        if (this.is_close){
            try {
                if (this.radio==="1"){
                    this.palt='淘宝'
                }else if (this.radio==="2"){
                    this.palt='京东'
                }else if (this.radio==="3"){
                    this.palt='拼多多'
                }


                var body=this.encode({
                    platformId: 1,///this.options.radio
                    page: 1,
                    limit: 10,
                    field: "Id"
                })
                var  options = {
                    'method': 'GET',
                    'url': this.url+'/Api/Account/GetBuyAccountList?'+body,
                    'headers':this.header

                };
                this.sendMessage('正在获取账号')
                while (1){
                    await this.sleep(500)
                    var res=await this.send(options)

                    console.log(res)
                    if (res.code===0){
                        if (res.list.length>0){
                            var all_bind_acc=[]
                            var all_bind_id=[]
                            for (var i in res.list){
                                if (res.list[i].State==='审核通过'){
                                    var this_acc={
                                        accountType: this.palt,
                                        accountId: res.list[i].Id,
                                        accountName: this.palt+ "-" + res.list[i].Account
                                    }
                                    all_bind_id.push(res.list[i].Id)
                                    all_bind_acc.push(this_acc)
                                }
                            }
                            console.log(all_bind_acc)
                            this.sendUserList(all_bind_acc)
                            if (this.useracc.length===0){
                                this.final_acc=all_bind_acc
                            }else {
                                if (this.option.userValue[0].accountType===this.palt){
                                    this.option.userValue.forEach(item => {
                                        if (all_bind_id.indexOf(item.accountId) > -1) {
                                            this.final_acc.push(item)
                                        }
                                    })
                                }else {
                                    this.final_acc=all_bind_acc
                                }
                            }
                            console.log(this.final_acc)
                            if (this.final_acc.length<1){
                                this.sendMessage('没有可用账号')
                                this.close()
                            }
                            this.get_order()

                        }else {
                            this.sendMessage('没有账号')
                            this.close()
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
                console.log(error)
            }


        }


    }
    async get_order(){
        if (this.is_close) {

            try {

                this.sendMessage('当前接单号'+this.final_acc[this.change_acc_index].accountName)
                var body = this.encode({
                    platformId: '1',
                    state: 2,
                    page: 1,
                    limit: 10
                })
                var options = {
                    'method': 'GET',
                    'url': this.url + '/Api/TaskMoney/GetTaskList?' + body,
                    'headers': this.header
                };
                this.sendMessage('正在接单')
                var count = 0
                while (count === 0) {
                    await this.sleep(this.time)
                    this.sendMessage('暂无任务')
                    var res = await this.send(options)
                    res = JSON.parse(res.body)
                    console.log(res)
                    if (res.code === 0) {
                        if (res.list.length > 0) {
                            for (var i in res.list) {
                                if (res.list[i].MinPutTime === '') {
                                    var judge = await this.is_cancel(res.list[i])
                                    if (judge === true) {
                                        this.get_detail(res.list[i])
                                        ///this.accept_task(res.list[i])
                                        count = 1
                                        break
                                    }
                                }

                            }

                        } else {
                            if (this.empty_times < 20) {
                                this.empty_times += 1
                                this.sendMessage('暂无任务')
                                await this.sleep(5000)
                            } else {
                                this.sendMessage('多次未获得任务，可能是账号有问题，请联系平台解决', true)
                                this.empty_times = 0
                            }

                        }


                    } else {
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
                console.log(error)
            }
        }
    }
    is_cancel(res){
        var judge=true
        if (this.cost_max<res.UnitPrice || res.UnitPrice<this.cost_min){
            judge=false
        }
        if (this.comission_max<res.Commission || res.Commission<this.comission_min){
            judge=false
        }
        return judge
    }
    async get_detail(data){
        if (this.is_close){
            try {
                var body =data.Id
                var options = {
                    'method': 'GET',
                    'url': this.url+'/Wap/TaskMoney/Details/'+body,
                    'headers': this.header,

                }
                var res = await this.send(options)
                console.log(res.body)


            }catch (error){
                console.log(error)
            }
        }

    }
    async accept_task(data){
        if (this.is_close){
            try {
                var form = this.encode({
                    taskId: data.Id,
                    accountId: this.final_acc[this.change_acc_index].accountId,
                    isMobile: 1,
                    capToken: "3eouf07sftf"
                })
                var options = {
                    'method': 'POST',
                    'url': this.url+'/Api/TaskMoney/ApplyTask',
                    'headers': this.header,
                    form:form
                }
                var res = await this.send(options)
                res = JSON.parse(res.body)
                console.log(res)
                if (res.code===0){
                    this.sendMessage('接单成功')
                    this.sendMessage('本金'+data.UnitPrice+',佣金'+data.Commission)
                    this.close()

                }else{
                    if (res.msg.indexOf('需要先完成才可继续领取任务')>-1){
                        this.sendMessage('接单成功')
                        this.close()
                    }else if (res.msg.indexOf('接满')>-1){
                        this.sendMessage('账号'+this.final_acc[this.change_acc_index].accountName+'接满，已自动换号')
                        this.final_acc.splice(this.change_acc_index,1)
                        if (this.final_acc.length < 1) {
                            this.sendMessage("没有可用接单号")
                            this.close()

                        }
                        this.get_order()
                    }else {
                        this.sendMessage(res.msg)
                        if (this.final_acc.length>1){
                            if (this.apply_times<10){
                                this.apply_times+=1


                            }else {
                                this.apply_times=0
                                this.change_acc_index+=1
                                if(this.change_acc_index>=this.final_acc.length  ){
                                    this.change_acc_index =0
                                }
                                this.sendMessage('接单号'+this.final_acc[this.change_acc_index].accountName)


                            }
                            this.get_order()
                        }


                    }
                }

            }catch (error){
                console.log(error)
            }
        }

    }
}


mqw=new mqw()
mqw.login()

