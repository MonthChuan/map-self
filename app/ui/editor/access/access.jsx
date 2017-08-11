import './access.css';
import React from 'react';
import { connect } from 'react-redux';  
import { Button, message, Modal } from 'antd'; 

import ActionCommand from '../utils/actionCommand';

import * as Service from '../../../services/index';
import { formatStoreList } from '../utils/formatStore';
import { fixToNormal, cancelDraw } from '../utils/regionFunc';
import { RESET_STORE, SET_STATUS, SET_STORE } from '../../../action/actionTypes';
import { getSelect, setSelect } from '../utils/select';
import STATUSCONF from '../../../config/status';


class Access extends React.Component{
  constructor(props) {
    super(props);
    this.clearActiveState = this.clearActiveState.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.editEnd = this.editEnd.bind(this);
    this.submitCheck = this.submitCheck.bind(this);
  }

  clearActiveState() {
    this.props.store.curStore.map(i => {
      setSelect(i, false);
      fixToNormal(i);
    })
  }

  //保存
  saveEdit() {
    const storeList = this.props.store.store;
    const control = this.props.control;
    const map = this.props.map;

    if(storeList.length == 0) {
      message.warning('没有未保存的操作！', 3);
			return;
    }

    let regionParam = formatStoreList(storeList);
    Service.saveDataAjax(
      preAjaxUrl + '/mapeditor/map/plaza/edit/region/' + map.plazaId + '/' + map.floorId,
      regionParam,
      () => {
        Modal.success({
          title : '提示',
          content : '保存成功！'
        });
      }
    );

    this.clearActiveState();
    this.props.dispatch({
      type : SET_STORE,
      data : {
        curStore : [],
        store : [],
        bkStore : [],
        actionCommand : []
      }
    });
    this.props.dispatch({
      type: SET_STATUS,
      status : STATUSCONF.start
    });
  }

  editEnd() {
    const store = this.props.store.store;
    if(store.length > 0) {
      Modal.warning({
          title : '提示',
          content : '您有操作未保存，请先保存！'
      });
      return;
    }
    //todo结束本次编辑。。。

    Service.editEndAjax(
      preAjaxUrl + '/mapeditor/map/editEnd/' + this.props.map.plazaId,
      () => {
        this.clearActiveState();
        Modal.success({
          title : '',
          content : '已经提交审核，请耐心等待！'
        });
        this.props.dispatch({
          type : SET_STATUS,
          status : STATUSCONF.editEnd
        });
      }
    );
  } 

  submitCheck(value) {
    this.clearActiveState();
    Service.submitCheckAjax(
			preAjaxUrl + '/mapeditor/map/editVerify/' + this.props.map.plazaId,
			value,
			(req) => {
				 Modal.success({
          title: '已成功提交审核！'
        });
			}
		)
  }

  render() {
    const data = this.props.control;
    let btnTpl = '' ;
    if (this.props.map.pageType && this.props.map.pageType == 'edit') {
      btnTpl = (
        <p>
          <Button className="btn" type="primary" onClick={this.saveEdit}>保存</Button>
          <Button className="btn" type="primary" onClick={this.editEnd}>结束编辑</Button>
        </p>
      );
    }
    else if(this.props.map.pageType && this.props.map.pageType == 'review') {
      btnTpl = (
        <p>
          <Button className="btn" type="primary" onClick={()=>{this.submitCheck(1)}}>审核通过</Button>
          <Button className="btn" type="primary" onClick={()=>{this.submitCheck(0)}}>审核不通过</Button>
        </p>
      );
    }

    return (
      <div className="access-wrap">
        {btnTpl}
        {/*<SaveConfirm ref="saveConfirm" />*/}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Access);