import '../stylesheets/pic-uploader.scss'
import { Component, PropTypes } from 'react'
import { Display } from './ui-widgits'

const getFirstFile = e => e.dataTransfer.files[0]

const checkForImage = file =>
    new Promise((resolves, rejects) =>
        (file && file.type && file.type.match(/^(image\/bmp|image\/gif|image\/jpeg|image\/png)$/i)) ?
            resolves(file) :
            rejects(new Error("Dropped file not an image"))
    )

const readImgFile = (file, callback) => {
    const fr = new FileReader(file)
    fr.readAsDataURL(file)
    fr.onload = () => callback({
        pending: {
            dataURI: fr.result,
            title: file.name,
            size: file.size
        }
    })
}

export const captureDroppedImage = dropEvent =>
    new Promise((resolves, rejects) =>
        checkForImage(getFirstFile(dropEvent)).then(
            file => readImgFile(file, data => resolves(data)),
            error => rejects(error)
        ))

export class PicUploader extends Component {

    constructor(props) {
        const binding = ['dragUpdate', 'drag', 'leave', 'drop']
        super(props)
        this.state = {
            dragging: false
        }
        binding.forEach(fn => this[fn] = this[fn].bind(this))
    }

    dragUpdate(dragging = false) {
        this.props.onDrag(dragging)
        this.setState({dragging})
    }

    drag(e) {
        e.preventDefault()
        this.dragUpdate(true)
    }

    leave(e) {
        e.preventDefault()
        this.dragUpdate(false)
    }

    drop(e) {
        const { onDrop, onError } = this.props
        e.preventDefault()
        this.dragUpdate(false)
        captureDroppedImage(e).then(onDrop, onError)
    }

    componentDidMount() {
        window.addEventListener('dragover', this.drag)
    }

    componentWillUnmount() {
        window.removeEventListener('dragover', this.drag)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.dragging !== nextState.dragging
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('updated', this.state.dragging, prevState.dragging)
    }

    render() {
        const { dragging } = this.state
        const { leave, drop } = this
        return (
            <div className="upload-pic">
                <Display if={dragging}>
                    <div className="drag-target-outline"
                         onDragLeave={leave}
                         onDrop={drop}>
                        <span>Drop Images Here</span>
                    </div>
                </Display>
            </div>
        )
    }

}

PicUploader.propTypes = {
    onDrag: PropTypes.func,
    onDrop: PropTypes.func,
    onError: PropTypes.func
}

PicUploader.defaultProps = {
    onDrag: f=>f,
    onDrop: f=>f,
    onError: f=>f
}