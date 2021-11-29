var request = require('request');

var tkq = class {
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
        this.timer = null
        // 用户id 程序开始后于第二步自动获取

        // 每个步骤上一次请求时保留的参数 1对应第一步 2对应第二步 等等
        this.header = {
            'Content-Type': 'application/json;charset=UTF-8',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',
        }
        this.time=25000
        this.error_count = 0
        this.apply_times = 0
        this.empty_times = 0
        this.comission_min=0
        this.comission_max=9999
        this.cost_min=0
        this.cost_max=9999
        this.cookie
        this.abort_times=0
        this.final_acc=[{
            accountType: "taobao",
            accountId: "6882",
            accountName: "taobao-zhang888"
        }]
        this.change_acc_index=0
        this.url='http://tkq.chuangbojinfu2.top'

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

    sleep(ms){
        return new Promise(reslove=>setTimeout(reslove,ms))

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
    close(){}

///先获取验证码，并且可以转码成base64。259行关于DOM解析
    async before_login(){
        var a = this.url+ "/Login/CaptchaImage?V" + Math.random()///随机获取后缀

        var options = {
            'method': 'GET',
            encoding:"base64",
            'url': a,
            'headers': this.header
        };

        var res = await this.send(options)
        console.log(res)
        this.header['Cookie']=res['headers']['set-cookie'][0]

        var image_base=res.body.toString('base64')
        console.log(image_base)
        ///这里我们用的第三方库处理的验证码，在app端不用第三方库，app端我们获取了base64以后传出去，展示给用户，暂停程序，用户填写后继续运行
        var form={
            'username': 'lch666',//用户名
            'password': 'lch6286277',//密码
            'typeid': '3',
            'image': image_base
        }
        var  option = {
            'method': 'POST',
            'url': 'http://api.ttshitu.com/predict',
            'headers': this.header,

            form: form
        }
        res = await this.send(option)
        console.log(res.body)
        res=JSON.parse(res.body)
        if (res.code==="0"){
            var captcha=res.data.result
            console.log(captcha)
            this.login(captcha)
        }else {
            this.sendMessage('验证码识别出错，请重试')
            ///shangbao
        }



    }

    async login(captcha) {
        try {


            var form = {
                UserName: "15169224398",
                Password: "CXDCXD52138790.",
                Captcha: captcha ///获取用户填写的验证码

            }
            var options = {
                'method': 'POST',
                'url': this.url+'/Login/Login',
                'headers': this.header,

                form: form

            }
            while (1){


                var data = await this.send(options)
                var res = JSON.parse(data.body)
                console.log(res)
                if (res.Code === 0 && res.Success === true) {
                    var old_cookie = this.header.Cookie
                    this.header['Cookie'] = old_cookie + ";" + data['headers']['set-cookie'][0]
                    console.log(111)

                    this.get_bind_acc()
                    break

                }else {
                    if (res.Message==="用户不存在"){
                       this.sendMessage("用户不存在")
                        this.close()
                        break
                    }
                    else if (res.Message==="验证码输入错误"){
                        this.sendMessage("验证码输入错误")
                        this.close()
                        break
                    }
                    else if (res.Message==="用户名或密码错误"){
                        this.sendMessage("用户名或密码错误")
                        this.close()
                        break
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
            this.sendMessage(error)
        }
    }

    async get_task_info(){
        try {


            var form = this.encode({
                Page: 1,
                PageSize: 10,
                Status: "待操作"
            })
            var options = {
                'method': 'POST',
                'url': this.url+'/Order/GetOrderList',
                'headers': this.header,
                form: form

            }
            var count=0
            while (count < 5){


                await this.sleep(1000)
                var res = await this.send(options)
                res = JSON.parse(res.body)
                console.log(res)
                if (res.Code === 0 && res.Success === true){
                    if(res.Value.DataList.length!==0){
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

                }

            }
        }catch (error){
            this.sendMessage(error)
        }
    }

    async get_bind_acc(){
        try {
            var  options = {
                'method': 'GET',
                'url':this.url+ '/ReceiptTask',
                'headers': this.header
            }
            await this.sleep('1000')
            var res= await this.send(options)
            var html=res.body
            console.log(html)
            ///由于 node环境无法运行DOM因此注释掉，但浏览器可以运行以下代码，我们需要让app端有可以运行以下代码，并且注意，这次发送请求的返回值是html页面，app端的发送请求功能需要能接受各种的返回值（如json，html等）并给脚本
            /*
            DOM= new DOMParser
            content = DOM.parseFromString(html, "text/html")
            account = content.querySelectorAll(".accountlist .cell-item")
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
                            var this_acc={
                                accountType: type,
                                accountId: single_acc.querySelector("input").getAttribute("value"),
                                accountName: type+single_acc.querySelector(".shopname").innerText.trim()
                            }
                            all_bind_acc.push(this_acc)

                            allow_order=single_acc.querySelector('span[title="已接单量"]')
                            already_order=single_acc.querySelector('span[title="可接单量"]')
                            if (allow_order.innerText.trim()!==already_order.innerText.trim()){

                                this.able_acc.push(this_acc.accountId)
                            }else {
                                this.option.userValue.forEach(item => {
                                    if (item.accountId === this_acc.accountId) {//zhiding
                                        this.sendMessage(this_acc.accountName+ '接满，已自动换号',top=true)
                                    }
                                })
                            }
                            var text=single_acc.querySelector(".tip")

                            console.log("接单号"+this_acc.accountName)
                            console.log(text.innerText.trim())


                    }
                }
                this.sendUserList(all_bind_acc)
                if (this.user_acc.length === 0) {
                    all_bind_acc.forEach(item => {
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
                if(this.fianal_acc.length<0){

                    console.log("无可用接单号")
                    ///停
                }else {
                    console.log(this.final_acc)

                    await this.apply_taks()


                }
            }else {
                this.sendMessage('没有账号')
            }





                */
            await this.get_task_info()
            await this.apply_task()
        }catch (error){
            this.sendMessage(error)
        }
    }

    async apply_task() {
        try {
        this.sendMessage('正在接单')

        var form = this.encode({
            id:this.final_acc[this.change_acc_index].accountId , ///此步用的id 为伪参数 需要功能： 通过上面注释的代码解析第三步返回值  包装出账号的对象 即bind_acc所有内容   找到里面的id（即 对象中 accountId） 用户可选择 电商平台类型   用户选择了哪些平台就使用哪些平台对应的账号（注：这些账号也是用户选择了的，未选择的不用）
            ///***增加功能 用户可选择 接单类型 pay为垫付单 scan为浏览单 用户选择什么单 就发送什么参数                      ///每次发送依次使用对应的id（即 对象中 accountId） 有几个符合条件就用用几个  用完了就从头再用
            taskType: "pay",    ///this.option.radioValue                                                                            ///例 用户选择淘宝 京东 ，用户有2个淘宝种类账号，1个京东种类账号，1个拼多多种类账号 （且这些账号全部被用户选择） 我们就每次发送依次使用2个淘宝账号的id，和一个京东账号的id
            captcha: '',
            refundType: "all"
        })


        var options = {
            'method': 'POST',
            'url': this.url+'/ReceiptTask/GetReceiptOrder',
            'headers': this.header,

            form: form

        }
        this.sendMessage('当前接单号'+this.final_acc[this.change_acc_index].accountName)
        await this.sleep(1000)
        while (1){

            var res = await this.send(options)
            res = JSON.parse(res.body)
            console.log(res)
            if (res.Success === true && res.Value !==null){
                var judge=await this.is_abort(res)
                if (judge===true){
                    this.save_task(res)
                }else {
                    this.abort_task(res.Value.TaskId)
                }
                break
            }else {
                this.sendMessage(res.Message)
                //shangbao
                this.apply_times+=1
                if (this.apply_times===60&&this.abort_times===3){
                    this.apply_times=0
                    this.abort_times=0
                    this.sendMessage('长时间未接到单，可能是取消次数过多',top=true)
                }
                if (this.final_acc.length>1){
                    if (this.empty_times>10 ) {
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

            await this.sleep(this.time)

        }


    }catch (error){
            this.sendMessage(error)
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
            'url': this.url+'/ReceiptTask/SaveReceiptOrder',
            'headers': this.header,
            form:form

        }
        await this.sleep(1000)
        var res = await this.send(options)
        res = JSON.parse(res.body)
        console.log(res)
        if (res.Success === true && res.Code ===0){
            this.sendMessage('接单成功')
            this.sendMessage('本金'+res.Value.PostFee+'佣金'+res.Value.CommissionFee)
        }else {
            ///上报
            this.sendMessage('确认接单失败，已重新接单')
            this.apply_task()
        }
        }catch (error){
            this.sendMessage(error)
        }
    }
    async abort_task(taskId){
        try {

            var form=this.encode({
                taskid: taskId
            })
            var  options = {
                'method': 'POST',
                'url': this.url+'/ReceiptTask/RefuseOrder',
                'headers': this.header,
                form:form

            }
            await this.sleep(1000)
            var res = await this.send(options)
            res = JSON.parse(res.body)
            console.log(res)
            if (res.Success === true && res.Code ===0){
                this.sendMessage('任务不符合要求已取消，正在重新接单')
                this.apply_task()
                this.abort_times+=1
            }else {
                //上报
                this.sendMessage('取消失败，已重新接单')
                this.apply_task()
            }
        }catch (error){

            this.sendMessage(error)
        }
    }
}


tkq=new tkq()
tkq.before_login()

