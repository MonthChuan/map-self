/**
 * 编辑页面对应的ajax请求
 */
import { $ajax, $get, $post } from './ajax.js';
import { Modal } from 'antd';

const callback = (req, suc = ()=>{}, err = ()=>{}) => {
    if(req.status == 200) {
        suc(req);
    }
    else {
        if(req.status == 460) {
            location.href = location.pathname + '#/login';
        }
        else {
            Modal.error({
                title : '注意',
                content : req.message
            });
            err();
        }
    }
};

//获取广场列表
export const getPlazaListAjax = (success) => {
    $get(
        window.preAjaxUrl + '/mapeditor/plaza/v1/indoor/plazas',
        {'pageSize' : 100},
        (req) => {
            callback(req, success);
        }
    );
};

//开始编辑
export const editStartAjax = (url, success) => {
    $post(
        url,
        null,
        (req) => {
            callback(req, success);
        }
    );
};

//保存数据
export const saveDataAjax = (url, regions, success, cb) => {
    $post(
        url,
        {"data" : JSON.stringify(regions)},
        (req) => {
            callback(req, success);
            // cb();
        }
    );
};

//结束编辑 提交审核
export const editEndAjax = (url, success) => {
    $post(
        url,
        null,
        (req) => {
            callback(req, success);
        }
    );
}

//结束审核
export const submitCheckAjax = (url, checkStatus, success) => {
    $post(
        url,
        {"verifyResult" : checkStatus},
        (req) => {
            callback(req, success);
        }
    );
}

//获取业态分类数据
export const getCatgoryAjax = (success) => {
    $get(
        window.preAjaxUrl + '/mapeditor/category/categoryCodes',
        null,
        (req) => {
            callback(req, success);
        }
    );
}

//用户登陆
export const userLogin = (data, success) => {
     $post(
        window.preAjaxUrl + '/mapeditor/user/v1/login?phone=' + data.phone + '&password=' + data.password,
        null,
        (req) => {
            success(req);
        }
    );
};
