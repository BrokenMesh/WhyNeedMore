import { h, Component } from './whyneedmore.js';
import { CounterService } from './counterService.js';

export class Counter extends Component {
    constructor(props) {
        super(props);
        this.count = props.initialCount || 0;
        this.counterService = this.getService(CounterService);
    }

    inc() {
        this.count++;
        this.stateHasChanged();
        this.counterService.increment();
    }

    dec() {
        this.count--;
        this.stateHasChanged();
        this.counterService.decrement();
    }

    render() {
        return h('div', null,
            h("h2", null, "Count: ", this.count),
            h("button", { onClick: () => this.inc(), }, "Increment"),
            h("button", { onClick: () => this.dec(), style: "margin-left:5px" }, "Decrement"),
        );
    }
}