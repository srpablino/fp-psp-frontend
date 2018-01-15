import React from 'react';
import Datetime from 'react-datetime';

require('moment/locale/es');

// component properties reference
let componentProps;
// component reference
let componentRef;

class DatetimeFormat extends React.Component {
    constructor(props) {
      super(props);
      this.setInitialValues(props);
      componentRef = this;
      componentProps = props;
    }

    setInitialValues(props) {
      let value = "";
      if (props.schema && props.schema.default) {
        value = props.schema.default;
      } else if (props.formData === undefined || props.formData.length === 0) {
        value = "";
        setImmediate(() =>
          props.onChange("")
        );
      } else {
        value = props.formData;
      }

      this.state = {
        name: props.name,
        title: props.schema.title,
        required: props.required ? '*' : '',
        valueView: value
      };
    }

    _handleOnChange(calendarEvent) {
      let date = calendarEvent.format("YYYY-MM-DD");
      if (!calendarEvent._isValid) {
        componentRef.setState({
          valueView: ""
        });

        setImmediate(() =>
          componentRef.props.onChange("")
        );
        return;
      }
      componentRef.setState({
        valueView: date
      });

      setImmediate(() =>
        componentRef.props.onChange(date)
      );
    }

    render() {
        if (this.props.name !== this.state.name) {
          this.setInitialValues(this.props);
        }
        return <Datetime dateFormat="MM/DD/YYYY" timeFormat={false} locale="es" renderInput={this.renderInput} onChange={this._handleOnChange} />;
    }

    renderInput( props ){
      return (
        <div className="rdt form-group field field-number">
          <label className="control-label" >
            {componentProps.schema.title}{componentProps.required?"*":""}
          </label>
          <br />
          <div className="rdt">
            <input {...props} id={componentProps.idSchema.$id} required={componentProps.required}  className="form-control" type="text" />
          </div>
        </div>
      );
  }

}

export default DatetimeFormat;
