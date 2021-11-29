var request = require('request');

var exec= class {
    /** 构造函数 接收参数并开始执行脚本
     * @param {object} options 脚本需要的参数:
     * {int}      delay 脚本循环间隔(毫秒)
     * {object}   axios 请求对象
     * {object}   CryptoJS 加密对象
     * {function} sendMessage 回调
     */
    constructor() {
        ///this.options = options
        ///this.sendMessage = options.sendMessage
        ///this.sendUserList = options.sendUserList

        this.name='dhyt'
        this.formData = [{
            type: 'radio', // 单选框
            key: 'radioValue',
            title: '接单类型',
            list: [ // 选项列表
                {
                    title: '垫付',
                    value: 'pay'
                },
                {
                    title: '浏览',
                    value: 'scan'
                }
            ],
            required: true,
            value: 'pay'// 单选框默认值是选项列表中的单个value(变量格式需一致)
        }]
        this.header = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json;text/plain,*/*',





        }
        this.url="http://buyer.dahaiyt8.xyz/"
        this.time=25000
        this.error_count = 0
        this.apply_times = 0
        this.empty_times = 0
        this.comission_min=0
        this.comission_max=9999
        this.cost_min=0
        this.cost_max=9999
        this.abort_times=0
        this.is_close=true
        this.radioValue="1"
    }
    intialization(){

        this.change_acc_index=0
        this.final_acc = []
        this.able_acc = []
    }
    DeviceSerial() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(n) {
            var a = 16 * Math.random() | 0,
                i = "x" == n ? a : 3 & a | 8;
            return i.toString(16)
        }))
    }

    getFormData() {
        return this.formData
    }
    sendMessage(message,top=false){
        console.log(message)
    }

    // 主动向前台发送用户列表
    sendUserList(userList) {}



    /**
     * 开始脚本运行
     * @param {object} 前台用户填写的表单
     */
    start() {

        this.option=option


        this.before_login()
    }

    // 停止脚本运行
    sleep(ms) {
        if(this.is_close===false){
            throw new Error('停止运行')
        }


        return new Promise(reslove=>
            this.timer=setTimeout(reslove,ms))



    }
    close() {
        this.is_close = false
        if(this.timer){
            clearTimeout(this.timer)
        }
        ///this.options.closed()
        this.sendMessage('接单停止')

    }



    send(options) {
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
    async login(){
        if (this.is_close){
            try {
                var body=JSON.stringify({"mobile":"17658601962","password":"0208058cjb18"})
                console.log(body)
                var  options = {
                    'method': 'POST',
                    'url': this.url+'buyer/login/bingBuyersMobileForWx',
                    'headers': this.header,

                    body: body
                };



                    var res=await this.send(options)
                    res=JSON.parse(res)
                    console.log(res)
                    if (res.code===200){
                        this.sendMessage('登录成功')
                        this.header["Authorization"]=res.data.Authorization
                        await this.get_tasksinfo()
                        this.get_tasks()
                    }else {

                            this.sendMessage(res.message)
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
    async get_tasksinfo(){
        if (this.is_close){
            try {
                var body=JSON.stringify({"_index":"1","_size":"10000",'status':'1'})

                var  options = {
                    'method': 'POST',
                    'url': this.url+'buyer/taskrenew/findTaskInfo',
                    'headers': this.header,

                    body: body
                };
                var res=await this.send(options)
                res=JSON.parse(res)
                console.log(res)
                if (res.code===200){
                    if (res.data.records.length>0){
                        for(var i in res.data.records){
                            if (res.data.records[i].taskTypeName.indexOf('预售')===-1&&res.data.records[i].taskTypeName.indexOf('隔天')===-1){
                                this.sendMessage('接单成功')
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
        if (this.is_close){
            try {
                this.sendMessage('正在获取任务')
                var url
                if(this.radioValue==="1"){
                    url=this.url+'buyer/grab_task/grabTaskList'
                }else if (this.radioValue==="2"){
                    url=this.url+'buyer/grab_task/getLLTaskList'
                }
                var  options = {
                    'method': 'GET',
                    'url': url,
                    'headers':this.header,


                };
                while (1){
                    var res=await this.send(options)
                    res=JSON.parse(res)
                    console.log(res)
                    if (res.code===200){

                        this.sendMessage('正在接单')
                        if(this.radioValue==="1"){
                            if (this.empty_times>100){
                                this.sendMessage('已经接单100次未接到任务，可能是佣金限制，或接单时间点问题',true)
                                this.empty_times=0
                            }
                            if (res.data.length>0){
                                var curr_time=(new Date).getTime()
                                for (var i in res.data){
                                    var index=res.data.length-1-i
                                    var time=new Date(res.data[index].startTime).getTime()
                                    if (curr_time>time){
                                        if (this.comission_max<parseFloat(res.data[index].commissionBuyers) || parseFloat(res.data[index].commissionBuyers)<this.comission_min){
                                            var Tid=res.data[index].taskNo
                                            await this.accept_task(Tid)
                                            await this.sleep(1000)
                                        }
                                    }

                                }
                            }
                            await this.sleep(this.time)
                            this.empty_times+=1
                            this.sendMessage('暂无任务')
                        }else if (this.radioValue==="2"){
                            if (res.data.records.length>0){
                                for (var i in res.data.records){
                                    var id=res.data.records[i].taskId
                                    await this.accept_task(id)
                                    await this.sleep(1500)
                                }
                        }
                            await this.sleep(10000)
                            this.sendMessage('暂无任务')
                    }



                    }else {
                        if (res.message.indexOf('催评') > -1) {
                            this.sendMessage(res.message)
                            this.close()
                            break
                        } else if (res.message.indexOf('定位') > -1) {
                            this.location()
                            break
                        } else if (res.message === '请先完成审核资料') {
                            this.sendMessage(res.message,true)
                            this.close()
                            break
                        } else if (res.message.indexOf("你接到的任务已经达到上限") > -1) {
                            this.sendMessage(res.message,true)
                            this.close()
                            break
                        } else if (res.message.indexOf("进行中") > -1) {
                            this.sendMessage(res.message,true)
                            this.close()
                            break
                        }else if (res.message.indexOf('刷列表500次') > -1 ){
                            this.sendMessage(res.message,true)
                            this.close()
                            break
                        }else {
                            this.sendMessage(res.message)
                            ///上报
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
    async accept_task(id){
        if (this.is_close){
            try {
                var options
                if (this.radioValue==="1"){
                    var body1=JSON.stringify({"taskNo":id})
                    options = {
                        'method': 'POST',
                        'url': this.url+'buyer/grab_task/grabTask',
                        'headers': this.header,

                        body: body1
                    };
                }else {
                    var body2=JSON.stringify({"taskId":id})
                        options = {
                        'method': 'POST',
                        'url': this.url+'buyer/grab_task/buyerClaimLLTask',
                        'headers': this.header,

                        body: body2
                    };
                }

                var res=await this.send(options)
                res=JSON.parse(res)
                console.log(res)
                if (res.code===200){
                    this.sendMessage('接单成功',true)
                    this.close()
                }else {
                    this.sendMessage(res.message)
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
    async location(){
        if (this.is_close){
            try {
                this.deviceId=this.DeviceSerial()
                var body1=JSON.stringify({
                    deviceId: this.deviceId,
                    lng: "120.38442818",
                    lat: "36.10521490",
                    province: "山东省",
                    city: "青岛市",
                    district: "市北区",
                    street: "抚顺路",
                    streetNumber: "3号甲"
                })
                var options = {
                    'method': 'POST',
                    'url': this.url+'buyer/fans/setBuyersDeviceLog',
                    'headers': this.header,

                    body: body1
                };

                var res=await this.send(options)
                res=JSON.parse(res)
                console.log(res)
                this.get_tasks()

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
}
a=new exec()
a.login()