/**

 @author:zhupeikang
 @fileName:Advance.js
 @createTime:2021/9/6

 **/

import SearchForm from "@/components/ZForm/SearchForm";
export const advanceMixin={
    components:{
        SearchForm
    },
    data(){
        return{
            advanceId:'',
            showAdvance:false
        }
    },
    methods:{
        setAdvanceId(id){
            this.advanceId=id
        }
    }
}
