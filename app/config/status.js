/**
 * 按钮各种状态
 */

//初始化
const initial = {
  isAdd : false,
  isEdit : false,
  isDelete : false,
  isMerge : false,
  isSubMerge : false,
  isZT : false,
  isStart : true,
  isActive : false,
  isSubmit : false
};

//开始编辑
const start = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : true,
    isSubMerge : false,
    isZT : true,
    isStart : false,
    isActive : false
};

//保存
const save = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : true,
    isSubMerge : false,
    isZT : true,
    isStart : false,
    isActive : false
};

//新增商铺
const add = {
    isAdd : true,
    isEdit : false,
    isDelete : false,
    isMerge : false,
    isSubMerge : false,
    isZT : false,
    isStart : false,
    isActive : true
};

//商铺编辑
const edit = {
    isAdd : false,
    isEdit : true,
    isDelete : false,
    isMerge : false,
    isSubMerge : false,
    isZT : false,
    isStart : false,
    isActive : true
};

//商铺删除
const sdelete = {
    isAdd : false,
    isEdit : false,
    isDelete : true,
    isMerge : false,
    isSubMerge : false,
    isZT : false,
    isStart : false,
    isActive : true
};

//商铺合并
const merge = {
    isAdd : false,
    isEdit : false,
    isDelete : false,
    isMerge : true,
    isSubMerge : false,
    isZT : false,
    isStart : false,
    isActive : true
};

//取消操作
const cancel = {
    isAdd : true,
    isEdit : true,
    isDelete : true,
    isMerge : true,
    isSubMerge : false,
    isZT : true,
    isStart : false,
    isActive : false
};

//结束编辑提交审核
const editEnd = {
    isAdd : false,
    isEdit : false,
    isDelete : false,
    isMerge : false,
    isSubMerge : false,
    isZT : false,
    isStart : false,
    isActive : 2
};


export default {
    initial,
    start,
    save,
    add,
    edit,
    sdelete,
    merge,
    cancel,
    editEnd
}