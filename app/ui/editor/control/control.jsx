import './control.css';
import React from 'react';
import { connect } from 'react-redux';  
import { Button, message, Menu, Dropdown, Icon, Modal } from 'antd'; 
// import SaveConfirm from '../utils/saveConfirm.jsx';
import { getSelect, setSelect } from '../utils/select';
import { formatStore } from '../utils/formatStore';
import { fixToNormal, cancelDraw } from '../utils/regionFunc';
import { noCurStore, noCancelStore } from '../utils/storeListCheck';
import ActionCommand from '../utils/actionCommand';

import * as Service from '../../../services/index';
import { SET_STATUS, INCREASE_MAXNUM, SET_CONFIRMSHOW, RESET_STORE, ADD_NEWLAYERS } from '../../../action/actionTypes';
import STATUSCONF from '../../../config/status';

import Floor from '../floor/floor';

class Control extends React.Component{
  constructor(props) {
    super(props);

    this.drawPloy = this.drawPloy.bind(this);
    this.setMerge = this.setMerge.bind(this);
    this.deleteStore = this.deleteStore.bind(this);
    this.mergeStore = this.mergeStore.bind(this);
    this.editRegion = this.editRegion.bind(this);
    this.cancelAct = this.cancelAct.bind(this);

    this.clearActiveState = this.clearActiveState.bind(this);
    this.newStoreId = this.newStoreId.bind(this);

    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
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

  zoomOut() {
    if(this.props.map.ffmap) {
      this.props.map.ffmap.zoomOut();
    }
  }
  zoomIn() {
    if(this.props.map.ffmap) {
      this.props.map.ffmap.zoomIn();
    }
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

    if(this.props.store.curStore[0] && !this.props.store.curStore[0].selected) {
      this.props.dispatch({
				type : RESET_STORE,
				data : {
					curStore : []
				}
			});
    }
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
        const union = turf.union(s0.toGeoJSON(), s1.toGeoJSON());
        const newId = this.newStoreId();
        Object.assign(union, {
          id : newId,
          properties : {
            re_name : '',
            re_type : '',
            region_id : newId
          }
        });
        const coordObj = turf.coordAll(union).map(item => {
          return {
            lat : item[1],
            lng : item[0]
          };
        });
        const coords = FMap.Utils.getOriginalByLatlngs(coordObj);
        union.coordinates = coords;

        s0.remove();
        if(s0.label) {
          s0.label.remove();
        }
        s1.remove();
        if(s1.label) {
          s1.label.remove();
        }

        const layerGroup = this.props.map.ffmap.drawGeoJSON(union, {editable: true});
        let layer = null;
        layerGroup.eachLayer(i => {
          if(!layer) {
            layer = i;
          }
        });
        this.props.map.ffmap.addOverlay(layer);

        const _s = [layer].concat(storeList);
        for(let i = _s.length; i > 0; i--) {
          let item = _s[i - 1];
          let actCommand = new ActionCommand({
            action : item.action || '',
            id : item.feature.id,
            properties : item.feature.properties
          });
          this.props.store.actionCommand.unshift(actCommand);

          setSelect(item, false);
        }
        s0.action = 'DELETE';
        s1.action = 'DELETE';
        layer.action = 'NEW';
        layer.coorChange = true;
        layer.coordinates = coords;

        this.props.dispatch({
          type : RESET_STORE,
          data : {
            curStore : _s,
            store : _s
          }
        });
        // 手动添加一个名称label
        const centerLatLng = layer.getBounds().getCenter();
        this.props.newNameLabel(centerLatLng, layer, layer);
        layer.centerPoint = centerLatLng;
        layer.on('click', e => {
          this.props.initFeatureClick(e);
        });

        this.props.dispatch({
          type : ADD_NEWLAYERS,
          data : layer
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

    this.props.dispatch({
      type: SET_STATUS,
      status : STATUSCONF.deleteS
    });
  }

  //商铺修型
  editRegion() {
    this.props.dispatch({
      type : SET_STATUS,
      status : STATUSCONF.start
    });
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

    const bkStore0 = this.props.store.bkStore[0] || {};
    bkStore0.coordinates = [[_latlng]];
    this.props.store.actionCommand.unshift(new ActionCommand(bkStore0));

    this.props.dispatch({
      type : RESET_STORE,
      data : {
        store : [cur]
      }
    });

    this.props.dispatch({
      type: SET_STATUS,
      status : STATUSCONF.editS
    });


    
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

    // this.props.store.actionCommand.unshift(new ActionCommand({
    //   action : '',
    //   id : newId,
    //   properties : {}
    // }));
    // this.props.dispatch({
    //   type : RESET_STORE,
    //   data : {
    //     curStore : [newStore],
    //     store : [newStore]
    //   }
    // });

    this.props.dispatch({
      type: SET_STATUS,
      status : STATUSCONF.addS
    });

    newStore.on('click', e => {
      this.props.initFeatureClick(e);
    });

    newStore.on('editable:dragend', event => {
      const region = event.target;
      const latlng = region.graphics.getCenter();
      if(!region.label) {
				return;
			}
      region.label.setLatLngs(latlng);
    });

    // newStore.on('editable:created', event => {
      this.props.dispatch({
        type : ADD_NEWLAYERS,
        data : newStore
      });

    // });

    newStore.on('editable:drawing:end', event => {
       this.props.store.actionCommand.unshift(new ActionCommand({
          action : '',
          id : newId,
          properties : {}
        }));
        this.props.dispatch({
          type : RESET_STORE,
          data : {
            curStore : [newStore],
            store : [newStore]
          }
        });

        this.props.dispatch({
					type: SET_STATUS,
					status : STATUSCONF.start
				});
    });
  }

  //取消操作
  cancelAct() {
    const curStoreList = this.props.store.curStore;
    const actionList = this.props.store.actionCommand;
    if(!noCancelStore(curStoreList, actionList)) return;

    for(let i = 0, l = curStoreList.length; i < l; i++) {
      let item = curStoreList[i]; 
      let actionCommand = actionList[i];
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
      status : STATUSCONF.start
    })

    this.props.dispatch({
      type : RESET_STORE,
      data : {
        curStore : [],
        actionCommand : actionList.slice(1),
        bkStore : []
      }
    })
    
  }

  render() {
    const data = this.props.control;

    let nameList = [];
    ['zoomin', 'zoomout', 'cancel', 'add', 'edit', 'delete', 'merge', 'submerge'].map((type) => {
      let isDisable = '';
      if(type == 'merge') {
        isDisable = data.isMerge ? '' : ' disable';
      }
      else if(type == 'submerge') {
        isDisable = '';
      }
      else {
        isDisable = data.isActive === true ? '' : ' disable';
      }
      nameList.push([
        's-btn clerfix s-' , 
        type , 
        data.activeType == type ? ' s-active' : ''
        // isDisable
        ].join('')
      )
    });

    const mergeStyle = {'display' : (data.isSubMerge ? 'none' : 'inline-block')};
    const submergeStyle = {'display' : (data.isSubMerge ? 'inline-block' : 'none')};

    return (
      <div className="control">
        <a title="放大" className={nameList[0]} onClick={this.zoomIn}>
            <i className="s-icon"></i>
        </a>
        <a title="缩小" className={nameList[1]} onClick={this.zoomOut}>
            <i className="s-icon"></i>
        </a>
        <a title="回退" className={nameList[2]} onClick={this.cancelAct}>
            <i className="s-icon"></i>
        </a>
        <a title="新增" className={nameList[3]} onClick={this.drawPloy}>
            <i className="s-icon"></i>
        </a>
        <a title="修型" className={nameList[4]} onClick={this.editRegion} >
          <i className="s-icon"></i>
        </a>
        <a title="删除" className={nameList[5]} onClick={this.deleteStore}>
          <i className="s-icon"></i>
        </a>
        <a title="合并" className={nameList[6]} style={mergeStyle} onClick={this.setMerge}>
          <i className="s-icon"></i>
        </a>
        <a title="执行合并" className={nameList[7]} style={submergeStyle} onClick={this.mergeStore}>
          <i className="s-icon"></i>执行合并
        </a>

        <Floor />
        {/*<SaveConfirm ref="saveConfirm" />*/}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Control);