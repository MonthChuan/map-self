import './control.css';
import React from 'react';  
import { Button, message, Menu, Dropdown, Icon } from 'antd'; 
import 'leaflet-path-transform';

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
	}
	
	//画面
	drawPloy() {
		const newStore = this.state.ffmap.startPolygon();

		this.props.state.isAdd = true;
		this.props.state.store.push(newStore);
		console.log(newStore)
	}

	//合并
	setMerge() {
		this.props.setMerge();
	}

	mergeStore(store) {
		if(this.props.state.store.length < 2) {
			message.warning('无法合并！');
		}
		else {
			const s1 = this.props.state.store[0].feature;
			const s2 = this.props.state.store[1].feature;

			if( s1.getBounds().intersects(s2.getBounds()) ) {
				const union = turf.union(s1.toGeoJSON(), s2.toGeoJSON());
				const layer = this.state.ffmap.drawGeoJSON(union);

				this.props.state.store[0].remove();
				this.props.state.store[1].remove();
				this.props.state.store[0].isDelete = true;
				this.props.state.store[1].isDelete = true;
      			this.state.ffmap.addOverlay(layer);
		  				
				const coords = turf.coordAll(union).map(function(item) {
					return FFanMap.Utils.toOriginalCoordinates(item);
				});
				this.props.state.store.unshift( {region : coords} );
				//手动添加一个名称label
				const centerLatLng = layer.getBounds().getCenter();
				const nameLabel = new FFanMap.Label(centerLatLng, '');
				this.state.ffmap.addOverlay(nameLabel);
				this.props.state.store[0].nameLabel = nameLabel;
			}
			else {
				message.error('无法合并！');
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
		if(this.props.state.store.length > 0 && !this.props.state.isMerge) {
			this.props.state.store[0].remove();
			this.props.state.store[0].isDelete = true;
		}
	} 

	dropDown( { key } ) {
		const bulidFuc = () => {
			var bounds = [[0,0], FFanMap.Utils.pointToLatLng([-40, -40])];
			// create an orange rectangle
			var layer = L.rectangle(bounds, {
				// draggable : true,
				color: "#ff7800", 
				weight: 1, 
				transform: true
			});

    		this.props.state.ffmap.addOverlay(layer);
			// console.log(layer.enableEdit());
			setTimeout(() => {layer.transform.enable({rotation: true});}, 1000);
			// layer.transform.enable({rotation: true});
		};
		switch(parseInt(key)) {
			case 1:
				bulidFuc();
				break;
			case 2:
				break;
			case 3:
				break;
			default:
				break;
		}
	}
	render() {
		const menu = (
			<Menu onClick={this.dropDown}>
				<Menu.Item key="1">多经点</Menu.Item>
				<Menu.Item key="2">承重柱</Menu.Item>
				<Menu.Item key="3">万达百货</Menu.Item>
			</Menu>
		);
		return (
			<div className="control">
				<Button type="primary" onClick={this.drawPloy}>面</Button>
				<Button type="primary" onClick={this.deleteStore}>删除</Button>
				<Button type="primary" onClick={this.setMerge}>合并</Button> <Button type="primary" onClick={this.mergeStore}>提交合并</Button>
				<Dropdown overlay={menu}>
					<a className="" href="#">
					专题数据<Icon type="down" />
					</a>
				</Dropdown>
				<Button type="primary" onClick={this.editStart}>开始编辑</Button>
				<Button type="primary" onClick={this.saveEdit}>保存</Button>
			</div>
		);
	}
}


