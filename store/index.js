const defautData = {
    searchInfo:null,
    catIndex:0
}
export const state = () => (defautData)

export const mutations = {
    setSearchInfo(state,searchInfo){
        state.searchInfo = searchInfo
    },
    setCatIndex(state,catIndex){
        state.catIndex = catIndex
    }
}