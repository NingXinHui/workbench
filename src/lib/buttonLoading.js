export const  buttonLoading={

    data(){
        return{
            buttonLoading:false
        }
    },

    methods:{
        cancelButtonLoading(){
            this.buttonLoading=false
        },
        setButtonLoading(){
            this.buttonLoading=true
        }
    }

}
