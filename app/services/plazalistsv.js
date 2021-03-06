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

//广场操作列表
export const getPlazaVerifyListAjax = (params,success) => {
    $get(
        preAjaxUrl + '/mapeditor/auth/verify/plazas',
        params,
        (req) => {
            callback(req, success);
        }
    );
};

//广场操作历史
export const getPlazaHistoryAjax = (params,success) => {
    $get(
        preAjaxUrl + '/mapeditor/auth/verify/his',
        params,
        (req) => {
            callback(req, success);
        }
    );
};

//开始审核广场前调用此接口
export const postVerifyPlazaAjax = (params,success) => {
    $post(
        preAjaxUrl + '/mapeditor/auth/verify',
        params,
        (req) => {
            callback(req, success);
        }
    );
};

//开始编辑广场前调用此接口
export const postEditPlazaAjax = (params,success) => {
    $post(
        preAjaxUrl + '/mapeditor/auth/edit',
        params,
        (req) => {
            callback(req, success);
        }
    );
};
