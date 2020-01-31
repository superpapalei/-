import Vuex from 'vuex'
import { tabsName } from './tabName'
import store from '.';
//默认主页
// const Home = resolve => require(['../views/Home'], resolve)

const state = {
    activeTabName: 'home',  //当前页面(去参)
    activeUrlName: 'home',  //当前页面(带参)
    parameterArray: ['shoppingCar/shopping'],     //含参数的路径名组成的数组
    closeToArray: ['main'],       //不可直接关闭的特殊路径组成的数组
    //标签数组
    tabList: [],
    //导航数组，等权限控制做好通过后台读取
    menuTreeListFlatten: [],
    menuTreeList: []
}

const mutations = {
    /*
    *传入一个路径
    *用于添加标签
    *路径带参数时进行特殊处理，
    *带参路径去参后保存到一个数组parameterArray中，空间换时间
    */
    addTab(state, index) {
        //判断是否带参，用'?'做判断
        var oldIndex = index;               //原路径
        var index = index.split('?')[0];    //去参后的路径
        var param = oldIndex.split('?')[1]; //参数
        //判断路径是否带参，若带参，将去参后的路径更新至parameterArray中
        if (param !== undefined) {
            if (!state.parameterArray.includes(index)) {
                state.parameterArray.push(index);
            }
        }
        //判断标签数组是否有此路径
        //如果没有，开始添加
        //如果有，看是否是带参路径，是的话修改，不是的话设置当前页面和当前路径
        if (state.tabList.filter(f => f.name == index) == 0) {
            let component = resolve => require([`../components/${index}`], resolve);
            //添加和修改时判断是否在closeToArray中，有的话closable置为false
            let isClose;
            if (state.closeToArray.includes(index)) isClose = false;
            else isClose = true;
            let tabName = '';
            var mapTab = state.menuTreeListFlatten.filter(item => item.MENU_LINK == oldIndex);
            if (mapTab.length > 0)
                tabName = mapTab[0].MENU_TEXT;
            else
                tabName = tabsName(index);
            state.tabList.push({
                //label: tabsName(index),     //选项卡标题
                label: tabName,     //选项卡标题
                name: index,                //唯一标识id，指向组件
                disabled: false,            //是否禁用  （默认false）
                closable: isClose,          //标签是否可关闭  （默认true，除了主页）
                lazy: false,                //标签是否延迟渲染  （默认false）
                component: component,       //使用的组件，配合name引入
                parameter: param            //保存切割后的参数
            })
        }
        else {
            if (state.parameterArray.includes(index)) {
                for (let i = 0; i < state.tabList.length; i++) {
                    if (state.tabList[i].name === index) {
                        state.tabList[i].parameter = param;
                        //等提供了修改closeToArray的方法时再去注入
                        //state.tabList[i].closable = !(state.closeToArray.includes(index));
                        break;
                    }
                }
            }
        }
        state.activeTabName = index;
        state.activeUrlName = oldIndex;
    },
    /*
    *传入一个标签的name
    *使选中的标签页高亮，和name对应
    */
    setActiveTabName(state, name) {
        state.activeTabName = name;
    },
    /*
    *传入一个标签的name，也就是activeTabName
    *给activeUrlName赋值一个判断后可能带参的原路径
    */
    setActiveUrlName(state, name) {
        let _index = state.parameterArray.indexOf(name);
        if (_index !== -1) {
            for (let i = 0; i < state.tabList.length; i++) {
                if (state.tabList[i].name === name) {
                    state.activeUrlName = name + '?' + state.tabList[i].parameter;
                    break;
                }
            }
        }
        else {
            state.activeUrlName = name;
        }
        state.activeTabName = name;
    },
    /*
    *传入一个标签的name
    *将该标签的数据从标签数组中清除
    */
    deleteTabListByName(state, name) {
        state.tabList = state.tabList.filter(f => f.name != name);
    },
    /*
    *将标签数组清空
    */
    emptyTabList(state) {
        state.tabList = [];
    },
    /*
    *设置菜单树
    */
    setMenuTreeList(state, data) {
        state.menuTreeList = data;
        state.menuTreeListFlatten = arrayChildrenFlatten(state.menuTreeList, []);
    },
    emptyMenuTreeList(state) {
        state.menuTreeList = [];
        state.menuTreeListFlatten = [];
    }
};
/*
    *多维数组数组扁平化
    */
function arrayChildrenFlatten(array, result) {
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (item.children && item.children.length > 0) {
            result.push(item);
            result = arrayChildrenFlatten(item.children, result);
        }
        else {
            result.push(item);
        }
    }
    return result;
}

const getters = {
    //获取标签数组
    getTabList: state => {
        return state.tabList;
    },
    //获取带参路径数组
    getParameterArray: state => {
        return state.parameterArray;
    },
    //获取不能直接关闭的路径数组
    getCloseToArray: state => {
        return state.closeToArray;
    },
    //获取当前路径
    getActiveTabName: state => {
        return state.activeTabName;
    },
    //获取带参路径
    getActiveUrlName: state => {
        return state.activeUrlName;
    }
};

const actions = {
    /*
    *传入一个标签的name
    *关闭标签页
    *只能关闭closable为true的标签页
    */
    closeTab({ commit, getters }, name) {
        //判断目前是否只剩下一个页面，只有一个的话不能关闭（无固定主页的情况下需要考虑）
        let tabList = getters.getTabList;
        if (tabList.length === 1) return;
        //获取关闭的页面在标签数组的位置
        let tab = tabList.filter(f => f.name == name)[0];
        let index = tabList.indexOf(tab);
        //判断关闭的页面是否为当前页面，是的话改变activeTabName和activeUrlName
        let activeTabName = getters.getActiveTabName;
        if (name === activeTabName) {
            //如果此页面在标签数组最后一个，activeTabName为上一个，activeUrlName改变
            //其余情况，activeTabName为下一个，activeUrlName改变
            if (index === tabList.length - 1) {
                commit('setActiveTabName', tabList[index - 1].name);
                commit('setActiveUrlName', tabList[index - 1].name);
            }
            else {
                commit('setActiveTabName', tabList[index + 1].name);
                commit('setActiveUrlName', tabList[index + 1].name);
            }
        }
        //将对应的数据清除掉
        commit('deleteTabListByName', name);
        // if(name !== 'order/checkOrder'){
        //     let index = state.tabList.indexOf(tab);
        //     if (index != state.tabList.length - 1) {
        //         state.activeTabName = state.tabList[index + 1].name;
        //     } else {
        //         state.activeTabName = state.tabList[index - 1].name;
        //     }
        // }
    },
    /*
    *传入一个对象：
    *  object：{
    *    oldUrl：要关闭的标签页
    *    newUrl：跳转新的标签页  
    *  }
    *关闭closable为false的标签页
    */
    closeToTab({ commit, getters }, obj) {
        //let closeToArray = getters.getCloseToArray;
        let activeUrlName = getters.getActiveUrlName;
        //判断是否为closeToArray中的元素，不是的话返回
        //if(closeToArray.includes(obj.oldUrl) === false)    return;
        //判断关闭是否为当前的页面activeUrlName，不是的话返回
        if (obj.oldUrl !== activeUrlName) return;
        //调用addTab，传入newUrl，因为可能传入的参数发生改变，都交由addTab处理
        commit('addTab', obj.newUrl);
        //将对应的数据清除掉
        commit('deleteTabListByName', obj.oldUrl);
        //state.tabList = state.tabList.filter(f => f.name != obj.oldUrl);
    }
};
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}