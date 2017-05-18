import './control.css';
import React from 'react';  
import { Button, message, Menu, Dropdown, Icon } from 'antd'; 
import SaveConfirm from '../utils/saveConfirm.jsx';

export default class Control extends React.Component{
	constructor(props) {
		super(props);
		this.state = this.props.state;

		this.drawPloy = this.drawPloy.bind(this);
		this.setMerge = this.setMerge.bind(this);
		this.deleteStore = this.deleteStore.bind(this);
		this.mergeStore = this.mergeStore.bind(this);
		this.editStart = this.editStart.bind(this);
		this.saveEdit = this.saveEdit.bind(this);
		this.dropDown = this.dropDown.bind(this);
		this.editRegion = this.editRegion.bind(this);

		this.checkAct = this.checkAct.bind(this);
	}

	//检查是否可以进行下面操作
	checkAct() {
		if(this.props.state.store.length > 0 && this.props.state.store[0].action != 'SHOW') {
			message.warning('您正在编辑状态，请先完成操作并保存，再进行其他操作！', 3);
			return false;
		}
		return true;
	}
	
	//新增商铺
	drawPloy() {
		if(!this.checkAct()) {return}


		const newStore = this.state.ffmap.startPolygon({
			color : '#ddc486',
			fillColor : '#fef8eb',
			weight : 1,
			fillOpacity : 0.6
		});
		newStore.action = "NEW";

		this.props.setState({status : {
			isAdd : true,
			isEdit : false,
			isDelete : false,
			isMerge : false,
			isSubMerge : false,
			isZT : false,
			isStart : false,
			isActive : true
		}});
		this.props.state.store = [newStore];

		newStore.on('click', e => {
			this.props.initFeatureClick(e);
		});
	}

	//合并
	setMerge() {
		if(!this.checkAct()) {return}
		this.props.setState({status : {
			isAdd : false,
			isEdit : false,
			isDelete : false,
			isMerge : true,
			isSubMerge : false,
			isZT : false,
			isStart : false,
			isActive : true
		}});

		// 	if(this.state.store.length > 0) {
		// 		this.refs.saveConfirm.showConfirm();
		// 	}
		
	}

	mergeStore(store) {
		if(this.props.state.store.length < 2) {
			message.warning('无法合并！', 3);
		}
		else {
			const s1 = this.props.state.store[0].feature;
			const s2 = this.props.state.store[1].feature;

			if( s1.getBounds().intersects(s2.getBounds()) ) {
				const union = turf.union(s1.toGeoJSON(), s2.toGeoJSON());
				const layer = this.state.ffmap.drawGeoJSON(union, {editable: true});

				this.props.state.store[0].remove();
				this.props.state.store[1].remove();
				// this.props.state.store[0].isDelete = true;
				// this.props.state.store[1].isDelete = true;
      			this.state.ffmap.addOverlay(layer);
		  				
				const coords = turf.coordAll(union).map(function(item) {
					return FFanMap.Utils.toOriginalCoordinates(item);
				});
				layer.region = coords;
				const _s = [layer].concat(this.props.state.store);
				this.props.setState({store : _s});
				this.props.state.store = _s;
				//手动添加一个名称label
				const centerLatLng = layer.getBounds().getCenter();
				this.props.newNameLabel(centerLatLng);

				layer.on('click', e => {
					this.props.initFeatureClick(e);
				});
			}
			else {
				message.error('无法合并！', 3);
			}
		}
	}

	editStart() {
		this.props.editStart();
	}

	saveEdit() {
		this.props.saveEdit();
	}

	//delete
	deleteStore() {
		if(!this.checkAct()) {return}
		this.props.setState({status : {
			isAdd : false,
			isEdit : false,
			isDelete : true,
			isMerge : false,
			isSubMerge : false,
			isZT : false,
			isStart : false,
			isActive : true
		}});
	} 

