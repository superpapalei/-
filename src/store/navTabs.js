const state = {
    activeTabName: 'main',  //当前页面
    //导航数组，等权限控制做好通过后台读取
    menuTreeListFlatten: [],
    menuTreeList: [],
    breadCrumbList: {
        breadCrumbList: [],
        selectArray: []
    },//导航
    hasAddRouter: false,
}

const mutations = {
    /*
    *传入一个标签的index
    */
    setActiveTabName(state, index) {
        state.activeTabName = index;
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
    },
    isContainMenu(state, menu_link) {
        //是否包含某个菜单
        return (state.menuTreeListFlatten.filter(item => item.menu_link == menu_link).length > 0);
    },
    addBreadCrumb(state, index) {
        state.breadCrumbList.breadCrumbList = [];
        state.breadCrumbList.selectArray = [];
        var mapTab = state.menuTreeListFlatten.filter(item => item.menu_link == index);
        if (mapTab.length > 0) {
            mapTab = mapTab[0];
            state.breadCrumbList.breadCrumbList = findFatherIndex(mapTab, []);
            state.breadCrumbList.selectArray = state.menuTreeListFlatten.filter(item => item.menu_pid == mapTab.menu_pid);//找到同级节点
            state.breadCrumbList.breadCrumbList.splice(0, 0, {
                menu_id: 0,
                menu_pid: 0,
                menu_link: 'main',
                menu_name: '首页'
            });
        }
        state.activeTabName = index;
    },
    emptyBreadCrumb(state) {
        state.breadCrumbList.breadCrumbList = [];
        state.breadCrumbList.selectArray = [];
    }
};
/*
*多维数组数组扁平化
*/
function arrayChildrenFlatten(array, result) {
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        result.push(item);
        if (item.children && item.children.length > 0) {
            result = arrayChildrenFlatten(item.children, result);
        }
    }
    return result;
}
function findFatherIndex(mapTab, array) {
    array.splice(0, 0, {
        menu_id: mapTab.menu_id,
        menu_pid: mapTab.menu_pid,
        menu_link: mapTab.menu_link,
        menu_name: mapTab.menu_name
    })
    if (mapTab.menu_pid > 0) {
        var mapTabF = state.menuTreeListFlatten.filter(item => item.menu_id == mapTab.menu_pid);
        if (mapTabF.length) {
            mapTabF = mapTabF[0];
            findFatherIndex(mapTabF, array);
        }
    }
    return array;
}

const getters = {
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

};
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}