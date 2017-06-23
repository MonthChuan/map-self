//承重柱
// this.state.ffmap.on('click', event => {
// 	if(this.state.status.isZT != 2 || (this.state.store.length > 0 && this.state.store[0].action != 'SHOW')) {
// 		return;
// 	}
// 	const p1 = FMap.Utils.latLngToPoint(event.latlng);
// 	const p2 = [p1.x + 3, p1.y + 3];
// 	const bounds = [event.latlng, FMap.Utils.pointToLatLng(p2)];
// 	const layer = L.rectangle(bounds, {
// 		draggable : true,
// 		color: "#ff7800", 
// 		weight: 1, 
// 		transform: true
// 	});

// 	this.state.ffmap.addOverlay(layer);
// 	layer.transform.enable({rotation: true});
// 	layer.feature = {
// 		properties : {
// 			re_name : '承重柱',
// 			re_type : '030202'
// 		}
// 	};
// 	layer.action = 'NEW';
// 	this.setState({store : [layer]});
// });

// dropDown( { key } ) {
//   this.props.setState({status : {
//     isAdd : false,
//     isEdit : false,
//     isDelete : false,
//     isMerge : false,
//     isSubMerge : false,
//     isZT : key,
//     isStart : false,
//     isActive : true
//   }});
//   const bulidZT = (name, type) => {
//     const layer = this.state.ffmap.startPolygon({
//       color: "#ff7800", 
//       weight: 1
//     });
//     layer.name = name;
//     layer.regionType = type;
//     layer.action = 'NEW';

//     this.props.setState({store : [layer]});
//   };

//   switch(parseInt(key)) {
//     case 1:
//       bulidZT('多经点位', '030201');
//       break;
//     case 2:
//       break;
//     case 3:
//       bulidZT('万达百货', '万达百货');
//       break;
//     default:
//       break;
//   }
// }


/*const menu = (
    <Menu onClick={this.dropDown}>
    <Menu.Item key="1">多经点</Menu.Item>
    <Menu.Item key="2">承重柱</Menu.Item>
    <Menu.Item key="3">万达百货</Menu.Item>
    </Menu>
);*/

{/*<Dropdown overlay={menu}>
    <span className={name5}><i className="s-icon"></i>专题数据<Icon type="down" /></span>
</Dropdown>*/}

