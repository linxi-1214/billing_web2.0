import React, { Component } from 'react';
import axios from 'axios';
import { nodeStateRenderer, nodePendRenderer, nodeUtilizationRenderer } from 'containers/node/renderer/node';
import 'react-select/dist/react-select.css';

class StateChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cluster: null,
            partition: null,
            start: null,
            end: null,
        };
        this.handleClusterChange = this.handleClusterChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        // this.requestState = this.requestState.bind(this);
    }

    // requestState(obj) {
    //     const cluster = obj.hasOwnProperty('cluster') ? obj['cluster'] : this.state.cluster;
    //     const partition = obj.hasOwnProperty('partition') ? obj['partition'] : this.state.partition;
    //     const start = obj.hasOwnProperty('start') ? obj['start'] : this.state.start;
    //     const end = obj.hasOwnProperty('end') ? obj['end'] : this.state.end;
    //     if (cluster == null || partition == null || start == null || end == null)
    //         return;
    //
    //     let data = {'cluster': cluster, 'partition': partition, start: start, end:end};
    //     axios({
    //             url: '/billing/api/node/state/info',
    //             method: 'get',
    //             params: data
    //         })
    //             .then(response => {
    //                 if (response.status == '200') {
    //                     this.setState(function(prevState, props) {
    //                         return {
    //                             dimensions: prevState.dimensions.concat(response.data.states),
    //                             dataset: response.data.dataset,
    //                             series: response.data.states
    //                         };
    //                     });
    //                 }
    //             });
    // }

    handleClusterChange(state, value) {
        this.setState({[state]: value});
    }

    handleTimeChange(start, end) {
        this.setState({start: start, end: end});
    }

    render() {
        return nodeStateRenderer.bind(this)()
    }
}

class PendChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cluster: null,
            partition: 'NonNull',
            start: null,
            end: null
        };
        this.handleClusterChange = this.handleClusterChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
    }

    handleClusterChange(state, value) {
        this.setState({[state]: value});
    }

    handleTimeChange(start, end) {
        this.setState({start: start, end: end});
    }

    render() {
        return nodePendRenderer.bind(this)()
    }
}

class UtilizationChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cluster: null,
            partition: 'NonNull',
            start: null,
            end: null
        };
        this.handleClusterChange = this.handleClusterChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
    }

    handleClusterChange(state, value) {
        this.setState({[state]: value});
    }

    handleTimeChange(start, end) {
        this.setState({start: start, end: end});
    }

    render() {
        return nodeUtilizationRenderer.bind(this)()
    }
}

class NodeInfoPills extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="offset-1"></div>
                <div className="col-2">
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                         aria-orientation="vertical">
                        <a className="nav-link active" id="v-pills-state-tab" data-toggle="pill" href="#v-pills-state"
                           role="tab" aria-controls="v-pills-state" aria-selected="true">状态统计</a>

                        <a className="nav-link" id="v-pills-pend-tab" data-toggle="pill" href="#v-pills-pend"
                           role="tab" aria-controls="v-pills-pend" aria-selected="false">排队统计</a>

                        <a className="nav-link" id="v-pills-utilization-tab" data-toggle="pill" href="#v-pills-utilization"
                           role="tab" aria-controls="v-pills-utilization" aria-selected="false">利用率统计</a>
                    </div>
                </div>
                <div className="col-8">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-state" role="tabpanel"
                             aria-labelledby="v-pills-state-tab">
                            <StateChart/>
                        </div>

                        <div className="tab-pane fade" id="v-pills-pend" role="tabpanel"
                             aria-labelledby="v-pills-pend-tab">
                            <PendChart/>
                        </div>

                         <div className="tab-pane fade" id="v-pills-utilization" role="tabpanel"
                             aria-labelledby="v-pills-utilization-tab">
                             <UtilizationChart/>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default NodeInfoPills;