import { Link } from "../wnm/whyneedmore-router.js";
import { Component, h } from "../wnm/whyneedmore.js";

export class Navbar extends Component {
    render() {
        return h("nav", { class: "fixed bottom-0 left-0 right-0 mx-auto bg-gray-800 border-t border-gray-700" }, 
            h("div", { class: "flex justify-around items-center h-16" }, 
                h(Link, { to: "/", activeClass: "selected", class: "flex flex-col items-center justify-center flex-1 h-full transition-colors text-gray-400 navbutton" }, 
                    h("img", { src: "/assets/icons/home.svg", class: "w-6 h-6" }),
                    h("span", { class: "text-xs mt-1" }, "Home")
                ),

                h(Link, { to: "/about", activeClass: "selected", class: "flex flex-col items-center justify-center flex-1 h-full transition-colors text-gray-400 navbutton" }, 
                    h("img", { src: "/assets/icons/home.svg", class: "w-6 h-6" }),
                    h("span", { class: "text-xs mt-1" }, "About")
                ),
                
                h(Link, { to: "/about", activeClass: "selected", class: "flex flex-col items-center justify-center flex-1 h-full transition-colors text-gray-400 navbutton" }, 
                    h("img", { src: "/assets/icons/home.svg", class: "w-6 h-6" }),
                    h("span", { class: "text-xs mt-1" }, "About")
                ),
                
                h(Link, { to: "/about", activeClass: "selected", class: "flex flex-col items-center justify-center flex-1 h-full transition-colors text-gray-400 navbutton" }, 
                    h("img", { src: "/assets/icons/home.svg", class: "w-6 h-6" }),
                    h("span", { class: "text-xs mt-1" }, "About")
                ),
            ),
        );
    }
}