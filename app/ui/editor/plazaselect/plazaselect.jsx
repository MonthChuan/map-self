import './plazaselect.css';
import React from 'react'; 
import { connect } from 'react-redux';

import * as Service from '../../../services/index';
import { GET_PLAZALIST, SET_PLAZAID, SET_STATUS } from '../../../action/actionTypes';

import { Select } from 'antd';  
const Option = Select.Option;

class PlazaSelect extends React.Component{
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.getPlazaState = this.getPlazaState.bind(this);
	}

	//第一次渲染组件之后，异步获取数据
	componentDidMount() {
		Service.getPlazaListAjax((data) => {
			this.props.dispatch({
				type : GET_PLAZALIST,
				list : data.data.list
			});
			this.props.dispatch({
				type : SET_PLAZAID,
				id : data.data.list[0].plazaFfanId
			});

			if(this.props.map.ffmap) {
				this.props.map.ffmap.loadBuilding(this.props.map.plazaId);
			}

		});
	}

	handleChange(value) {
		this.props.dispatch({
			type : SET_PLAZAID,
			id : value
		});

		if(this.props.map.ffmap) {
			this.props.map.ffmap.loadBuilding(value);
		}
		this.props.dispatch({
			type : SET_STATUS,
			status : {
				isAdd : false,
				isEdit : false,
				isDelete : false,
				isMerge : false,
				isSubMerge : false,
				isZT : false,
				isStart : true,
				isActive : false
			}
		});

	}

	getPlazaState(item) {
		if(item.locked && item.locked > 0) {
			return '(锁定中)';
		}
		else {
			const PLAZA_STATE = {
				'0'	: '',
				'1' : '(编辑中)',
				'2' : '(审核中)',
				'3' : '(审核不通过)',
				'4' : '(审核通过)'
			};
			return PLAZA_STATE[item.mapState];
		}
	}

	render() {
		let selectTpl = '';
		const self = this;
		if(this.props.map.plazalist.length > 0) {
			const plazalistTpl = this.props.map.plazalist.map(function(item) {
				item.locked = 0; //--------------------------------------------------------------------待删
				return <Option 
					key={String(item.plazaFfanId)} 
					value={String(item.plazaFfanId)}
					disabled={Boolean(item.locked)}
				>
					{item.plazaName + self.getPlazaState(item)}
				</Option>
			});

			const firstPlaza = this.props.map.plazalist[0];
			selectTpl = (
				<Select
					showSearch
					style={{ width: 224, height: 32 }}
					defaultValue={firstPlaza.plazaName + self.getPlazaState(firstPlaza)}
					placeholder="选择广场"
					optionFilterProp="children"
					onChange={this.handleChange}
					filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				>
					{plazalistTpl}
				</Select>
			)
		}

		return (
			<div className="plaza-select">
				{selectTpl}
			</div>
		);
	}
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(PlazaSelect);

