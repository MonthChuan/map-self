import './editorpage.css';
import React from 'react'; 
import { connect } from 'react-redux';

// import PlazaSelect from './plazaselect/plazaselect.jsx';  
import Control from './control/control';  
import Detail from './detail/detail.jsx';
// import Submit from './submit/submit.jsx';
import Access from './access/access';
import RightBar from './rightbar/rightbar';
import Logo from '../utils/headlogo/headlogo';
import HeadUser from '../utils/headuser/headuser';

import { message, Popconfirm } from 'antd'; 
import { getSelect, setSelect } from './utils/select';
import { fixToNormal, deleteStore } from './utils/regionFunc';
import ActionCommand from './utils/actionCommand';

import * as Service from '../../services/index';
import { ADD_MAP, SET_PAGEINFO, SET_STATUS, SET_FLOORINFO, RESET_STORE, SET_CONFIRMSHOW, ADD_NEWLAYERS } from '../../action/actionTypes';
import STATUSCONF from '../../config/status';

class EditorPage extends React.Component{
	constructor(props) {
		super(props);

// console.log(this.props.params.plazaId)



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

		if(storeList.length > 9) {
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

		if(this.props.control.isActive) {
			this.props.dispatch({
				type: SET_STATUS,
				status : STATUSCONF.start
			});
		}
		
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

	componentWillMount() {
		if(this.props.params.plazaId) {
			this.props.dispatch({
				type : SET_PAGEINFO,
				id : this.props.params.plazaId,
				pageType : this.props.params.key
			});
		}
		else {
			window.history.back(-1);
		}
	}

	componentWillUnmount() {
		if(this.props.map.ffmap) {
			this.props.map.ffmap.destroy();
		}
	}

	//DOM加载完毕之后，初始化map
	componentDidMount() {
		const map = new FMap.Map('map', {
			zoomControl : false,
			floorControl : false,
			useCache : false,
			zoom : 20,
			editable : true,
			regionInteractive : true,
			baseAPI : 'http://yunjin.intra.sit.ffan.com/mapeditor/map'
		});
		this.props.dispatch({
			type : ADD_MAP,
			ffmap : map
		});
		if(this.props.params.plazaId) {
			map.loadBuilding(this.props.params.plazaId);
		}

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
				const s = e.layer || e.target;
				if(s.feature.properties.re_type != '020000') {
					this.initFeatureClick(e);
				}
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

		// map.on('editable:editing', event => {
		// 	if(this.props.control.activeType != '') {
		// 		this.props.dispatch({
		// 			type: SET_STATUS,
		// 			status : STATUSCONF.start
		// 		});
		// 	}
		// });

		map.on('editable:dragend', event => {
			const region = event.layer;
			let latlng = null;
			if(!region.label) {
				return;
			}
			if(region.centerPoint) {
				latlng = region.centerPoint;
			}
			else {
				latlng = region.getCenter();
			}
			region.label.setLatLngs(latlng);
		});

		map.on('getMapDataSuccess', event => {
			if(event.floorData) {
				this.props.dispatch({
					type : SET_FLOORINFO,
					info : {
						floorData : event.floorData
					}
				});
			}
		});

		this.refs.map.style.height = '100%';
	}

	//新建一个name label
	newNameLabel(center, sourceLayer, nameLayer) {
		const nameLabel = new FMap.PoiLabel(center, '', sourceLayer, { pane : 'markerPane'});
		this.props.map.ffmap.addOverlay(nameLabel);
		nameLayer.label = nameLabel;

		this.props.dispatch({
          type : ADD_NEWLAYERS,
          data : nameLabel
        });
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
		this.props.dispatch({
			type: SET_STATUS,
			status : STATUSCONF.start
		});

		deleteStore(store0);	
	}

	deleteStoreConfirmCancel(e) {
		setSelect(this.preDeleteStore, false);
		this.props.dispatch({
			type : SET_CONFIRMSHOW,
			data : false
		});

		this.props.dispatch({
			type: SET_STATUS,
			status : STATUSCONF.start
		});
		this.props.dispatch({
			type : RESET_STORE,
			data : {
				curStore : [],
				bkStore : []
			}
		})
	}

	openConfirm(item) {
		this.preDeleteStore = item;
		this.refs.popconfirmChild.click();
	}

	render () {
	    return (
			<div className="page" id="editor">
				<div className="page-header">
					<div className="page-header-main clearfix">
						<Logo />
						<Access />
						<RightBar />
						<HeadUser />
					</div>
				</div>
				<div className="e-content edit-mid">
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
					<div className="e-content-main" >
						<Detail newNameLabel={this.newNameLabel} />
						<Control 
							newNameLabel={this.newNameLabel} 
							initFeatureClick={this.initFeatureClick}
							openConfirm={this.openConfirm}
						/>
						<div className="map-wrapper">
							<div ref="map" className="map" id="map" style={{height:700}}></div>
						</div>
					</div>
				</div>
			</div>
	    );
	  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(EditorPage);

