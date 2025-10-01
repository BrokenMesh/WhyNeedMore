// ---- WhyNeedMore Router - 01.10.25 - elkordhicham@gmail.com ----

import { Component, h } from "./whyneedmore.js";

const routes = new Map();

export function registerRoute(path, component) {
    routes.set(path, component);
}

export class Router extends Component {
    static instance = null;

    constructor(props) {
        super(props);
        this.currentPath = window.location.pathname;
        this.onPopState = this.onPopState.bind(this);
        Router.instance = this;
    }

    onPopState() {
        this.currentPath = window.location.pathname;
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
        this.currentPath = path;
        this.stateHasChanged();
    }

    render() {
        const ComponentClass = routes.get(this.currentPath) || this.props.fallback || null;
        return ComponentClass ? h(ComponentClass, {}) : null;
    }
}

export class Link extends Component {   
    constructor(props) {
        super(props);
    }

    onClick(e) {
        e.preventDefault();
        window.history.pushState({}, "", this.props.to);
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    selectStyle() {
        if (Router.instance.currentPath === this.props.to) {
            return (this.props.class ?? "") + " " + (this.props.activeClass ?? "");
        }

        return this.props.class ?? "";
    }

    render() {
        return h("button", { href: this.props.to, onClick: (e) => this.onClick(e), class: this.selectStyle() }, this.props.children);
    }
}