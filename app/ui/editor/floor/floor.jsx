import './floor.css';
import React from 'react';
import { connect } from 'react-redux';  
import { RESET_NEWLAYERS, SET_STORE } from '../../../action/actionTypes';
import { Select, Modal } from 'antd'; 
const Option = Select.Option;

class Floor extends React.Component{
  constructor(props) {
    super(props);

    this.floorChange = this.floorChange.bind(this);
  }

  floorChange(event) {
    // if(this.props.control.activeType) {
    //   Modal.warning({
    //       title : '提示',
    //       content : '您有未完成的操作，请先完成！'
    //   });
    //   return;
    // }
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
    this.props.dispatch({
      type : SET_STORE,
      data : {
        curStore : [],
        bkStore : []

      }
    })
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
          defaultValue={{key : floorData.currentFloor}}
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