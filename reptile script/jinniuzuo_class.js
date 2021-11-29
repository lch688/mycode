var request = require('request');

var jnz = class {
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
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html, application/xhtml+xml, */*',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',
        }
        this.time=15000
        this.error_count = 0
        this.apply_times = 0
        this.empty_times = 0
        this.comission_min=0
        this.comission_max=9999
        this.cost_min=0
        this.cost_max=9999
        this.user_acc=[]
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
     DeviceSerial() {
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

                    resolve(resopnse.body)
                }

            })

        })
    }
    close(){}

    async login() {
         try {
             this.intialization()
            this.terminalSerial=this.DeviceSerial().substring(0, 8)
             while (1){
             var form=this.encode(  {
                 'account': '18053378510',
                     'password': 'lch18053378510',
                     'appId': '1',
                     'token': '-',
                     'version': '20201124',
                     '_time': (new Date).getTime(),
                     'terminal': '1',
                     'terminalSerial': this.DeviceSerial().substring(0, 8)///使用DeviceSerial获得随机设备序列号 ///
             })
             var options = {
                 'method': 'POST',
                 'url': 'http://m.q22q22.com/buyer/login/loginByPwd',
                 'headers': this.header,
                 'form':form


             };
                await this.sleep(1000)
                 var res=await this.send(options)

                 res=JSON.parse(res)
                 console.log(res)


                 if (res.code=== 0 && res.success === true) {
                     ///判断是否第一步登录成功 成功进入此分支
                     this.sendMessage('登录成功')///"成功后向用户展示成功"
                     this.token = res.data.token/// 获得token///
                     this.get_bind_account()
                     break


                 }else{
                     if (res.msg==='账号不存在,请先去注册'){
                         this.sendMessage(res.msg)
                         this.close()
                         break
                     }else if (res.msg==='您的账号或密码有误，请重新输入'){
                         this.sendMessage(res.msg)
                         this.close()
                         break
                     }else {
                         if (this.error_count < 10) {
                             this.error_count += 1
                             this.sendMessage(res.msg)

                         } else {
                             this.sendMessage("异常请重试")
                             ////shangbao
                             this.close()
                             break

                         }
                     }


                 }

             }
         } catch (error) {
             if (this.error_count<10){
                 this.error_count+=1
                 ////shangbao  error
                 this.login()
             }else {
                 console.log(error)
                 ////shangbao
                 this.close()

             }
         }

     }
     async get_bind_account() {
         try {
            while (1) {
                var form = this.encode({
                    "token": this.token,
                    "_time": (new Date).getTime(),
                    "version": "20200716",
                    "terminal": "1",
                    "terminalSerial": this.terminalSerial
                })


                var options = {
                    'method': 'POST',
                    'url': 'http://m.q22q22.com/buyer/info/getBindInfo',
                    'headers': this.header,
                    'form': form

                };
                await this.sleep(6000)
                var res = await this.send(options)
                res = JSON.parse(res)
                console.log(res)

                if (res.code === 0 && res.success === true) {
                    var all_bind_acc = []
                    ///判断是否第二步登录成功 成功进入此分支
                    this.sendMessage('正在获取账号')///"成功后向用户展示成功"
                    /// 若new_data["data"].length===0  向用户展示“没有接单号” 并停止程序///

                    if (res.data.length !== 0) {
                        for (var i in res.data) {
                            var type = ''
                            if (res.data[i].accountStatus === 1) {
                                var plat = res.data[i].bindAccountType
                                if (plat === 1) {
                                    type = "淘宝"
                                } else if (plat === 4) {
                                    type = "拼多多"
                                } else if (plat === 3) {
                                    type = "京东"
                                } else if (plat === 5) {
                                    type = "抖音"
                                }
                                var this_account = {
                                    accountType: type,
                                    accountId: res.data[i].accountId,
                                    accountName: type + "-" + res.data[i].bindAccountName
                                }
                                ///将包装好的账号对象加入列表
                                all_bind_acc.push(this_account)

                                if (res.data[i].frequency < 2) {
                                    this.able_acc.push(res.data[i].accountId)
                                } else {
                                    ///置顶
                                    this.option.userValue.forEach(item => {
                                        if (item.accountId === res.data[i].accountId) {//zhiding
                                            this.sendMessage(res.data[i].bindAccountName + '接满，已自动换号',true)
                                        }
                                    })

                                }
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

                        if (this.final_acc.length < 1) {
                            this.sendMessage("没有可用接单号")
                            this.close()
                            break

                        } else {
                            console.log(this.final_acc)
                            await this.get_taskinfo('acc')
                            await this.get_info()


                            await this.apply_taks()

                            break


                        }


                    } else {
                        this.sendMessage("没有接单号")
                        this.close()
                        break
                    }
                } else {
                    if (this.error_count < 10) {
                        this.error_count += 1

                        ////shangbao

                    } else {
                        if (res.msg === "请重新登录") {
                            this.login()
                            break
                            /// 若msg 显示"请重新登录" 重新进行第一步请求
                        }else {
                            this.sendMessage(res.msg)
                            this.close()
                            break

                        }

                    }
                }
            }
         }catch (error){
             if (this.error_count<10){
                 this.error_count+=1
                 console.log(error)
                 ////shangbao  error
                 this.login()
             }else {
                 console.log(error)
                 ////shangbao
                 this.close()

             }
         }
     }

    async get_taskinfo(judge){
        try {
            var count=0
            while (count<5){

                var form=this.encode({
                    'pageNum':1,
                    'pageSize':10,
                    'orderStatus':3,
                    'taskTypeId':"",
                    "token": this.token,
                    "_time": (new Date).getTime(),
                    "version": "20200716",
                    "terminal": "1",
                    "terminalSerial": this.terminalSerial
                })
                var options = {
                    'method': 'POST',
                    'url': 'http://m.q22q22.com/buyer/order/acceptList',
                    'headers': this.header,
                    'form':form

                };



                await this.sleep(1000)
                var res = await this.send(options)
                res = JSON.parse(res)
                console.log(res)
                console.log(res.data.list)
                if (res.code === 0 && res.success === true) {
                    if (judge==="acc"){
                        if (res.data.list.length!==0){
                            for(var i in res.data.list){
                                if (res.data.list[i].taskTypeName.indexOf('预售')===-1&&res.data.list[i].taskTypeName.indexOf('隔天')===-1){
                                    this.sendMessage('接单成功')
                                    this.close()
                                    break
                                }
                            }

                        }



                    }else if (judge==='task'){
                        return res
                    }
                    break
                }else {
                    if (res.msg === "请重新登录") {
                        this.login()
                        break
                        /// 若msg 显示"请重新登录" 重新进行第一步请求
                    }else {
                        count+=1
                    }

                    ///shangbao  msg
                }
            }

        } catch (error){
            ///shangbao
            console.log(error)

        }

    }


     async get_info(){

        try {
            var count=0

            while (count<5) {


                var form = this.encode({
                    "token": this.token,
                    "_time": (new Date).getTime(),
                    "version": "20200716",
                    "terminal": "1",
                    "terminalSerial": this.terminalSerial
                })
                var options = {
                    'method': 'POST',
                    'url': 'http://m.q22q22.com/buyer/start/getInfo',
                    'headers': this.header,
                    'form': form

                };


                await this.sleep(1000)
                var res = await this.send(options)

                res = JSON.parse(res)
                console.log(res)
                if (res.code === 0 && res.success === true) {
                    if (res.data.hasAppendedPraise !== 0) {
                        this.sendMessage('有任务需要评价')
                        this.close()


                    }
                break

                }else {
                    if (res.msg === "请重新登录") {
                        this.login()
                        break
                        /// 若msg 显示"请重新登录" 重新进行第一步请求
                    }
                    //上报msg
                    count += 1
                }
        }
    }catch (error){
            //shangbao
            console.log(error)

        }
}





     async apply_taks(){
        try{
            this.sendMessage('接单号'+this.final_acc[this.change_acc_index].accountName)
            await this.sleep(1000)
            while (1){
                this.sendMessage('正在接单')
                var form=this.encode({
                    "token": this.token,
                    "_time": (new Date).getTime(),
                    "version": "20200716",
                    "terminal": "1",
                    "terminalSerial": this.terminalSerial,
                    "accountId": this.final_acc[this.change_acc_index].accountId
                })
                var options = {
                    'method': 'POST',
                    'url': 'http://m.q22q22.com/buyer/order/allocation',
                    'headers': this.header,
                    'form':form


                        ///仅使用用户选择了的账号          ***增加功能 展示用户接单的账号名称  即发送第三步用的账号accountid的名称  若有多个只展示一个优先淘宝                                                                           /// ***增加功能 循环发送第三步，accountId 每次发送第三步请求都自动切换账号 以最大的账号数量为基准 例 用户选择账号里有5个淘宝 2个京东 每次发送依次使用淘宝的5个id 京东的id也依次使用 当第三次重新使用第一个京东id///
                };

                var res = await this.send(options)
                res = JSON.parse(res)
                console.log(res)

                if (res.code === 0 && res.success === true){
                    if (res.data!==null){
                        var task_data=await this.get_taskinfo('task')
                        if (task_data===undefined){
                            this.sendMessage('接单成功，无法根据选项取消订单')
                            this.close()
                            break
                        }else {
                            var judge=await this.is_cancel(task_data)
                            if (judge===true){
                                this.sendMessage('接单成功')
                                this.sendMessage('本金'+task_data.data.list[0].payMoney)
                                this.sendMessage('佣金'+task_data.data.list[0].commission)
                                this.close()

                            }else {
                                this.get_detail(task_data.data.list[0].orderSign)

                            }
                            break
                        }

                    }else {
                        this.sendMessage(res.msg)
                        if (this.final_acc.length>1){
                            if (this.empty_times>10 ) {
                                this.empty_times=0
                                this.change_acc_index+=1
                                if(this.change_acc_index>=this.final_acc.length  ){
                                    this.change_acc_index =0
                                }
                                this.sendMessage('接单号'+this.final_acc[this.change_acc_index].accountName)



                            }else {
                                this.empty_times+=1
                            }
                        }
                        if (this.apply_times<300){
                            this.apply_times+=1
                        }else {
                            this.sendMessage('长时间为接到单，可能是取消浏览单过多，请先完成一单，再尝试',top=true)
                            this.apply_times=0
                        }
                        await this.sleep(this.time)
                    }
                }else {
                    if (res.msg === "您有未完成的订单，先完成在接单") {
                        this.sendMessage('接单成功')
                        this.close()
                        break
                    } else if (res.msg === "请重新登录") {
                        this.login()
                        break
                        /// 若msg 显示"请重新登录" 重新进行第一步请求
                    }else if(res.msg  === '取消/拒绝次数过多，今天不能在接单,') {
                        this.sendMessage('接单号' + this.final_acc[this.change_acc_index].accountName+'被限制，已换号',top=true)
                        this.final_acc.splice(this.change_acc_index,1)
                        console.log(this.final_acc.length)
                        if (this.final_acc.length < 1) {
                            this.sendMessage("没有可用接单号")
                            this.close()
                            break

                        }
                    }
                    else{
                        if (this.error_count < 10) {
                        this.error_count += 1
                        ////shangbao

                        } else {
                        this.sendMessage(res.message)
                        this.close()
                        break
                        }///其他情况展示展示信息内容  并把返回值上传我们服务器
                    }
                }

                    }
        }catch (error){
            if (this.error_count<10){
                this.error_count+=1
                console.log(error)
                ////shangbao  error
                this.login()
            }else {
                console.log(error)
                ////shangbao
                this.close()

            }
        }
     }
     is_cancel(res){
        var judge=true
         if (this.cost_max<res.data.list[0].payMoney|| res.data.list[0].payMoney<this.cost_min){
             judge=false
         }
         if (this.comission_max<res.data.list[0].commission|| res.data.list[0].commission<this.comission_min){
             judge=false
         }
        return judge

     }
     async get_detail(ordersign){
        var form=this.encode({
            orderSign: ordersign,///从返回值中找到 orderSign 通过orderSign 确定哪一个订单

            token: this.token,
            _time: (new Date).getTime(),
            version: "20200716",
            terminal: "1",
            terminalSerial: this.terminalSerial

        })
         var options = {
             'method': 'POST',
             'url': 'http://m.q22q22.com/buyer/order/detail',
             'headers': this.header,

             "form": form
         };



         await this.sleep(6000)
         var res = await this.send(options)
         res = JSON.parse(res)
         console.log(res)
         if (res.code === 0 && res.success === true) {
             await this.cancel_task(res.data.orderSign)


         } else {
             this.sendMessage('取消订单失败，请到平台取消')
             this.close()
             ////上报msg


        }


     }
    async cancel_task(ordersign){
        var form= {
            orderSign: ordersign,///根据返回值获取更新的orderSign
            cancelReason: 3,
            token: this.token,
            version: "20200716",
            _time: (new Date).getTime(),
            terminal: "1",
            terminalSerial:this.terminalSerial
        }
        var options = {
            'method': 'POST',
            'url': 'http://m.q22q22.com/buyer/order/cancel',
            'headers': this.header,

            "form": form
        };
        await this.sleep(6000)
        var res = await this.send(options)
        res = JSON.parse(res)
        console.log(res)
        if (res.code === 0 && res.success === true) {
            this.sendMessage('订单不符合要求已取消，已重新接单')
            this.apply_taks()


        } else {
            this.sendMessage('取消订单失败，请到平台取消')
            this.close()
            ////上报msg
        }
    }
}

jnz=new jnz()
jnz.login()