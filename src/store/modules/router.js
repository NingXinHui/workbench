const router = {
    namespaced: true,
    state: () => ({
        id: undefined,
        showType:'list',
        isEdit:false,
        isAdd:false,
        editData:{}
    }),
    getters: {
        id: state => state.id || undefined,
        showType: state => state.showType || 'list',
        isEdit: state => state.isEdit,
        isAdd: state => state.isAdd,
        editData:state=>state.editData||{}
    },
    mutations: {
        SET_ID(state, data) {
            state.id = data
        },
        SET_SHOW_TYPE(state, data) {
            state.showType = data[0]
            state.isEdit = !!data[1]
        },
        SET_ADD(state) {
            state.editData = {}
            state.isAdd = true
        }
        ,
        SET_DATA(state, data){
            state.editData=data
            state.isAdd=false
        }
    },
    actions: {
        setId({commit}, payload) {
            commit('SET_ID', payload)
        },
        setShowType({commit}, payload) {
            commit('SET_SHOW_TYPE', payload)
        } ,
        setData({commit}, payload) {
            commit('SET_DATA', payload)
        },
        setAdd({commit}, payload) {
            commit('SET_ADD', payload)
        }

    }

}
export default router
