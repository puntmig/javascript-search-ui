/**
 * @jsx h
 */
import { h, Component } from 'preact';
import Template from "../Template";
import {paginationChangeAction} from "./paginationActions";
import {
    getTotalPages,
    totalPagesToArray,
    getStart,
    getEnd
} from "./helpers";

/**
 * Pagination Component
 */
class PaginationComponent extends Component {

    handleClick = (page) => {
        const {
            data,
            environmentId,
            currentQuery,
            client
        } = this.props;

        let totalPages = getTotalPages({
            totalHits: data.total_hits,
            hitsPerPage: currentQuery.size
        });

        /**
         * Do not let go further
         */
        if (page <= 0) page = 1;
        if (page >= totalPages) page = totalPages;

        /**
         * Dispatch change page action
         */
        paginationChangeAction(
            {
                selectedPage: page
            },
            {
                environmentId,
                currentQuery,
                client
            }
        );
    };

    render() {
        const {
            padding,
            goFirstLast,
            classNames: {
                container: containerClassName,
                item: itemClassName,
                active: activeClassName,
                disabled: disabledClassName,
                next: nextClassName,
                previous: previousClassName,
                last: lastClassName,
                first: firstClassName,
            },
            template: {
                item: itemTemplate,
                next: nextTemplate,
                previous: previousTemplate,
                first: firstTemplate,
                last: lastTemplate
            },
            currentQuery: {
                page: currentQueryPage,
                size: currentQuerySize
            },
            data
        } = this.props;

        /**
         * Get Total pages
         */
        let totalPages = getTotalPages({
            totalHits: data.total_hits,
            hitsPerPage: currentQuerySize
        });
        let pages = totalPagesToArray(totalPages);

        /**
         *  Get pages spectre
         */
        const paginationSettings = {
            totalPages,
            padding,
            currentPage: currentQueryPage,
            spectreSize: (padding * 2) + 1,
            isTouchingLeft: currentQueryPage <= (padding + 1),
            isTouchingRight: (currentQueryPage + padding) >= totalPages
        };
        let spectre = pages.slice(
            getStart(paginationSettings),
            getEnd(paginationSettings)
        );

        /**
         * Dynamic disabled classes
         */
        let previousDisabledClass = (currentQueryPage === 1) ? disabledClassName : '';
        let nextDisabledClass = (currentQueryPage === totalPages) ? disabledClassName : '';

        /**
         * Hide container if hits are empty
         */
        if (data.total_hits === 0) return null;

        return (
            <ul className={`asui-pagination ${containerClassName}`}>
                <NavigationComponent
                    isVisible={goFirstLast}
                    classNames={`asui-pagination--item ${firstClassName} ${previousDisabledClass}`}
                    template={firstTemplate}
                    handleClick={() => this.handleClick(1)}
                />
                <NavigationComponent
                    isVisible={true}
                    classNames={`asui-pagination--item ${previousClassName} ${previousDisabledClass}`}
                    template={previousTemplate}
                    handleClick={() => this.handleClick(currentQueryPage - 1)}
                />

                {spectre.map(page => (
                    <li
                        className={`asui-pagination--item ${itemClassName} ${
                            (currentQueryPage === page) ? activeClassName : ''
                        }`}
                        onClick={() => this.handleClick(page)}
                    >
                        <Template
                            template={itemTemplate}
                            data={{page: page}}
                        />
                    </li>
                ))}

                <NavigationComponent
                    isVisible={true}
                    classNames={`asui-pagination--item ${nextClassName} ${nextDisabledClass}`}
                    template={nextTemplate}
                    handleClick={() => this.handleClick(currentQueryPage + 1)}
                />
                <NavigationComponent
                    isVisible={goFirstLast}
                    classNames={`asui-pagination--item ${lastClassName} ${nextDisabledClass}`}
                    template={lastTemplate}
                    handleClick={() => this.handleClick(totalPages)}
                />
            </ul>
        );
    }
}

function NavigationComponent({
    isVisible,
    classNames,
    template,
    handleClick
}) {
    return (isVisible)
        ? <li
            className={classNames}
            onClick={handleClick}
        >
            <Template template={template} />
        </li> : null
    ;
}

PaginationComponent.defaultProps = {
    padding: 3,
    goFirstLast: false,
    classNames: {
        container: '',
        item: '',
        active: 'active',
        disabled: 'disabled',
        next: '',
        first: '',
        previous: '',
        last: ''
    },
    template: {
        item: '{{page}}',
        next: 'Next >',
        previous: '< Prev',
        first: '<< First',
        last: 'Last >>'
    }
};

export default PaginationComponent;