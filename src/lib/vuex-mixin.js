import {createNamespacedHelpers} from "vuex";


class Mixin{
    constructor(moduleName){
        this.moduleName = moduleName;
        return this
    }
    getHelper(){
        const {mapGetters,mapActions} = createNamespacedHelpers(this.moduleName)
        return {mapActions,mapGetters}
    }

}


export default Mixin
