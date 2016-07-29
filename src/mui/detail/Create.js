import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ListButton from '../button/ListButton';
import SaveButton from '../button/SaveButton';
import { crudCreate as crudCreateAction } from '../../actions/dataActions';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = { record: {} };
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleChange(key, value) {
        this.setState({ record: { ...this.state.record, [key]: value } });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.crudCreate(this.props.resource, this.state.record, this.getBasePath());
    }

    render() {
        const { title, children, data, isLoading, resource } = this.props;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? .8 : 1 }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <ListButton basePath={basePath} />
                </CardActions>
                <CardTitle title={title} />
                <form onSubmit={::this.handleSubmit}>
                    <div style={{ padding: '0 1em 1em 1em' }}>
                    {this.state ?
                        React.Children.map(children, input => (
                            <div key={input.props.source}>
                                <input.type
                                    {...input.props}
                                    resource={resource}
                                    record={this.state.record}
                                    onChange={::this.handleChange}
                                    basePath={basePath}
                                />
                            </div>
                        ))
                        :
                        'not good'
                    }
                    </div>
                    <Toolbar>
                        <ToolbarGroup>
                            <SaveButton />
                        </ToolbarGroup>
                    </Toolbar>
                </form>
            </Card>
        );
    }
}

Create.propTypes = {
    title: PropTypes.string,
    resource: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    crudCreate: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0,
    };
}

export default connect(
    mapStateToProps,
    { crudCreate: crudCreateAction },
)(Create);