	dropDown( { key } ) {
		// if(!this.checkAct()) {return}
		this.props.setState({status : {
			isAdd : false,
			isEdit : false,
			isDelete : false,
			isMerge : false,
			isSubMerge : false,
			isZT : key,
			isStart : false,
			isActive : true
		}});
		//多经点
		const bulidFuc1 = () => {
			const layer = this.state.ffmap.startPolygon({
				color: "#ff7800", 
				weight: 1
			});
			layer.name = '多经点';
			layer.regionType = '多经点';

			this.props.setState({store : [layer]});
		};
		//承重柱
		const bulidFuc2 = () => {
			
		};
		//万达百货
		const bulidFuc3 = () => {
			const layer = this.state.ffmap.startPolygon({
				color: "#ff7800", 
				weight: 1
			});
			layer.name = '万达百货';
			layer.regionType = '万达百货';

			this.props.setState({store : [layer]});
		};

		switch(parseInt(key)) {
			case 1:
				bulidFuc1();
				break;
			case 2:
				bulidFuc2();
				break;
			case 3:
				bulidFuc3();
				break;
			default:
				break;
		}
	}

	//商铺编辑
	editRegion() {
		if(!this.checkAct()) {return}
		this.props.setState({status : {
			isAdd : false,
			isEdit : true,
			isDelete : false,
			isMerge : false,
			isSubMerge : false,
			isZT : false,
			isStart : false,
			isActive : true
		}});
	}

	render() {
		const menu = (
			<Menu onClick={this.dropDown}>
				<Menu.Item key="1">多经点</Menu.Item>
				<Menu.Item key="2">承重柱</Menu.Item>
				<Menu.Item key="3">万达百货</Menu.Item>
			</Menu>
		);
		const name1 = "s-btn s-add clearfix" + (this.props.state.status.isAdd ? '' : ' disable');
		const name2 = "s-btn s-edit clearfix" + (this.props.state.status.isEdit ? '' : ' disable');
		const name3 = "s-btn s-delete clearfix" + (this.props.state.status.isDelete ? '' : ' disable');
		const name4 = "s-btn s-merge clearfix" + (this.props.state.status.isMerge ? '' : ' disable');
		const name5 = "s-btn s-zt clearfix" + (this.props.state.status.isZT ? '' : ' disable');

		const mergeStyle = {'display' : (this.props.state.status.isSubMerge ? 'none' : 'inline-block')};
		const submergeStyle = {'display' : (this.props.state.status.isSubMerge ? 'inline-block' : 'none')};

		const startStyle = {'display' : (this.props.state.status.isStart ? 'inline-block' : 'none')};
		const saveStyle = {'display' : (this.props.state.status.isStart || (this.props.state.status.isActive == 2) ? 'none' : 'inline-block')};
	
		return (
			<div className="control">
				<a className={name1} onClick={this.drawPloy}><i className="s-icon"></i>新增商铺</a>
				<a className={name2} onClick={this.editRegion} ><i className="s-icon"></i>商铺编辑</a>
				<a className={name3} onClick={this.deleteStore}><i className="s-icon"></i>删除商铺</a>
				<a className={name4} style={mergeStyle} onClick={this.setMerge}><i className="s-icon"></i>商铺合并</a>
				<a className="s-btn s-merge clearfix" style={submergeStyle} onClick={this.mergeStore}><i className="s-icon"></i>执行合并</a>

				<Dropdown overlay={menu}>
					<span className={name5}><i className="s-icon"></i>专题数据<Icon type="down" /></span>
				</Dropdown>
				<Button ref="actionBtn" className="e-start" style={startStyle} type="primary" onClick={this.editStart}>开始编辑</Button>
				<Button ref="actionBtn" className="e-save" style={saveStyle} type="primary" onClick={this.saveEdit}>保存</Button>
				<SaveConfirm ref="saveConfirm" />
			</div>
		);
	}
}


