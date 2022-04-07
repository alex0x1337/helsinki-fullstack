import { connect } from 'react-redux' 

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (!props.notification) {
    return <></>
  }
  return (
    <div style={style}>
      {props.notification}
    </div>
  )
}
const mapStateToProps = (state) => ({ notification: state.notification.message })
export default connect(mapStateToProps, null)(Notification)