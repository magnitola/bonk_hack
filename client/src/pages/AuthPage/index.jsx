import React, {useState, useEffect, useContext} from 'react';
import {useHttp} from '../../hooks/http.hook';
import {useMessage} from '../../hooks/message.hook';
import {AuthContext} from '../../context/AuthContext';

export const AuthPage = () => {
	const auth = useContext(AuthContext);
	const message = useMessage();
	const {loading, error, request, clearError} = useHttp();
	const [form, setForm] = useState({
		login: '', password: ''
	});

	// Активирует текстовые input-ы, чтобы label не находил на placeholder
	useEffect(() => {
		window.M.updateTextFields();
	}, []);

	useEffect(() => {
		message(error);
		clearError();
	}, [error, message, clearError]);

	const changeHandler = event => {
		setForm({ ...form, [event.target.name]: event.target.value })
	};

	const loginHandler = async () => {
		try {
			const data = await request('/api/auth/login', 'POST', {...form});
			auth.login(data.token, data.id, data.role, data.org);
		} catch (e) {}
	};

	return (
		<div className="row">
			<div className="col s6 offset-s3">
				<h1>BONK</h1>
				<div className="card blue darken-1">
					<div className="card-content white-text">
						<span className="card-title">Авторизация</span>
						<div>

							<div className="input-field">
								<input
									placeholder="Введите логин"
									id="login"
									type="text"
									name="login"
									value={form.login}
									className="yellow-input"
									onChange={changeHandler}
								/>
								<label htmlFor="login">Логин</label>
							</div>

							<div className="input-field">
								<input
									placeholder="Введите пароль"
									id="password"
									type="password"
									name="password"
									value={form.password}
									className="yellow-input"
									onChange={changeHandler}
								/>
								<label htmlFor="password">Пароль</label>
							</div>
							
						</div>
					</div>
					<div className="card-action">
						<button
							className="btn yellow darken-4"
							disabled={loading}
							onClick={loginHandler}
							style={{marginRight: 10}}>
								Войти
						</button>
						{/* <button
							className="btn grey lighten-1 black-text"
							disabled={loading}
							onClick={registerHandler}>
								Регистрация
						</button> */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default AuthPage;