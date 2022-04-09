import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'

const LoginForm = ({ login }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        if (login({ username, password })) {
            setUsername('')
            setPassword('')
        }
    }

    return (
        <div>
            <h3>Login</h3>

            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                    username
                    <Form.Control
                        id="username"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    password
                    <Form.Control
                        id="password"
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </Form.Group>
                <Button type="submit">login</Button>
            </Form>
        </div>
    )
}

LoginForm.propTypes = {
    login: PropTypes.func.isRequired,
}

export default LoginForm
