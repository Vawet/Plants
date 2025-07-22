import { defineStore } from 'pinia'
import { ref, watch,computed,reactive } from "vue"

function initState() {
    return {
        avatar: "",
        username: "",
        nickname: "",
        id:"",
        bioch:"",
        bioen:"",
        plantsGroup:[],
        // 只展示有植物图片的科系  也有很多场合需要用到
    }
}
// 植物系别选项
const plantCategories = [
  { value: '1', label: '草本植物' },
  { value: '2', label: '木本植物' },
  { value: '3', label: '多肉植物' },
  { value: '4', label: '水生植物' },
  { value: '5', label: '藤本植物' },
  { value: '6', label: '食虫植物' },
  { value: '7', label: '蕨类植物' },
  { value: '8', label: '兰科植物' },
  { value: '9', label: '苔藓植物' },
  { value: '10', label: '珍稀植物' }
];

export const useAllDataStore = defineStore("allData", () => {
    const state = reactive(initState());
    function updateImg(val) {
        state.avatar =val;
    }
    function updatePerson(val){
        state.nickname = val.nickname;
        state.id = val.id;
        state.bioch = val.bioch;
        state.bioen = val.bioen;
        // 图片的跨端访问只需要展示相对地址 也就是/avatars/xxx.png
        // state.avatar = val.avatarUrl.replace("http://localhost:3000",'');
        state.avatar = val.avatarUrl;
    }
    // 因为后端的接口返回的是有植物图片的科系数组 但是我需要的是全部的！
    function updatePlantsGroup(arr){
        const newPlantsGroup =plantCategories.map(category=>{
            const existing=arr.find(group=>group.sid===category.value)
            if(existing){
                return{
                    sid:category.value,
                    sname:category.label,
                    plants:existing.plants
                }
            }else{
                return{
                    sid:category.value,
                    sname:category.label,
                    plants:[]
                }
            }
        });
        state.plantsGroup=newPlantsGroup;
        return newPlantsGroup;
    }
    return{
        // avatar:computed(()=>state.avatar),
        // username:computed(()=>state.username),
        // nickname:computed(()=>state.nickname),
        // id:computed(()=>state.id),
        // bioch:computed(()=>state.bioch),
        // bioen:computed(()=>state.bioen),
        ...toRefs(state),
        updateImg,
        updatePerson,
        updatePlantsGroup
    };
});