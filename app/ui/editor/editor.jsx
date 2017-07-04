import './editorpage.css';
import 'antd/dist/antd.css';
import React from 'react'; 
import { connect } from 'react-redux';

import PlazaSelect from './plazaselect/plazaselect.jsx';  
import Control from './control/control.jsx';  
import Detail from './detail/detail.jsx';
import Submit from './submit/submit.jsx';
import { message, Modal, Popconfirm } from 'antd'; 
import { getSelect, setSelect } from './utils/select';
import { fixToNormal } from './utils/regionFunc';

import * as Service from '../../services/index';
import { ADD_MAP, SET_PLAZAID, SET_STATUS, SET_FLOORINFO, SET_STORE, SET_CONFIRMSHOW } from '../../action/actionTypes';

class EditorPage extends React.Component{
	constructor(props) {
		super(props);
		this.preDeleteStore = null;
		this.newNameLabel = this.newNameLabel.bind(this);
		this.initFeatureClick = this.initFeatureClick.bind(this);
		this.deleteStoreConfirmOk = this.deleteStoreConfirmOk.bind(this);
		this.deleteStoreConfirmCancel = this.deleteStoreConfirmCancel.bind(this);

		this.openConfirm = this.openConfirm.bind(this);
	} 

	initFeatureClick(event) {
		const _store = event.layer || event.target;
		const control = this.props.control;
		const storeList = this.props.store.store;
		const curStoreList = this.props.store.curStore;
		// let storeArr = [];

		if(getSelect(_store)) {
			return;
		}

		setSelect(_store, true);
		if(control.isSubMerge) {
			// this.props.dispatch({
			// 	type : SET_STATUS,
			// 	status : {
			// 		isAdd : false,
			// 		isEdit : false,
			// 		isDelete : false,
			// 		isMerge : false,
			// 		isSubMerge : true,
			// 		isZT : false,
			// 		isStart : false,
			// 		isActive : true
			// 	}
			// });
	
			if(curStoreList.length == 2 ) {
				const _oStore = curStoreList.pop();
				setSelect(_oStore, false);
			}
			setSelect(_store, true);
			const _s = [_store].concat(curStoreList);

			this.props.dispatch({
				type : SET_STORE,
				data : {
					curStore : _s
					// ,
					// store : storeArr
				}
			});
			return;
		}
		else {

			curStoreList.map(item => {
				setSelect(item, false);
				// fixToNormal(item);
				// if(item && item.action) {
				// 	storeArr.push(item);
				// }
			});
			//去掉重复操作
			// if((_store.editEnabled && _store.editEnabled()) || getSelect(_store)) {
			// 	return;
			// }

			// if(control.isEdit) {
			// 	_store.action = 'UPDATE';
			// 	if(_store.enableEdit) {
			// 		_store.enableEdit();
			// 	}
			// 	else {
			// 		_store.eachLayer(i => {
			// 			i.enableEdit();
			// 		});
			// 	}
			// 	const _latlngList = _store.getLatLngs()[0].length > 1 ? _store.getLatLngs()[0] : _store.getLatLngs()[0][0];
			// 	const _latlng = _latlngList.map(item => {
			// 		return Object.assign({}, item);
			// 	});

			// 	this.props.dispatch({
			// 		type : SET_STORE,
			// 		data : [_store]
			// 	});

			// 	this.props.dispatch({
			// 		type : SET_BKSTORE,
			// 		data : [{
			// 			name : _store.name,
			// 			regionType : _store.regionType,
			// 			latlng : [[_latlng]]
			// 		}]
			// 	});
			// 	return;
			// }
			// else if(control.isDelete) {
			// 	this.props.dispatch({
			// 		type : SET_CONFIRMSHOW,
			// 		data : true
			// 	});
			// 	this.refs.popconfirmChild.click();

			// 	setSelect(_store, true);
			// 	this.preDeleteStore = _store;
			// 	return;
			// }
			// else if(control.isMerge || control.isSubMerge) {
			// 	this.props.dispatch({
			// 		type : SET_STATUS,
			// 		status : {
			// 			isAdd : false,
			// 			isEdit : false,
			// 			isDelete : false,
			// 			isMerge : false,
			// 			isSubMerge : true,
			// 			isZT : false,
			// 			isStart : false,
			// 			isActive : true
			// 		}
			// 	});
		
			// 	if(storeList.length == 2 ) {
			// 		const _oStore = storeList.pop();
			// 		setSelect(_oStore, false);
			// 	}
			// 	setSelect(_store, true);
			// 	const _s = [_store].concat(storeList);

			// 	this.props.dispatch({
			// 		type : SET_STORE,
			// 		data : _s
			// 	});
			// 	return;
			// }

		}

		curStoreList.map(item => {
			fixToNormal(item);
		});
		
		this.props.dispatch({
			type : SET_STORE,
			data : {
				curStore : [_store]
				// store : storeArr
			}
		});
	}

