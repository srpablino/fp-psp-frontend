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
            images: props.schema.items.enum,
            title: props.schema.title,
            required: props.required ? '*': ''
        };
    }

    renderImage(imageUrl, imageDescription, imageValue, index, className) {
        return (
            <div  key={index} onClick={this._handleClickOnImage(index, imageUrl, imageDescription, imageValue)} className={className} >
            <figure>
                <img src={imageUrl} />
                <figcaption>{imageDescription}</figcaption>
                </figure>
            </div>
        );
    }

    render() {
        var images = [];
        for (var i = 0; i < this.state.images.length; i++) {
            var url = this.state.images[i]['url'];
            var description = this.state.images[i]['description'];
            var value = this.state.images[i]['value'];
            var clazz = url == this.state.selected ? 'gallery-selected' : '';
            clazz += ' gallery-image gallery-image-div '
            images.push(this.renderImage(url, description, value, i, clazz));
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

    _handleClickOnImage(index, imageUrl, imageDescription, imageValue) {
        var component = this;
        return function () {
            if (component.props.onChange) component.props.onChange(index, imageUrl, imageDescription, imageValue);
            component.setState({
                selected: imageUrl
            });
            setImmediate(() => component.props.onChange([ {"url":imageUrl, "description":imageDescription, "value":imageValue} ]));
        }

    }
}


export default Gallery;