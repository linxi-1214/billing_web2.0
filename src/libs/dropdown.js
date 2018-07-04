import React, {Component} from 'react';
import axios from 'axios';
import VirtualizedSelect from 'react-virtualized-select';

function optionRenderer ({focusedOption, focusedOptionIndex, focusOption, key, labelKey,
    option, optionIndex, options, selectValue, style, valueArray, valueKey}) {
    const classNames = ['select-option'];

    if (option === focusedOption) {
        classNames.push('select-option-focused')
    }
    if (valueArray.indexOf(option) >= 0) {
        classNames.push('select-option-selected')
    }

    return (
        <div
            className={classNames.join(' ')}
            key={key}
            onClick={() => selectValue(option)}
            onMouseEnter={() => focusOption(option)}
            style={style}
        >
            {option[labelKey]}
        </div>
    )

}


class AsyncSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            option_key: null,
            selectedOption: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.changeOptions = this.changeOptions.bind(this);
        this._loadOptions = this._loadOptions.bind(this);
    }

    componentDidMount() {
        if (this.props.url != null && this.props.url != undefined)
            this._loadOptions();
    }

    componentDidUpdate(prevProps) {
        if (this.props.updateKey !== prevProps.updateKey  && this.props.url != null && this.props.url != undefined)
            this._loadOptions()
    }

    _loadOptions() {
        return axios({
            url: this.props.url,
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                const options = this.changeOptions(response.data);
                this.setState({options: options, selectedOption: null});
            });

    }

    changeOptions(_options) {
        let options = _options || this.state.options;
        if (this.props.optionKey != null && options != null && options.hasOwnProperty(this.props.optionKey))
            options = options[this.props.optionKey];

        if (options == null)
            return [];

        if (!(options instanceof Array))
            return [];

        return options;
    }

    handleChange(selectedOption) {
        this.setState({
            selectedOption: selectedOption
        });
        let valueKey = this.props.valueKey || 'value';
        this.props.onChange(this.props.name, selectedOption[valueKey]);
    }

    render() {
        return (
            <VirtualizedSelect
                autoFocus
                id={this.props.id}
                labelKey={this.props.labelKey}
                valueKey={this.props.valueKey}
                optionRenderer={optionRenderer}
                onChange={this.handleChange}
                clearable={true}
                name={this.props.name}
                options={this.props.url == null ? this.props.options : this.state.options}
                value={this.props.value || this.state.selectedOption}
                searchable={true}
            />
        )
    }
}

export {AsyncSelect}