	//DOM加载完毕之后，初始化map
	componentDidMount() {
		const map = new FMap.Map('map', {
			zoom : 20,
			editable : true,
			regionInteractive : true,
			baseAPI : 'http://yunjin.intra.sit.ffan.com/mapeditor/map'
		});
		this.props.dispatch({
			type : ADD_MAP,
			ffmap : map
		});

		// 获取商铺列表
		map.on('rendered', event => {
			let storeList = [];
			let numList = [];
			let f_name = '';
			let f_num = 1;
			event.regionGroup.eachLayer(function(s) {
				storeList.push(s.feature);

				//为了拼region_id，需要获取楼层里面ID最后数字最大的
				const str = s.feature.id;
				const arr = str.split('_');
				f_name = arr[arr.length - 2];
				f_num = s.feature.properties.floor_num;
				numList.push( parseInt(arr[arr.length - 1]) );
			});

			event.regionGroup.on('click', e => {
				this.initFeatureClick(e);
			});

			let maxNum = numList[0];
			numList.map( i => {
				if(i > maxNum) {
					maxNum = i;
				}
			});

			this.props.dispatch({
				type : SET_FLOORINFO,
				info : {
					floor : storeList,
					floorId : f_num,
					floorMaxNum : maxNum,
					floorName : f_name
				}
			});
		});

		this.refs.map.style.height = '100%';
	}

	//新建一个name label
	newNameLabel(center, sourceLayer, nameLayer) {
		const nameLabel = new FMap.PoiLabel(center, '', sourceLayer, { pane : 'markerPane'});
		this.props.map.ffmap.addOverlay(nameLabel);
		nameLayer.label = nameLabel;
	}

	deleteStoreConfirmOk(e) {
		setSelect(this.preDeleteStore, false);
		this.props.dispatch({
			type : SET_CONFIRMSHOW,
			data : false
		})
		this.preDeleteStore.action = 'DELETE';
		
		this.props.dispatch({
			type : SET_STORE,
			data : {
				store : [this.preDeleteStore]
			}
		});
		const store0 = this.preDeleteStore;
		if(store0.graphics) {
			store0.graphics.remove();
		}
		else {
			store0.remove();
		}
		
		if(store0.label) {
			store0.label.remove();
		}	
	}

	deleteStoreConfirmCancel(e) {
		setSelect(this.preDeleteStore, false);
		this.props.dispatch({
			type : SET_CONFIRMSHOW,
			data : false
		})
	}

	openConfirm(item) {
		this.preDeleteStore = item;
		this.refs.popconfirmChild.click();
	}

	render () {
	    return (
			<div className="page" id="editor">
				<div className="topbar">
					<div className="mid clearfix">
						<PlazaSelect />
						<Control 
							newNameLabel={this.newNameLabel} 
							initFeatureClick={this.initFeatureClick}
							openConfirm={this.openConfirm}
						/>
					</div>
				</div>
				<div className="e-content mid">
					<Popconfirm 
						title="确认删除此商铺？"
						okText="确认" 
						cancelText="取消"
						placement="top"
						arrowPointAtCenter
						visible={this.props.map.popconfirmVisible}
						onConfirm={this.deleteStoreConfirmOk}
						onCancel={this.deleteStoreConfirmCancel}
					>
						<a ref="popconfirmChild" className="popconfirm-btn"></a>
					</Popconfirm>
					<div className="e-content-main clearfix" >
						<div className="map-wrapper">
							<div ref="map" className="map" id="map" style={{height:700}}></div>
						</div>
						<Detail newNameLabel={this.newNameLabel} />
					</div>
				</div>
				<div className="bottom mid">
					<Submit />
				</div>
			</div>
	    );
	  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(EditorPage);

