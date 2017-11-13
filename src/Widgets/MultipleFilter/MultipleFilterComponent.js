/**
 * @jsx h
 */
import { h, Component } from 'preact';
import Template from "../Template";
import ShowMoreComponent from "./ShowMoreComponent";
import {
    aggregationSetup,
    filterAction
} from "./multipleFilterActions";
import {
    aggregationsObjectToArray,
    manageCurrentFilterItems,
    simpleObjectToArray
} from "./helpers";

/**
 * Filter Component
 */
class MultipleFilterComponent extends Component {
    constructor() {
        super();
        this.state = {
            limit: 0,
            activeAggregations: [],
            currentAggregations: []
        }
    }

    componentWillMount() {
        const {
            field: filterField,
            name: filterName,
            applicationType,
            sortBy,
            limit,
            currentQuery
        } = this.props;

        this.setState({limit});

        /**
         * Dispatch action
         */
        aggregationSetup(
            {
                filterField,
                filterName,
                applicationType,
                sortBy
            },
            currentQuery
        )
    }

    componentWillReceiveProps(props) {
        const {
            name: filterName,
            data: {
                aggregations: {
                    aggregations
                }
            }
        } = props;

        if (typeof aggregations[filterName] !== 'undefined') {
            let aggregation = aggregations[filterName];
            let counters = (aggregation.counters) ? aggregation.counters : {};
            let aggregationsArray = aggregationsObjectToArray(counters);

            this.setState({
                /**
                 * Current used aggregations
                 */
                activeAggregations: aggregationsArray.filter(
                    item => item.used
                ),
                /**
                 * Current inactive aggregations
                 */
                currentAggregations: aggregationsArray.filter(
                    item => null === item.used
                )
            })
        }
    }

    handleClick = (selectedFilter) => {
        const {
            name: filterName,
            field: filterField,
            applicationType,
            sortBy,
            currentQuery,
            client,
            data: {
                aggregations: {
                    aggregations
                }
            }
        } = this.props;

        let activeElements = aggregations[filterName].active_elements;
        let currentActiveFilterValues = (typeof activeElements !== 'undefined')
            ? simpleObjectToArray(activeElements)
            : []
        ;

        /**
         * Dispatch action
         */
        filterAction(
            {
                filterName,
                filterField,
                applicationType,
                filterValues: manageCurrentFilterItems(
                    selectedFilter,
                    currentActiveFilterValues
                ),
                sortBy
            },
            currentQuery,
            client
        );
    };

    handleShowMore = () => {
        const {activeAggregations, currentAggregations} = this.state;
        const limit = activeAggregations.length + currentAggregations.length;

        this.setState({limit})
    };

    handleShowLess = () => {
        this.setState({
            limit: this.props.limit
        })
    };

    render() {
        const {
            showMoreActive,
            classNames: {
                container: containerClassName,
                top: topClassName,
                itemsList: itemsListClassName,
                item: itemClassName,
                showMoreContainer: showMoreContainerClassName
            },
            template: {
                top: topTemplate,
                item: itemTemplate,
                showMore: showMoreTemplate,
                showLess: showLessTemplate
            }
        } = this.props;

        /**
         * Get aggregation items
         */
        const allItems = [
            ...this.state.activeAggregations,
            ...this.state.currentAggregations
        ];
        const items = allItems.slice(0, this.state.limit);

        return (
            <div className={`asui-multipleFilter ${containerClassName}`}>
                <Template
                    template={topTemplate}
                    className={`asui-multipleFilter--top ${topClassName}`}
                />

                <div className={`asui-multipleFilter--itemsList ${itemsListClassName}`}>
                {items.map(item => {
                    const reducedTemplateData = {
                        n: parseInt(item.n).toLocaleString('de-DE'),
                        isActive: item.used,
                        values: item.values
                    };

                    return (
                        <div
                            className={`asui-multipleFilter--item ${itemClassName}`}
                            onClick={() => this.handleClick(item.__key)}
                        >
                            <Template
                                template={itemTemplate}
                                data={reducedTemplateData}
                            />
                        </div>
                    )
                })}
                </div>

                {(showMoreActive)
                    ? <ShowMoreComponent
                        allItems={allItems}
                        currentLimit={this.state.limit}
                        handleShowMore={this.handleShowMore}
                        handleShowLess={this.handleShowLess}
                        showMoreContainerClassName={showMoreContainerClassName}
                        showMoreTemplate={showMoreTemplate}
                        showLessTemplate={showLessTemplate}
                    /> : null
                }

            </div>
        )
    }
}

MultipleFilterComponent.defaultProps = {
    applicationType: 8, // FILTER_MUST_ALL
    limit: 10,
    sortBy: ['_count', 'asc'],
    showMoreActive: true,
    classNames: {
        container: '',
        top: '',
        itemList: '',
        item: '',
        showMoreContainer: ''
    },
    template: {
        top: null,
        item: null,
        showMore: '+ Show more',
        showLess: '- Show less'
    }
};

export default MultipleFilterComponent;