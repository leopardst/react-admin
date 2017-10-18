import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardText, CardActions } from 'material-ui/Card';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import ActionCheck from 'material-ui-icons/CheckCircle';
import AlertError from 'material-ui-icons/ErrorOutline';
import compose from 'recompose/compose';
import inflection from 'inflection';
import ViewTitle from '../layout/ViewTitle';
import Title from '../layout/Title';
import { ListButton } from '../button';
import {
    crudGetOne as crudGetOneAction,
    crudDelete as crudDeleteAction,
} from '../../actions/dataActions';
import translate from '../../i18n/translate';

const styles = {
    actions: { zIndex: 2, display: 'inline-block', float: 'right' },
    toolbar: { clear: 'both' },
    button: { margin: '10px 24px', position: 'relative' },
};

class Delete extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        this.props.crudGetOne(
            this.props.resource,
            this.props.id,
            this.getBasePath()
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            this.props.crudGetOne(
                nextProps.resource,
                nextProps.id,
                this.getBasePath()
            );
        }
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname
            .split('/')
            .slice(0, -2)
            .join('/');
    }

    defaultRedirectRoute() {
        return 'list';
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.crudDelete(
            this.props.resource,
            this.props.id,
            this.props.data,
            this.getBasePath(),
            this.props.redirect
                ? this.props.redirect
                : this.defaultRedirectRoute()
        );
    }

    goBack() {
        this.props.history.goBack();
    }

    render() {
        const { title, id, data, isLoading, resource, translate } = this.props;
        const basePath = this.getBasePath();

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('ra.page.delete', {
            name: `${resourceName}`,
            id,
            data,
        });
        const titleElement = data ? (
            <Title title={title} record={data} defaultTitle={defaultTitle} />
        ) : (
            ''
        );

        return (
            <div>
                <Card style={{ opacity: isLoading ? 0.8 : 1 }}>
                    <CardActions style={styles.actions}>
                        <ListButton basePath={basePath} />
                    </CardActions>
                    <ViewTitle title={titleElement} />
                    <form onSubmit={this.handleSubmit}>
                        <CardText>
                            {translate('ra.message.are_you_sure')}
                        </CardText>
                        <Toolbar style={styles.toolbar}>
                            <ToolbarGroup>
                                <Button
                                    raised
                                    type="submit"
                                    label={translate('ra.action.delete')}
                                    icon={<ActionCheck />}
                                    primary
                                    style={styles.button}
                                />
                                <Button
                                    raised
                                    label={translate('ra.action.cancel')}
                                    icon={<AlertError />}
                                    onClick={this.goBack}
                                    style={styles.button}
                                />
                            </ToolbarGroup>
                        </Toolbar>
                    </form>
                </Card>
            </div>
        );
    }
}

Delete.propTypes = {
    title: PropTypes.any,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    data: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    crudGetOne: PropTypes.func.isRequired,
    crudDelete: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    redirect: PropTypes.string,
};

function mapStateToProps(state, props) {
    return {
        id: decodeURIComponent(props.match.params.id),
        data:
            state.admin.resources[props.resource].data[
                decodeURIComponent(props.match.params.id)
            ],
        isLoading: state.admin.loading > 0,
    };
}

const enhance = compose(
    connect(mapStateToProps, {
        crudGetOne: crudGetOneAction,
        crudDelete: crudDeleteAction,
    }),
    translate
);

export default enhance(Delete);
