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
        'http://yunjin.intra.sit.ffan.com/mapeditor/plaza/v1/indoor/plazas',
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
            cb();
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
