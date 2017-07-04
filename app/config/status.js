/**
 * 按钮各种状态
 */

//初始化
let initial = {
  isAdd : false,
  isEdit : false,
  isDelete : false,
  isMerge : false,
  isSubMerge : false,
  isStart : true,
  isActive : false,
  isSubmit : false
};

//开始编辑
let start = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : true,
    isSubMerge : false,
    isStart : false,
    isActive : true
};

//保存
// let save = {
//     isAdd : true,
//     isEdit : true,
//     isDelete : true,
//     isMerge : true,
//     isSubMerge : false,
//     isZT : true,
//     isStart : false,
//     isActive : false
// };

//新增商铺
// let add = {
//     isAdd : true,
//     isEdit : false,
//     isDelete : false,
//     isMerge : false,
//     isSubMerge : false,
//     isZT : false,
//     isStart : false,
//     isActive : true
// };

//商铺编辑
// let edit = {
//     isAdd : false,
//     isEdit : true,
//     isDelete : false,
//     isMerge : false,
//     isSubMerge : false,
//     isZT : false,
//     isStart : false,
//     isActive : true
// };

//商铺删除
// let sdelete = {
//     isAdd : false,
//     isEdit : false,
//     isDelete : true,
//     isMerge : false,
//     isSubMerge : false,
//     isZT : false,
//     isStart : false,
//     isActive : true
// };

//商铺合并
let merge = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : false,
    isSubMerge : true,
    isStart : false,
    isActive : true
};

// let subMerge = {
//     isAdd : true,
//     isEdit : true,
//     isDelete : true,
//     isMerge : false,
//     isSubMerge : 2,
//     isStart : false,
//     isActive : true
// };

//取消操作
let cancel = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : true,
    isSubMerge : false,
    isStart : false,
    isActive : true
};

//结束编辑提交审核
let editEnd = {
    isAdd : false,
    isEdit : false,
    isDelete : false,
    isMerge : false,
    isSubMerge : false,
    isStart : false,
    isActive : 2
};


// let active = {
//     isAdd : true,
//     isEdit : true,
//     isDelete : true,
//     isMerge : true,
//     isSubMerge : false,
//     isStart : false,
//     isActive : true
// };



export default {
    initial,
    start,
    cancel,
    editEnd,
    merge
    
    
    // ,

    // active
}