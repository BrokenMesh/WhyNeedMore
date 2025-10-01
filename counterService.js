import { ServiceBase } from './whyneedmore.js';

export class CounterService extends ServiceBase {
    constructor() {
        super();
        this.value = 0;
    }

    increment() { 
        this.value++;
        this.stateHasChanged(); 
    }

    decrement() { 
        this.value--; 
        this.stateHasChanged();
    }
}