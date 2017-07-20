import './access.css';
import React from 'react';
import { connect } from 'react-redux';  
import { Button } from 'antd'; 

import ActionCommand from '../utils/actionCommand';

import * as Service from '../../../services/index';
// import {  } from '../../../action/actionTypes';
// import STATUSCONF from '../../../config/status';

class Access extends React.Component{
  constructor(props) {
    super(props);
  }

  newStoreId() {
    const floor = this.props.map;
    this.props.dispatch({
      type : INCREASE_MAXNUM
    });

    return floor.plazaId + '_' + floor.floorName + '_' + floor.floorMaxNum;
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

    let regionParam = [];
    storeList.map(item => {
      if(item.action && item.action != '') {
        regionParam.push( formatStore(item) );
      }
		});

    Service.saveDataAjax(
      preAjaxUrl + '/mapeditor/map/plaza/edit/region/' + map.plazaId + '/' + map.floorId,
      regionParam,
      () => {
        Modal.success({
          title : '提示',
          content : '保存成功！'
        });
      },
      () => {
        fixToNormal(storeList[0]);

        // this.props.dispatch({
        //   type : SET_STATUS,
        //   status : STATUSCONF.save
        // });

        this.props.dispatch({
          type : RESET_STORE,
          data : {
            curStore : [],
            store : [],
            bkStore : [],
            actionCommand : []
          }
        })
      }
    );
  }


  //开始编辑
  // editStart() {
  //   Service.editStartAjax(
  //     preAjaxUrl + '/mapeditor/map/editStart/' + this.props.map.plazaId + '/' + this.props.map.floorId,
  //     () => {
  //         this.props.dispatch({
  //           type: SET_STATUS,
  //           status : STATUSCONF.start
  //         });
  //     }
  //   );
  // }

  submitAll() {
    const store = this.props.store.store;
    if(store.length > 0 && store[0].action != 'SHOW') {
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


  render() {
    const data = this.props.control;
    return (
      <div className="access-wrap">
        {/*<Button className="e-save" style={startStyle} type="primary" onClick={this.editStart}>开始编辑</Button>*/}
        <Button className="btn" type="primary" onClick={this.saveEdit}>保存</Button>
        <Button className="btn" type="primary" onClick={this.submitAll}>结束编辑</Button>
        {/*<SaveConfirm ref="saveConfirm" />*/}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Access);