import './floor.css';
import React from 'react';
import { connect } from 'react-redux';  
import { RESET_NEWLAYERS, SET_STORE, SET_STATUS, SET_FLOORINFO } from '../../../action/actionTypes';
import STATUSCONF from '../../../config/status';
import { Select, Modal } from 'antd'; 
const Option = Select.Option;

class Floor extends React.Component{
  constructor(props) {
    super(props);
    this.floorChange = this.floorChange.bind(this);
  }

  floorChange(event) {
    if(this.props.store.store.length > 0) {
      Modal.warning({
          title : '提示',
          content : '您有操作未保存，请先保存！'
      });
      return;
    }
    const floor = event.key;
    const mapStore = this.props.map;
    if(mapStore.newLayers.length > 0) {
      mapStore.newLayers.map(item => {
        if(item.graphics) {
            item.graphics.remove();
        }
        else if(item.remove) {
          item.remove();
        }
      });
      this.props.dispatch({
        type : RESET_NEWLAYERS,
        data : {'newLayers' : []}
      });
    }
    mapStore.ffmap.chooseFloor(floor);
    this.props.map.floorData.currentFloor = floor;
    this.props.dispatch({
      type : SET_FLOORINFO,
      info : {
        'floorData' : this.props.map.floorData
      }
    });
    this.props.dispatch({
      type : SET_STORE,
      data : {
        curStore : [],
        bkStore : []
      }
    });
    this.props.dispatch({
      type: SET_STATUS,
      status : STATUSCONF.start
    }); 
  }
  

  render() {
    const floorData = this.props.map.floorData;
    let selectTpl = '';

    if(floorData) {
      const floorList = floorData.floors.map(item => {
        return <Option key={item} value={item}>
          {item < 0 ? 'B' + Math.abs(item) : 'F' + parseFloat(item)}
        </Option>;
      });
      
      selectTpl = <Select
          labelInValue 
          value={{key : floorData.currentFloor}}
          onChange={this.floorChange}
        >
          {floorList}
        </Select>;
    }
    return (
      <div className="floor-wrap">
        {selectTpl}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Floor);