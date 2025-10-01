import { Component, mount, h } from "./wnm/whyneedmore.js";
import { Router, registerRoute } from "./wnm/whyneedmore-router.js";

import { Home } from "./pages/home.js";
import { About } from "./pages/about.js";

import { MainLayout } from "./layout/mainLayout.js";

registerRoute("/", Home);
registerRoute("/about", About);

export class App extends Component {
    render() {
        return h(MainLayout, null, 
            h(Router, { fallback: Home })
        );
    }
}

mount(h(App), document.getElementById("app"));