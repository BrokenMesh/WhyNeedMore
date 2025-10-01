import { Component, h } from "../wnm/whyneedmore.js";
import { Navbar } from "./navbar.js";

export class MainLayout extends Component {
    render() {
        return h("div", { class: "p-4 pb-20" }, 
            h("div", { class: "space-y-4"}, this.props.children),
            h(Navbar)
        );
    }
}