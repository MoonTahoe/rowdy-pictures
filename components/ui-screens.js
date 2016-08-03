import { PropTypes } from 'react'

export const PicForm = ({ dataURI="", title="[untitled]", size=0, onSave=f=>f}) => {
    const submit = e => {
        e.preventDefault()
        onSave({dataURI,title,size})
    }
    return (
        <div className="pic-form">
            <form onSubmit={submit}>
                <h1>Finalize Image</h1>
                <img src={dataURI} alt={title}/>
                <p>{title}</p>
                <p>{size}</p>
                <button>Save Image</button>
            </form>
        </div>
    )
}

PicForm.propTypes = {
    dataURI: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.number,
    onSave: PropTypes.func
}

export const Pictures = ({pictures=[]}) =>
    <div className="pictures">
        {pictures.map((pic, i) => <img key={i} src={pic.dataURI} alt={pic.title}/>)}
    </div>

Pictures.propTypes = {
    pictures: PropTypes.array
}