import { Component, PropTypes } from 'react'
import { Display } from './ui-widgits'

//
//  TODO: Refactor, Simplify
//

export const captureImage = (e, done) => {
    var f = e.dataTransfer.files[0]
    var isImg = /^(image\/bmp|image\/gif|image\/jpeg|image\/png)$/i
    if (f) {
        if (!isImg.test(f.type)) {
            done({
                dragOver: false,
                errors: [
                    ...this.state.errors,
                    new Error("Dropped file not an image")
                ]
            })
        } else {
            var fr = new FileReader(f)
            fr.readAsDataURL(f)
            fr.onload = function () {
                done({
                    dragOver: false,
                    pending: {
                        dataURI: this.result,
                        title: f.name,
                        size: f.size
                    }
                })
            }
        }
    }
}

export class PicUploader extends Component {

    constructor(props) {
        const binding = ['dragUpdate', 'drag', 'leave', 'drop']
        super(props)
        this.state = {
            dragging: false
        }
        binding.forEach(fn => this[fn] = this[fn].bind(this))
    }

    dragUpdate(dragging=false) {
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
        e.preventDefault()
        this.dragUpdate(false)
        captureImage(e, state => this.props.onDrop(state))
    }

    componentDidMount() {
        window.addEventListener('dragover', this.drag)
    }

    componentWillUnmount() {
        window.removeEventListener('dragover', this.drag)
    }

    render() {
        const { dragging } = this.state
        const { drag, leave, drop } = this
        return (
            <div className="upload-pic"
                 onDragEnter={drag}>
                <Display if={dragging}>
                    <div className="drag-target-outline"
                         onDragLeave={leave}
                         onDrop={drop}>
                    </div>
                </Display>
            </div>
        )
    }

}

PicUploader.propTypes = {
    onDrag: PropTypes.func,
    onDrop: PropTypes.func
}