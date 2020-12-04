import { h, render } from 'preact';
import SortByComponent from "../components/SortBy/SortByComponent";
import {Repository, SortBy as ApisearchSortBy} from "apisearch";
import Widget from "./Widget";
import Store from "../Store";

/**
 * SortBy
 */
class SortBy extends Widget {

    private targetNode: any;

    constructor({
        target,
        classNames,
        options
    }) {
        super();
        this.target = target;
        this.targetNode = document.querySelector(this.target);
        this.component = <SortByComponent
            target={target}
            classNames={{
                ...SortByComponent.defaultProps.classNames,
                ...classNames
            }}
            options={options}
        />
    }

    /**
     * Widget
     *
     * @param environmentId
     * @param store
     * @param repository
     */
    render(
        environmentId:string,
        store:Store,
        repository:Repository
    ){
        this.component.props = {
            ...this.component.props,
            environmentId: environmentId,
            repository: repository,
            dirty: store.isDirty(),
            currentResult: store.getCurrentResult(),
            currentQuery: store.getCurrentQuery(),
        };

        render(
            this.component,
            this.targetNode
        )
    }

    /**
     * @param query
     * @param object
     */
    public toUrlObject(
        query: any,
        object: any
    )
    {
        if (
            query.sort !== undefined
        ) {
            const sort = query.sort[0];
            const sortInstance = ApisearchSortBy.createFromArray(query.sort);
            const sortAsString = sortInstance.getFirstSortAsString();
            const firstSortAsString = this.component.props.options[0].value

            if (sortAsString !== firstSortAsString) {
                const sortField = sort.field.substr(17);
                const sortOrder = sort.order;
                object.sort = sortField + ':' + sortOrder;
            }
        }


    }

    /**
     * @param object
     * @param query
     */
    public fromUrlObject(
        object: any,
        query: any
    )
    {
        if (object.sort !== undefined) {
            if (query.sort == undefined) {
                query.sort = [{}];
            }

            if (object.sort === 'score') {
                query.sort[0].field = '_score';
                query.sort[0].order = 'desc';
                return;
            }

            const sortParts = object.sort.split(':');
            query.sort[0].field = 'indexed_metadata.' + sortParts[0];
            query.sort[0].order = sortParts[1];
        }
    }
}

/**
 * SortBy widget
 *
 * @param settings
 */
export default settings => new SortBy(settings);
