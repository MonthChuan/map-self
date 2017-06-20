import './plazaselect.css';
import React from 'react'; 
import { Select } from 'antd';  
const Option = Select.Option;
// const plazalist = require('./plazalist.js'); //模拟广场数据，后期要改为接口获取

export default class PlazaSelect extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			plazalist : []
		};

		this.handleChange = this.handleChange.bind(this);
		this.getPlazaState = this.getPlazaState.bind(this);
	}

	//第一次渲染组件之后，异步获取数据
	componentDidMount() {
		$.ajax({
			'url' : 'http://yunjin.intra.sit.ffan.com/mapeditor/plaza/v1/indoor/plazas',
			'data' : {'pageSize' : 100},
			'dataType' : 'json'
		}).done( req => {
			if(req.status == 200) {
				this.setState({plazalist : req.data.list});
				this.props.getPlazaId(this.state.plazalist[0].plazaFfanId); //把广场ID传递给父组件
			}
		});
	}

	handleChange(value) {
		this.props.getPlazaId(value);
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
		if(this.state.plazalist.length > 0) {
			const plazalistTpl = this.state.plazalist.map(function(item) {
				item.locked = 0; //--------------------------------------------------------------------待删
				return <Option 
					key={String(item.plazaFfanId)} 
					value={String(item.plazaFfanId)}
					disabled={Boolean(item.locked)}
				>
					{item.plazaName + self.getPlazaState(item)}
				</Option>
			});

			selectTpl = (
				<Select
					showSearch
					style={{ width: 224, height: 32 }}
					defaultValue={this.state.plazalist[0].plazaName + self.getPlazaState(this.state.plazalist[0])}
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

// export default Login;

