/**
 @author:zhupeikang
 @fileName:store.js
 @createTime:2021/9/8
 **/
export const storeModuleDir='./src/store/modules/'
export const storeConfigRootFilePath='./src/store/index.js'
import {close, open, write,appendFile} from 'fs';
import os from "os";

//获取命令行参数(要创建的文件名)
const fileName=process.argv.splice(2)[0]
//判断是否启用命名空间
const isNameSpace= process.env.npm_config_namespace !== undefined
//文件绝对路径（包含文件）

const filePath=storeModuleDir+fileName+'.js'
open(filePath, 'wx+', (err, fd) => {
    if (err) {
        console.log(err)
        console.log('文件已存在,请修改文件名')
        return
    }
    try {
        const TEMPLATE="const "+fileName+" = {\n" +
            "    namespaced: "+isNameSpace+",\n" +
            "    state: () => ({\n" +
            "    }),\n" +
            "    getters: {\n" +
            "    },\n" +
            "    mutations: {\n" +
            "    },\n" +
            "    actions: {\n" +
            "    }\n" +
            "\n" +
            "}\n" +
            "export default "+fileName+"\n"
        write(fd,TEMPLATE,(err)=>{
            if (err){
                console.log('写入失败,请重试')
                return
            }
            try {
                appModuleL()
            }finally {

            }
        })
    } finally {
        close(fd, (err) => {
            if (err) throw err;
        });
    }
})

const appModuleL=()=>{
    open(storeConfigRootFilePath,'r',(err,fd)=>{
        if (err){
        }
        try {
            const TEXT=os.EOL+
                "import "+fileName+" from \"@/store/modules/"+fileName+"\"\n" +
                "genStore('"+fileName+"',"+fileName+")"
            appendFile(storeConfigRootFilePath,TEXT,(() => {
                console.log('创建模块'+fileName+'成功')
            }))
        }catch (e){

        }
    })

}
