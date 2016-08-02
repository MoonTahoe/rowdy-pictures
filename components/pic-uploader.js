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


//const createReader = (file) => new FileReader(file)
//
//const getImageURI = (file, fileReader, callback) =>
//    fileReader.readAsDataURL(file)
//        .onload(() => callback(fileReader.results))
//
//const serializeFileData = ({ name, size }) =>
//    results => ({name, size, results})
//
//const captureImage = (e, callback) =>
//    new Promise((resolves, rejects) => {
//
//        checkForImage(getFir)
//
//    })
//
//const captureImage = (e, callback) => {
//    checkForImage(getFirstFile(e))
//        .then(
//            file => getImageURI(file, createReader(file), serializeFileData(file)),
//            err => callback({error: new Error("Dropped file not an image")})
//        )
//}


//
//  TODO: Follow through errors until completion
//

//
//  TODO: Follow through files until completion
//

export const captureImage = e =>
    new Promise((resolves, rejects) =>
        checkForImage(getFirstFile(e)).then(
            file => {
                var fr = new FileReader(file)
                fr.readAsDataURL(file)
                fr.onload = function () {
                    resolves({
                        dragOver: false,
                        pending: {
                            dataURI: this.result,
                            title: file.name,
                            size: file.size
                        }
                    })
                }
            },
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
        captureImage(e).then(onDrop, onError)
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