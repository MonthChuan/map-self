import './plazaselect.css';
import React from 'react'; 
import { Select } from 'antd';  

const Option = Select.Option;
const plazalist = require('./plazalist.js'); //模拟广场数据，后期要改为接口获取


export default class PlazaSelect extends React.Component{
	constructor(props) {
		super(props);
		this.props.getPlazaId(plazalist[0].plazaId); //把广场ID传递给父组件

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(value) {
		this.props.getPlazaId(value);
	}

	render() {
		const plazalistTpl = plazalist.map(function(item) {
			return <Option key={item.plazaId} value={item.plazaId}>{item.plazaName}</Option>
		});

		return (
			<div className="plaza-select">
				<Select
					showSearch
					style={{ width: 224, height: 32 }}
					defaultValue={plazalist[0].plazaName}
					placeholder="选择广场"
					optionFilterProp="children"
					onChange={this.handleChange}
					filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				>
					{plazalistTpl}
				</Select>
			</div>
		);
	}
}

// export default Login;

