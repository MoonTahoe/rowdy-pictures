import '../stylesheets/APP.scss'
import { Component } from 'react'
import { Display } from './ui-widgits'
import { PicForm, Pictures } from './ui-screens'
import { PicUploader } from './pic-uploader'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dragging: false,
            pictures: [],
            pending: null,
            errors: []
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

    render() {
        const { pending } = this.state
        return (
            <div className="app">
                <header>
                    <h1>Rowdy Pictures</h1>
                </header>

                <Display if={!pending}>
                    <PicUploader onDrag={dragging => this.setState({dragging})}
                                 onDrop={dropState => this.setState({...dropState})}
                                 onError={error => this.setState({
                                    errors: [
                                        ...this.state.errors,
                                        error
                                    ]
                                 })} />
                </Display>

                <Display if={pending}>
                    <PicForm {...pending} />
                </Display>

            </div>
        )
    }

}

export default App