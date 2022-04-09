import { useSelector } from 'react-redux'

const Notification = () => {
    const { message, success } = useSelector((state) => state.notification ? state.notification : {})
    if (message === undefined) {
        return null
    }

    return <div className={success ? 'success' : 'error'}>{message}</div>
}

export default Notification
