import { h, registerService, Component, If, For } from './whyneedmore.js';
import { Counter } from './counter.js';
import { CounterService } from './counterService.js';

registerService(CounterService, new CounterService());

export class App extends Component {
    constructor(props) {
        super(props);
        this.showCounter = true;
        this.counterService = this.getService(CounterService);
    }

    toggleShowCounter() {
        this.showCounter = !this.showCounter;
        this.stateHasChanged();
    }

    render() {
        return h('div', null,
            h('h1', null, this.counterService.value),
            h('button', { onClick: () => this.toggleShowCounter() }, 
                this.showCounter ? 'Hide Counter' : 'Show Counter'
            ),
            If(this.showCounter, 
                For([1, 2, 3, 4, 5], (v, i) =>
                    h(Counter, { initialCount: v, key: i })
                ),
            ),
        );
    }
}