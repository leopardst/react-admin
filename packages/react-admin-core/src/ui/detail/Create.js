import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import inflection from 'inflection';
import translate from '../../i18n/translate';
import { crudCreate as crudCreateAction } from '../../actions';

/**
 * Page component for the Create view
 * 
 * The `<Create>` component renders the page title and actions.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes pass the `record` as prop.
 *
 * The `<Create>` component accepts the following props:
 *
 * - title
 * - actions
 * 
 * Both expect an element for value.
 * 
 * @example     
 *     // in src/posts.js
 *     import React from 'react';
 *     import { Create, SimpleForm, TextInput } from 'react-admin';
 *     
 *     export const PostCreate = (props) => (
 *         <Create {...props}>
 *             <SimpleForm>
 *                 <TextInput source="title" />
 *             </SimpleForm>
 *         </Create>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'react-admin';
 *     
 *     import { PostCreate } from './posts';
 *     
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" create={PostCreate} />
 *         </Admin>
 *     );
 *     export default App;
 */
class Create extends Component {
    getBasePath() {
        const { match } = this.props;
        return match.url
            .split('/')
            .slice(0, -1)
            .join('/');
    }

    defaultRedirectRoute() {
        const { hasShow, hasEdit } = this.props;
        if (hasEdit) return 'edit';
        if (hasShow) return 'show';
        return 'list';
    }

    save = (record, redirect) => {
        this.props.crudCreate(
            this.props.resource,
            record,
            this.getBasePath(),
            redirect
        );
    };

    render() {
        const { children, isLoading, record, resource, translate } = this.props;

        if (!children) return null;
        const basePath = this.getBasePath();

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('ra.page.create', {
            name: `${resourceName}`,
        });
        return children({
            isLoading,
            defaultTitle,
            save: this.save,
            resource,
            basePath,
            record,
            redirect: this.defaultRedirectRoute(),
        });
    }
}

Create.propTypes = {
    children: PropTypes.func.isRequired,
    crudCreate: PropTypes.func.isRequired,
    hasCreate: PropTypes.bool,
    hasDelete: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    record: PropTypes.object,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    translate: PropTypes.func.isRequired,
};

Create.defaultProps = {
    record: {},
};

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0,
    };
}

const enhance = compose(
    connect(mapStateToProps, { crudCreate: crudCreateAction }),
    translate
);

export default enhance(Create);
