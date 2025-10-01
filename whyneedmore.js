// ---- WhyNeedMore - 01.10.25 - elkordhicham@gmail.com ----

export function h(type, props, ...children) {
    props = props || {};
    return { type, props, children: flattenChildren(children) };
}

export class Component {
    constructor(props) {
        this.props = props || {};
        this._vnode = null;
        this._el = null;
    }

    _render() {
        return this.render();
    }

    _handleStateChange() {
        if (!(this._el && this._parent)) return;

        const oldVnode = this._vnode;
        const newVnode = this._render();

        const newEl = diff(this._el, oldVnode, newVnode, this._parent);

        if (this._mounted) {
            this.componentUpdate?.(oldVnode);
        }

        this._el = newEl;
        this._vnode = newVnode;
    }

    getService(token) {
        const svc = getService(token);
        if (svc instanceof ServiceBase) {
            svc._subscribe(this);

            const oldUnmount = this.componentWillUnmount?.bind(this);
            this.componentWillUnmount = () => {
                svc._unsubscribe(this);
                oldUnmount?.();
            };
        }
        return svc;
    }

    stateHasChanged() {
        scheduleUpdate(this);
    }

    componentMount() { }
    componentUpdate(oldVnode) { }
    componentUnmount() { }
    render() { }
}

let updateQueue = new Set();

function scheduleUpdate(component) {
    updateQueue.add(component);
    requestAnimationFrame(() => {
        updateQueue.forEach(c => c._handleStateChange());
        updateQueue.clear();
    });
}

function createElement(vnode, parent) {
    if (typeof vnode.type === "function") {
        const comp = new vnode.type(vnode.props);
        comp._parent = parent;
        comp._vnode = comp._render();
        comp._el = createElement(comp._vnode, parent);
        comp._el.__component__ = comp;

        comp.componentDidMount?.();
        comp._mounted = true;

        return comp._el;
    }

    if (vnode.type === "TEXT") {
        return document.createTextNode(vnode.text);
    }

    const el = document.createElement(vnode.type);

    for (let [key, value] of Object.entries(vnode.props)) {
        if (key.startsWith("on") && typeof value === "function") {
            el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === "style" && typeof value === "string") {
            el.style.cssText = value;
        } else {
            el.setAttribute(key, value);
        }
    }

    vnode.children.forEach(child => {
        if (child != null) {
            el.appendChild(createElement(child, el));
        }
    });

    return el;
}

function diff(el, oldVnode, newVnode, parent) {

    if (!oldVnode) {
        const newEl = createElement(newVnode, parent);
        parent.appendChild(newEl);
        return newEl;
    }

    if (!newVnode) {
        if (el?.__component__) el.__component__.componentWillUnmount?.();
        if (el) parent.removeChild(el);
        return null;
    }

    if (oldVnode.type !== newVnode.type) {
        const newEl = createElement(newVnode, parent);
        if (el) {
            if (el.__component__) el.__component__.componentWillUnmount?.();
            parent.replaceChild(newEl, el);
        }
        return newEl;
    }

    if (typeof newVnode.type === "function") {
        const comp = el.__component__;
        comp.props = newVnode.props;

        const oldChildVnode = comp._vnode;
        const newChildVnode = comp._render();
        comp._vnode = newChildVnode;

        const newEl = diff(comp._el, oldChildVnode, newChildVnode, parent);
        comp._el = newEl;
        return newEl;
    }

    if (newVnode.type === "TEXT") {
        if (oldVnode.text !== newVnode.text) {
            el.textContent = newVnode.text;
        }
        return el;
    }

    updateProps(el, oldVnode.props, newVnode.props);

    diffChildren(el, oldVnode.children || [], newVnode.children || []);

    return el;
}

function diffChildren(parent, oldChildren, newChildren) {
    const keyedOld = {};
    const oldEls = [];

    oldChildren.forEach((child, i) => {
        const key = child.props?.key;
        if (key != null) {
            keyedOld[key] = { vnode: child, el: parent.childNodes[i] };
        } else {
            oldEls.push({ vnode: child, el: parent.childNodes[i] });
        }
    });

    let lastIndex = 0;
    const usedOldEls = new Set();

    newChildren.forEach((child, i) => {
        const key = child.props?.key;
        let matched = null;

        if (key != null && keyedOld[key]) {
            matched = keyedOld[key];
            delete keyedOld[key];
        } else if (oldEls.length > 0) {
            matched = oldEls.shift();
            usedOldEls.add(matched.el);
        }

        const newEl = diff(matched ? matched.el : null, matched ? matched.vnode : null, child, parent);

        if (!matched) {
            parent.appendChild(newEl);
        } else if (newEl !== matched.el && matched.el) {
            parent.insertBefore(newEl, parent.childNodes[i] || null);
        }

        lastIndex = i;
    });

    Object.values(keyedOld).forEach(({ el }) => {
        if (el) parent.removeChild(el);
    });

    oldEls.forEach(({ el }) => {
        if (el && !usedOldEls.has(el)) parent.removeChild(el);
    });
}

function updateProps(el, oldProps, newProps) {
    oldProps = oldProps || {};
    newProps = newProps || {};

    for (let key in oldProps) {
        if (!(key in newProps)) {
            if (key.startsWith("on") && typeof oldProps[key] === "function") {
                el.removeEventListener(key.slice(2).toLowerCase(), oldProps[key]);
            } else {
                el.removeAttribute(key);
            }
        }
    }

    for (let key in newProps) {
        const oldValue = oldProps[key];
        const newValue = newProps[key];

        if (oldValue !== newValue) {
            if (key.startsWith("on") && typeof newValue === "function") {
                if (oldValue) el.removeEventListener(key.slice(2).toLowerCase(), oldValue);
                el.addEventListener(key.slice(2).toLowerCase(), newValue);
            } else if (key === "style" && typeof newValue === "string") {
                el.style.cssText = newValue;
            } else {
                el.setAttribute(key, newValue);
            }
        }
    }
}

function flattenChildren(children) {
    const result = [];

    function flatten(item) {
        if (item == null || item === false) return;
        if (Array.isArray(item)) {
            item.forEach(flatten);
        } else if (typeof item !== "object") {
            result.push({ type: "TEXT", text: String(item) });
        } else {
            result.push(item);
        }
    }

    flatten(children);
    return result;
}


export class ServiceBase {
    constructor() {
        this._subscribers = new Set();
    }

    _subscribe(component) {
        this._subscribers.add(component);
    }

    _unsubscribe(component) {
        this._subscribers.delete(component);
    }

    stateHasChanged() {
        for (const comp of this._subscribers) {
            comp.stateHasChanged();
        }
    }
}

const serviceRegistry = new Map();

export function registerService(token, instance) {
    serviceRegistry.set(token, instance);
}

export function getService(token) {
    return serviceRegistry.get(token);
}

export function If(condition, node) {
    return condition ? node : null;
}

export function For(array, renderFn) {
    return array.map(renderFn);
}

export function mount(vnode, container) {
    const el = createElement(vnode, container);
    container.appendChild(el);
}