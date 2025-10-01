const routes = new Map();

export function registerRoute(path, component) {
    routes.set(path, component);
}

export class Router extends Component {
    constructor(props) {
        super(props);
        this.state = { currentPath: window.location.pathname };
        this.onPopState = this.onPopState.bind(this);
    }

    onPopState() {
        this.state.currentPath = window.location.pathname;
        this.stateHasChanged();
    }

    componentMount() {
        window.addEventListener("popstate", this.onPopState);
    }

    componentWillUnmount() {
        window.removeEventListener("popstate", this.onPopState);
    }

    navigate(path) {
        window.history.pushState({}, "", path);
        this.state.currentPath = path;
        this.stateHasChanged();
    }

    render() {
        const ComponentClass = routes.get(this.state.currentPath) || this.props.fallback || null;
        return ComponentClass ? h(ComponentClass, {}) : null;
    }
}

export function Link({ to, children }) {
    const onClick = (e) => {
        e.preventDefault();
        window.history.pushState({}, "", to);
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    return h("a", { href: to, onClick }, children);
}
