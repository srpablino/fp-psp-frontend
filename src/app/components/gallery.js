import React from 'react';

class Gallery extends React.Component {
  constructor(props) {
    super(props);

    let current = '';

    if (props.schema && props.schema.default) {
      if (Array.isArray(props.schema.default)) {
        current = props.schema.default[0].url;
      } else {
        current = props.formData;
      }
    }

    this.state = {
      selected: current,
      images: props.schema.items.enum,
      title: props.schema.title,
      required: props.required ? '*' : '',
      name: props.name
    };
  }

  renderImage(imageUrl, imageDescription, imageValue, index, className) {
    return (
      <div className="col-md-4" key={index}>
        <div
          onClick={this._handleClickOnImage(
            index,
            imageUrl,
            imageDescription,
            imageValue
          )}
          className={className}
        >
          <figure className={imageValue}>
            <img alt="" src={imageUrl} className="img-responsive" />
            <figcaption>{imageDescription}</figcaption>
          </figure>
        </div>
      </div>
    );
  }

  render() {
    const { schema, formData } = this.props;
    if (this.props.name !== this.state.name) {
      this.state = {
        selected: formData[0].url,
        images: schema.items.enum,
        title: schema.title,
        required: this.props.required ? '*' : '',
        name: this.props.name
      };
    }

    let images = [];
    for (let i = 0; i < this.state.images.length; i++) {
      let url = this.state.images[i].url;
      let description = this.state.images[i].description;
      let value = this.state.images[i].value;
      let clazz = url === this.state.selected ? 'gallery-selected' : '';
      clazz += ' gallery-image gallery-image-div ';
      images.push(this.renderImage(url, description, value, i, clazz));
    }

    return (
      <div className="form-group field field-gallery">
        <label className="control-label">
          {this.state.title} {this.state.required}
        </label>
        <br />
        <br />
        <div className="row">
          <div className="images col-sm-8 col-md-offset-2">
            <div className="row">{images}</div>
          </div>
        </div>
      </div>
    );
  }

  _handleClickOnImage(index, imageUrl, imageDescription, imageValue) {
    var component = this;
    return function() {
      if (component.props.onChange) {
        component.props.onChange(index, imageUrl, imageDescription, imageValue);
      }
      component.setState({
        selected: imageUrl
      });
      setImmediate(() =>
        component.props.onChange([
          { url: imageUrl, description: imageDescription, value: imageValue }
        ])
      );
    };
  }
}

export default Gallery;
