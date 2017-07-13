import './control.css';
import React from 'react';
import { connect } from 'react-redux';  
import { Button, message, Menu, Dropdown, Icon, Modal } from 'antd'; 
import SaveConfirm from '../utils/saveConfirm.jsx';
import { getSelect, setSelect } from '../utils/select';
import { formatStore } from '../utils/formatStore';
import { fixToNormal, cancelDraw } from '../utils/regionFunc';
import { noCurStore } from '../utils/storeListCheck';
import ActionCommand from '../utils/actionCommand';

import * as Service from '../../../services/index';
import { SET_STATUS, INCREASE_MAXNUM, SET_CONFIRMSHOW, RESET_STORE } from '../../../action/actionTypes';
import STATUSCONF from '../../../config/status';

class Control extends React.Component{
  constructor(props) {
    super(props);

    this.drawPloy = this.drawPloy.bind(this);
    this.setMerge = this.setMerge.bind(this);
    this.deleteStore = this.deleteStore.bind(this);
    this.mergeStore = this.mergeStore.bind(this);
    this.editStart = this.editStart.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.editRegion = this.editRegion.bind(this);
    this.submitAll = this.submitAll.bind(this);
    this.cancelAct = this.cancelAct.bind(this);

    this.fixStoreParam = this.fixStoreParam.bind(this);
    this.clearActiveState = this.clearActiveState.bind(this);
    this.newStoreId = this.newStoreId.bind(this);
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

	fixStoreParam(obj) {
    // const getNewStoreId = () => {
    //   const floor = this.props.map;
    //   this.props.dispatch({
    //     type : INCREASE_MAXNUM
    //   });

		// 	return floor.plazaId + '_' + floor.floorName + '_' + floor.floorMaxNum;
    // };

    return formatStore(obj);
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
        regionParam.push( this.fixStoreParam(item) );
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

  //合并
  setMerge() {
    this.props.store.curStore.map((i) => {
      fixToNormal(i)
    })

    this.props.dispatch({
      type : SET_STATUS,
      status : STATUSCONF.merge
    });
  }

  mergeStore(store) {
    const storeList = this.props.store.curStore;
    if(storeList.length < 2) {
      Modal.warning({
        title : '提示',
        content : '请先选择两个合并对象！'
      });
    }
    else {
      const s0 = storeList[0];
      const s1 = storeList[1];

      if( s0.getBounds().intersects(s1.getBounds()) ) {
        let coords = [];
        const union = turf.union(s0.toGeoJSON(), s1.toGeoJSON());
        const layer = this.props.map.ffmap.drawGeoJSON(union, {editable: true});

        s0.remove();
        s0.label.remove();

        s1.remove();
        s1.label.remove();
        this.props.map.ffmap.addOverlay(layer);

        let newId = this.newStoreId();
        layer.feature = {
          id : newId,
          properties : {
            re_name : '',
            re_type : ''
          }
        };
              
        const coordObj = turf.coordAll(union).map(item => {
          return {
            lat : item[1],
            lng : item[0]
          };
        });
        coords = FMap.Utils.getOriginalByLatlngs(coordObj);

        layer.coordinates = coords;
        layer.coorChange = true;
        const _s = [layer].concat(storeList);

        for(let i = _s.length; i > 0; i--) {
          let item = _s[i - 1];
          let actCommand = new ActionCommand({
            action : item.action || '',
            id : item.feature.id,
            properties : item.feature.properties
          });
          this.props.store.actionCommand.unshift(actCommand);

        }

        s0.action = 'DELETE';
        s1.action = 'DELETE';
        layer.action = 'NEW';

        this.props.dispatch({
          type : RESET_STORE,
          data : {
            curStore : _s,
            store : _s
          }
        });
        //手动添加一个名称label
        const centerLatLng = layer.getBounds().getCenter();
        this.props.newNameLabel(centerLatLng, layer, layer);
        layer.centerPoint = centerLatLng;
        layer.on('click', e => {
          this.props.initFeatureClick(e);
        });

        this.props.dispatch({
          type : SET_STATUS,
          status : STATUSCONF.start
        });
      }
      else {
        Modal.warning({
          title : '提示',
          content : '无法合并！'
        });
      }
    }
  }

  //delete
  deleteStore() {
    const curStoreList = this.props.store.curStore;
    if(!noCurStore(curStoreList)) return;

    let cur = curStoreList[0];
    cur.action = 'DELETE';
    this.props.dispatch({
      type : SET_CONFIRMSHOW,
      data : true
    });
    this.props.openConfirm(cur);
  }

  //商铺修型
  editRegion() {
    const curStoreList = this.props.store.curStore;
    if(!noCurStore(curStoreList)) return;
    let cur = curStoreList[0];

    cur.action = 'UPDATE';
    cur.coorChange = true;

    if(cur.enableEdit) {
      cur.enableEdit();
    }
    else {
      cur.eachLayer(i => {
        i.enableEdit();
      });
    }

    const _latlngList = cur.getLatLngs()[0].length > 1 ? cur.getLatLngs()[0] : cur.getLatLngs()[0][0];
    const _latlng = _latlngList.map(item => {
      return Object.assign({}, item);
    });

    // this.props.store.actionCommand.initial(this.props.store.store);
    // const newList = this.props.store.actionCommand.execute([cur]);
    this.props.store.bkStore[0].coordinates = [[_latlng]];
    this.props.store.actionCommand.unshift(new ActionCommand(this.props.store.bkStore[0]));

    this.props.dispatch({
      type : RESET_STORE,
      data : {
        store : [cur]
      }
    });


    
  }

  //开始编辑
  editStart() {
    Service.editStartAjax(
      preAjaxUrl + '/mapeditor/map/editStart/' + this.props.map.plazaId + '/' + this.props.map.floorId,
      () => {
          this.props.dispatch({
            type: SET_STATUS,
            status : STATUSCONF.start
          });
      }
    );
  }

  //新增商铺
  drawPloy() {
    const newStore = this.props.map.ffmap.startPolygon();
    newStore.action = "NEW";
    newStore.coorChange = true;

    const newId = this.newStoreId();
    newStore.feature = {
      id : newId,
      properties : {
        re_name : '',
        re_type : ''
      }
    };
    this.clearActiveState();

    this.props.store.actionCommand.unshift(new ActionCommand({
      action : '',
      id : '',
      properties : {}
    }));
    this.props.dispatch({
      type : RESET_STORE,
      data : {
        curStore : [newStore],
        store : [newStore]
      }
    });

    newStore.on('click', e => {
      this.props.initFeatureClick(e);
    });
  }

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

  //取消操作
  cancelAct() {
    const curStoreList = this.props.store.curStore;
    if(!noCurStore(curStoreList)) return;

    for(let i = 0, l = curStoreList.length; i < l; i++) {
      let item = curStoreList[i];
      // let bkItem = this.props.store.bkStore[i]; 
      let actionCommand = this.props.store.actionCommand[i];
      const upData = actionCommand.undo(); //本次修改之前的数据

      if(upData.id != item.feature.id) {
        message.warning('没有可回退的操作！');
        return;
      }
      
      if(item.action == 'NEW') {
        cancelDraw(item);
      }
      else {
        if(item.action == 'UPDATE' && item.coorChange) {
          item.disableEdit();
          item.setLatLngs(upData.coordinates);
        }
        
        if(item.action == 'DELETE') {
          this.props.map.ffmap.addOverlay(item);
          this.props.newNameLabel(item.getCenter(), item, item);
        }
      
        if(upData.properties.re_name) {
          item.label.setContent(upData.properties.re_name);
        }
        Object.assign(item, {feature : {properties : upData.properties}});
      }
      item.action = upData.action;
      if(getSelect(item)) {
        setSelect(item, false);
      }
      
    }

    this.props.dispatch({
      type : SET_STATUS,
      status : STATUSCONF.cancel
    })

    this.props.dispatch({
      type : RESET_STORE,
      data : {
        curStore : [],
        actionCommand : this.props.store.actionCommand.slice(1),
        bkStore : []
      }
    })
    
  }

  render() {
    const data = this.props.control;
    const name0 = "s-btn s-cancel clearfix" + (data.isActive === true ? '' : ' disable');
    const name1 = "s-btn s-add clearfix" + (data.isActive === true ? '' : ' disable');
    const name2 = "s-btn s-edit clearfix" + (data.isActive === true ? '' : ' disable');
    const name3 = "s-btn s-delete clearfix" + (data.isActive === true ? '' : ' disable');
    const name4 = "s-btn s-merge clearfix" + (data.isMerge ? '' : ' disable');

    const mergeStyle = {'display' : (data.isSubMerge ? 'none' : 'inline-block')};
    const submergeStyle = {'display' : (data.isSubMerge ? 'inline-block' : 'none')};

    const startStyle = {'display' : (data.isStart ? 'inline-block' : 'none')};
    const saveStyle = {'display' : (data.isStart || (data.isActive == 2) ? 'none' : 'inline-block')};
  
    return (
      <div className="control">
        <a className={name0} onClick={this.cancelAct}>回退</a>
        <a className={name1} onClick={this.drawPloy}><i className="s-icon"></i>新增</a>
        <a className={name2} onClick={this.editRegion} ><i className="s-icon"></i>修型</a>
        <a className={name3} onClick={this.deleteStore}><i className="s-icon"></i>删除</a>
        <a className={name4} style={mergeStyle} onClick={this.setMerge}><i className="s-icon"></i>合并</a>
        <a className="s-btn s-merge clearfix" style={submergeStyle} onClick={this.mergeStore}><i className="s-icon"></i>执行合并</a>

        <Button className="e-save" style={startStyle} type="primary" onClick={this.editStart}>开始编辑</Button>
        <Button className="e-save" style={saveStyle} type="primary" onClick={this.saveEdit}>保存</Button>
        <Button className="e-save" type="primary" onClick={this.submitAll} disabled={data.isSubmit}>结束编辑</Button>
        <SaveConfirm ref="saveConfirm" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Control);