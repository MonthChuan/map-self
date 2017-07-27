import React from 'react';
import { connect } from 'react-redux';  
import { Button, Modal } from 'antd'; 
import { getSelect, setSelect } from '../utils/select';
import { fixToNormal } from '../utils/regionFunc';
import ActionCommand from '../utils/actionCommand';
import { SET_STATUS, INCREASE_MAXNUM, RESET_STORE, ADD_NEWLAYERS } from '../../../action/actionTypes';
import STATUSCONF from '../../../config/status';

class Merge extends React.Component{
  constructor(props) {
    super(props);

    this.setMerge = this.setMerge.bind(this);
    this.mergeStore = this.mergeStore.bind(this);
    this.newStoreId = this.newStoreId.bind(this);
  }

  newStoreId() {
    const floor = this.props.map;
    this.props.dispatch({
      type : INCREASE_MAXNUM
    });

    return floor.plazaId + '_' + floor.floorName + '_' + floor.floorMaxNum;
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

  render() {
    const data = this.props.control;

    let nameList = [];
    ['merge', 'submerge'].map((type) => {
      nameList.push([
        's-btn clerfix s-' , 
        type , 
        data.activeType == type ? ' s-active' : ''
        ].join('')
      )
    });

    const mergeStyle = {'display' : (data.isSubMerge ? 'none' : 'inline-block')};
    const submergeStyle = {'display' : (data.isSubMerge ? 'inline-block' : 'none')};

    return (
      <div className="merge-wrap">
        <a title="合并" className={nameList[0]} style={mergeStyle} onClick={this.setMerge}>
          <i className="s-icon"></i>
        </a>
        <a title="执行合并" className={nameList[1]} style={submergeStyle} onClick={this.mergeStore}>
          <i className="s-icon"></i>执行合并
        </a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Merge);