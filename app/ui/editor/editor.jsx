import './editorpage.css';
import 'antd/dist/antd.css';
import React from 'react'; 
import { connect } from 'react-redux';

import PlazaSelect from './plazaselect/plazaselect.jsx';  
import Control from './control/control.jsx';  
import Detail from './detail/detail.jsx';
import Submit from './submit/submit.jsx';
import { message, Popconfirm } from 'antd'; 
import { getSelect, setSelect } from './utils/select';
import { fixToNormal, deleteStore } from './utils/regionFunc';
import ActionCommand from './utils/actionCommand';

import * as Service from '../../services/index';
import { ADD_MAP, SET_PLAZAID, SET_STATUS, SET_FLOORINFO, RESET_STORE, SET_CONFIRMSHOW } from '../../action/actionTypes';

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

		if(storeList.length > 4) {
			message.warning('您有较多操作未保存，请保存！', 3);
		}

		if(getSelect(_store) || curStoreList.indexOf(_store) > -1) {
			return;
		}

		setSelect(_store, true);
		if(control.isSubMerge) {
			if(curStoreList.length == 2 ) {
				const _oStore = curStoreList.pop();
				setSelect(_oStore, false);
			}
			setSelect(_store, true);
			const _s = [_store].concat(curStoreList);

			this.props.dispatch({
				type : RESET_STORE,
				data : {
					curStore : _s
				}
			});
			return;
		}
		else {

			curStoreList.map(item => {
				setSelect(item, false);
			});
		}

		curStoreList.map(item => {
			fixToNormal(item);
		});
		
		this.props.dispatch({
			type : RESET_STORE,
			data : {
				curStore : [_store],
				bkStore : [{
					action : _store.action || '',
					id : _store.feature.id,
					properties : Object.assign({}, _store.feature.properties)
				}]
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
		const store0 = this.preDeleteStore;
		setSelect(store0, false);
		this.props.dispatch({
			type : SET_CONFIRMSHOW,
			data : false
		})
		store0.action = 'DELETE';
		
		const actCommand = new ActionCommand(this.props.store.bkStore[0]);
		this.props.store.actionCommand.unshift(actCommand);
		this.props.dispatch({
			type : RESET_STORE,
			data : {
				store : [store0]
			}
		});

		deleteStore(store0);	
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

