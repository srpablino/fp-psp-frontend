import React from 'react';

class Gallery extends React.Component {

    constructor(props) {
        super(props);

        var current = '';
        if (props.formData) {
            if (Array.isArray(props.formData)) {
                current = props.formData[0];
            } else {
                current = props.formData;
            }
        }

        this.state = { 
            selected : current,
            urls: props.schema.items.enum,
            title: props.schema.title,
            required: props.required ? '*': ''
        };
    }

    renderImage(imageUrl, index, className) {
        return (
            <div  key={index} onClick={this._handleClickOnImage(index, imageUrl)} className={className} >
                <img src={imageUrl} />
            </div>
        );
    }

    render() {
        var images = [];
        for (var i = 0; i < this.state.urls.length; i++) {
            var url = this.state.urls[i];
            var clazz = url == this.state.selected ? 'gallery-selected' : '';
            clazz += ' gallery-image gallery-image-div '
            images.push(this.renderImage(url, i, clazz));
        }

        return (
            <div className="form-group field field-gallery">
                <label className="control-label">{ this.state.title } { this.state.required }</label>
                <div className="images">
                    {images}
                </div>
            </div>
        );
    }

    _handleClickOnImage(index, imageUrl) {
        var component = this;
        return function () {
            if (component.props.onChange) component.props.onChange(index, imageUrl);
            component.setState({
                selected: imageUrl
            });
            setImmediate(() => component.props.onChange([ imageUrl ]));
        }

    }
}


export default Gallery;