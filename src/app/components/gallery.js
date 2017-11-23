import React from 'react';

class Gallery extends React.Component {

    constructor(props) {
        super(props);

        var current = '';

        if (props.schema && props.schema['default']) {
            if (Array.isArray(props.schema['default'])) {
                current = props.schema['default'][0]['url'];
            } else {
                current = props.formData;
            }
        }

        this.state = { 
            selected : current,
            images: props.schema.items.enum,
            title: props.schema.title,
            required: props.required ? '*': '',
            name: props.name
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

        const { schema, uiSchema, fields, onSubmit, onError, formData } = this.props;
        if(this.props.name !== this.state.name){
            this.state = {
                selected: formData[0].url,
                images: schema.items.enum,
                title: schema.title,
                required: this.props.required ? '*':'',
                name: this.props.name
            };
        }

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