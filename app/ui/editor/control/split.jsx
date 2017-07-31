import React from 'react';
import { connect } from 'react-redux';  
import { Button, Modal } from 'antd'; 
import { getSelect, setSelect } from '../utils/select';
import { fixToNormal } from '../utils/regionFunc';
import ActionCommand from '../utils/actionCommand';
import { SET_STATUS, INCREASE_MAXNUM, RESET_STORE, ADD_NEWLAYERS } from '../../../action/actionTypes';
import STATUSCONF from '../../../config/status';

class Split extends React.Component{
  constructor(props) {
    super(props);

    this.line = null;
    this.setSplit = this.setSplit.bind(this);
    this.setSubSplit = this.setSubSplit.bind(this);
    this.newStoreId = this.newStoreId.bind(this);
  }

  newStoreId() {
    const floor = this.props.map;
    this.props.dispatch({
      type : INCREASE_MAXNUM
    });

    return floor.plazaId + '_' + floor.floorName + '_' + floor.floorMaxNum;
  }

  setSplit() {
    this.props.store.curStore.map((i) => {
      fixToNormal(i)
    })

    this.props.dispatch({
      type : SET_STATUS,
      status : STATUSCONF.splitS
    });

    this.line = this.props.map.ffmap.startPolyline();

    // if(this.props.store.curStore[0] && !this.props.store.curStore[0].selected) {
    //   this.props.dispatch({
		// 		type : RESET_STORE,
		// 		data : {
		// 			curStore : []
		// 		}
		// 	});
    // }
  }

  setSubSplit(store) {
    const curStoreList = this.props.store.curStore;
    if(curStoreList.length == 0) {
      Modal.warning({
        title : '提示',
        content : '请先选择拆分对象！'
      });
    }
    else {
      const s0 = curStoreList[0];

      const intersects = turf.intersect(s0.toGeoJSON(), this.line.graphics.toGeoJSON());
      console.log(intersects)
      if( intersects ) {
        const layer = this.props.map.ffmap.drawGeoJSON(intersects);
         this.props.map.ffmap.addOverlay(layer);
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
    ['split', 'subsplit'].map((type) => {
      nameList.push([
        's-btn clerfix s-' , 
        type , 
        data.activeType == type ? ' s-active' : ''
        ].join('')
      )
    });

    const splitStyle = {'display' : (data.isSubSplit ? 'none' : 'inline-block')};
    const subsplitStyle = {'display' : (data.isSubSplit ? 'inline-block' : 'none')};

    return (
      <div className="split-wrap">
        <a title="拆分" className={nameList[0]} style={splitStyle} onClick={this.setSplit}>
          <i className="s-icon"></i>
        </a>
        <a title="执行拆分" className={nameList[1]} style={subsplitStyle} onClick={this.setSubSplit}>
          <i className="s-icon"></i>执行拆分
        </a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Split);