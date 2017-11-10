import dispatcher from "./dispatcher";

/**
 * Initial data fetching action
 *
 * This action is triggered on the first time ApisearchUI is initialized:
 *   @param initialQuery -> initial application query
 *   @param client       -> apisearch client to trigger a search
 *
 * Finally dispatches an event with the search result and
 * the modified query.
 *   @returns {{
 *     type: string,
 *     payload: {
 *        result,
 *        updatedQuery
 *     }
 *   }}
 */
export function initialDataFetchAction(
    initialQuery,
    client
) {
    client.search(initialQuery, initialResult => {
        dispatcher.dispatch({
            type: 'RENDER_INITIAL_DATA',
            payload: {
                initialResult,
                initialQuery
            }
        })
    })
}