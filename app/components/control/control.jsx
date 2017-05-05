import './control.css';
import React from 'react';  
import { Button, message } from 'antd'; 

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
	}
	
	//画面
	drawPloy() {
		const newStore = this.state.ffmap.startPolygon();

		
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


console.log(union)
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
				this.props.state.nameLabel = nameLabel;
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
	render() {
		return (
			<div className="control">
				<Button type="primary" onClick={this.drawPloy}>面</Button>
				<Button type="primary" onClick={this.deleteStore}>删除</Button>
				<Button type="primary" onClick={this.setMerge}>合并</Button> <Button type="primary" onClick={this.mergeStore}>提交合并</Button>
				<Button type="primary" onClick={this.editStart}>开始编辑</Button>
				<Button type="primary" onClick={this.saveEdit}>保存</Button>
			</div>
		);
	}
}

// export default Login;

