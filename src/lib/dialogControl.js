/**

 @author:zhupeikang
 @fileName:dialog.js
 @createTime:2021/9/26

 **/

const dialogControl = {
    methods: {
        //打开弹窗
        openDialog() {
            this.visible = true
            return new Promise(resolve => {
                resolve()
            })
        },
        closeDialog(){
            this.visible = false

        }
    },
    data() {
        return {
            visible: false
        }
    }

}

export default dialogControl

