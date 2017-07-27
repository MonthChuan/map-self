/**
 * 按钮各种状态
 */

//初始化
// let initial = {
//   isAdd : false,
//   isEdit : false,
//   isDelete : false,
//   isMerge : false,
//   isSubMerge : false,
//   isStart : true,
//   isActive : false,
//     activeType : ''
// };

//开始编辑
let start = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : true,
    isSubMerge : false,
    isSubSplit : false,
    isStart : false,
    isActive : true,
    activeType : ''
};

let addS = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : true,
    isSubMerge : false,
    isSubSplit : false,
    isStart : false,
    isActive : true,
    activeType : 'add'
};

let editS = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : true,
    isSubMerge : false,
    isSubSplit :false,
    isStart : false,
    isActive : true,
    activeType : 'edit'
};

let deleteS = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : true,
    isSubMerge : false,
    isSubSplit :false,
    isStart : false,
    isActive : true,
    activeType : 'delete'
};

// //取消操作
// let cancel = {
//     isAdd : true,
//     isEdit : true,
//     isDelete : true,
//     isMerge : true,
//     isSubMerge : false,
//     isStart : false,
//     isActive : true,
//     activeType : ''
// };



//商铺合并
let merge = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : false,
    isSubMerge : true,
    isSubSplit : false,
    isStart : false,
    isActive : true,
    activeType : 'submerge'
};

//商铺拆分
let splitS = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : true,
    isSubMerge : false,
    isSubSplit : true,
    isStart : false,
    isActive : true,
    activeType : 'subsplit'
};

//结束编辑提交审核
let editEnd = {
    isAdd : false,
    isEdit : false,
    isDelete : false,
    isMerge : false,
    isSubMerge : false,
    isSubSplit : false,
    isStart : false,
    isActive : 2,
    activeType : ''
};

export default {
    // initial,
    start,
    addS,
    editS,
    deleteS,
    splitS,
    // cancel,





    editEnd,
    merge
}