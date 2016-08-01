import '../stylesheets/APP.scss'
import { Component } from 'react'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dragOver: false,
            pictures: [],
            pending: null,
            errors: []
        }
        this.draggingOver = this.draggingOver.bind(this)
        this.draggingOut = this.draggingOut.bind(this)
        this.dropping = this.dropping.bind(this)
        this.save = this.save.bind(this)
    }

    draggingOver(e) {
        e.preventDefault()
        this.setState({ dragOver: true })
    }

    draggingOut(e) {
        e.preventDefault()
        this.setState({ dragOver: false })
    }

    dropping(e) {
        e.preventDefault()
        this.setState({ dragOver: false })
        var f = e.dataTransfer.files[0]
        var imageRE = /^(image\/bmp|image\/gif|image\/jpeg|image\/png)$/i
        if (f) {
            if (!imageRE.test(f.type)) {
                this.setState({
                    dragOver: false,
                    errors: [
                        ...this.state.errors,
                        new Error("Dropped file not an image")
                    ]
                })
            } else {
                var fr = new FileReader(f)
                fr.readAsDataURL(f)
                var _this = this
                fr.onload = function() {
                    _this.setState({
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

    save() {
        this.setState({
            pictures: [
                ...this.state.pictures,
                this.state.pending
            ],
            pending: null
        })
    }

    componentDidMount() {
        window.addEventListener('dragover', this.draggingOver)
    }

    componentWillUnmount() {
        window.removeEventListener('dragover', this.draggingOver)
    }

    render() {
        const { dragOver, pending, pictures } = this.state
        return (
            <div className="app" onDragEnter={this.draggingOver}>

                {(dragOver) ? <div className="drag-target-outline"
                                   onDragLeave={this.draggingOut}
                                   onDrop={this.dropping}></div> : null}

                {(pending) ? (
                    <div className="pending">
                        <h1>Pending Image</h1>
                        <img src={pending.dataURI} alt={pending.title} />
                        <p>{pending.title}</p>
                        <p>{pending.size}</p>
                        <button onClick={this.save}>Save Image</button>
                    </div>
                ) : (pictures.length) ? (
                    <div className="pictures">
                        {pictures.map((pic, i) => <img key={i} src={pic.dataURI} alt={pic.title} />)}
                    </div>
                ) : <h1>Rowdy Pictures</h1>}


            </div>
        )
    }

}


export default App