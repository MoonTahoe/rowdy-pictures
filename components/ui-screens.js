import { PropTypes } from 'react'
import { Display } from './ui-widgits'

export const PicForm = ({ dataURI, title, size=0}) =>
    <div className="pic-form">
        <h1>Finalize Image</h1>
        <img src={dataURI} alt={title}/>
        <p>{title}</p>
        <p>{size}</p>
        <button onClick={this.save}>Save Image</button>
    </div>

PicForm.propTypes = {
    dataURI: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    size: PropTypes.number
}

export const Pictures = ({pictures=[], children}) =>
    <div className="pictures">
        <Display if={pictures.length}>
            {pictures.map((pic, i) => <img key={i} src={pic.dataURI} alt={pic.title}/>)}
        </Display>
        <Display if={!pictures.length}>
            {children}
        </Display>
    </div>

Pictures.propTypes = {
    pictures: PropTypes.array
}