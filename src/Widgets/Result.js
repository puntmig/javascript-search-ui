import AbstractReadWidget from "./AbstractReadWidget";

export default class Result extends AbstractReadWidget {
    constructor(target, {
        className = ''
    }) {
        super(target);

        this.className = className;
    }

    render(data) {
        let target = document.querySelector(this.target);

        // clear result html block
        target.innerHTML = null;

        // render the new list of results
        data.items.map(item => {
            let itemNode = document.createElement('div');
            itemNode.appendChild(document.createTextNode(item.metadata.content));

            // Render item
            target.appendChild(itemNode);
        });
    }
}