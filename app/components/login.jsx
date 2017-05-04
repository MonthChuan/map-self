import './loginpage.css';
import React from 'react'; 
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;    

class Login extends React.Component{
	constructor(props) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
		this.rememberMe = this.rememberMe.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
		if (!err) {
			console.log('Received values of form: ', values);
		}
		});
	}

	rememberMe(e) {
		const form = this.props.form;
		const isChecked = e ? e.target.checked : form.getFieldValue('remember') ; 
		const nameField = form.getFieldInstance('userName');
		const psField = form.getFieldInstance('password');
		
		if(isChecked) {
			nameField.refs['input'].autocomplete = 'on';
			psField.refs['input'].autocomplete = 'on';
		}
		else {
			nameField.refs['input'].autocomplete = 'off';
			psField.refs['input'].autocomplete = 'off';
		}
	}

	componentDidMount() {
		this.rememberMe();
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		
		return (
			<div className="login" id="login">
				<div className="main">
					<div className="info">
						<p className="title">欢迎使用FFAN地图在线编辑平台</p>
						<Form onSubmit={this.handleSubmit} className="login-form">
							<FormItem>
							{getFieldDecorator('userName', {
								rules: [{ required: true, message: '请您填写用户名' }],
							})(
								<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
							)}
							</FormItem>
							<FormItem>
							{getFieldDecorator('password', {
								rules: [{ required: true, message: '请您填写密码' }],
							})(
								<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
							)}
							</FormItem>
							<FormItem className="login-subline">
							{getFieldDecorator('remember', {
								valuePropName: 'checked',
								initialValue: true,
							})(
								<Checkbox onChange={this.rememberMe}>记住我</Checkbox>
							)}
							<Button type="primary" htmlType="submit" className="login-button">登录</Button>
							</FormItem>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}
const LoginForm = Form.create()(Login);
export default class LoginPage extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		return (<LoginForm />);
	}
}
// export default Login;

