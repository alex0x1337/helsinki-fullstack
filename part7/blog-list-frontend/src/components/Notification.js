import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
    const { message, success } = useSelector((state) => state.notification ? state.notification : {})
    if (message === undefined) {
        return null
    }

    return <Alert variant={success ? 'success' : 'danger'}>
        <p>{message}</p>
    </Alert>
}

export default Notification
