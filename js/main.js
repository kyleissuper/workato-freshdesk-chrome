var control_panel = {
    has_localstorage: function has_localstorage() {
        try {
            localStorage["hello"] = "world";
            localStorage.removeItem("hello");
            return true;
        }
        catch(e) {
            return false;
        }
    },
    get_data: function get_data() {
        if (document.title.length > 40) {
            var current_data = {
                url: document.URL,
                text: document.title.slice(0, 35) + "..."
            }
        } else {
            var current_data = {
                url: document.URL,
                text: document.title
            }
        }
        return current_data;
    },
    add_pin: function add_pin(evt) {
        evt.preventDefault();
        var current_data = control_panel.get_data();
        var stored = JSON.parse(localStorage["pinned"]);
        stored[current_data.url] = current_data.text;
        localStorage["pinned"] = JSON.stringify(stored);
        control_panel.update_pinned();
    },
    remove_pin: function remove_pin(evt) {
        evt.preventDefault();
        var stored = JSON.parse(localStorage["pinned"]);
        delete stored[evt.target.parentElement.href];
        localStorage["pinned"] = JSON.stringify(stored);
        control_panel.update_pinned();
    },
    update_pinned: function update_pinned() {
        if (!control_panel.local_storage
                || !control_panel.current_data
                || control_panel.local_storage !== JSON.parse(localStorage["pinned"])
                || current_data.url !== document.URL) {
            control_panel.local_storage = JSON.parse(localStorage["pinned"]);
            control_panel.current_data = control_panel.get_data();
            document.querySelectorAll(".pinned_item").forEach(function deleteElements(pinned_element) {
                pinned_element.outerHTML = "";
                delete pinned_element;
            });
            if (!control_panel.local_storage[document.URL]
                    && control_panel.on_ticket_page()) {
                // "Pin this"
                var pinned_item = document.createElement("a");
                pinned_item.className = "pinned_item no_h";
                var pinned_text = document.createElement("span");
                pinned_text.innerText = "Pin This:";
                pinned_item.appendChild(pinned_text);
                document.querySelector("div.control_panel").appendChild(pinned_item);

                // "Item to be pinned"
                var pinned_item = document.createElement("a");
                pinned_item.className = "pinned_item new_item";
                pinned_item.href = document.URL;
                
                var pinned_text = document.createElement("span");
                pinned_text.innerText = control_panel.current_data.text;
                var pinned_closer = document.createElement("div");
                pinned_closer.innerText = "+";
                pinned_closer.addEventListener("click", control_panel.add_pin);
                
                pinned_item.appendChild(pinned_text);
                pinned_item.appendChild(pinned_closer);
                
                document.querySelector("div.control_panel").appendChild(pinned_item);
            }
            if (Object.keys(control_panel.local_storage).length > 0) {
                // "Pin this"
                var pinned_item = document.createElement("a");
                pinned_item.className = "pinned_item no_h";
                var pinned_text = document.createElement("span");
                pinned_text.innerText = "Pinned Tickets:";
                pinned_item.appendChild(pinned_text);
                document.querySelector("div.control_panel").appendChild(pinned_item);
            }
            for (var url in control_panel.local_storage) {
                // "Pinned items"
                var pinned_item = document.createElement("a");
                pinned_item.className = "pinned_item";
                pinned_item.href = url;
                
                var pinned_text = document.createElement("span");
                pinned_text.innerText = control_panel.local_storage[url];
                var pinned_closer = document.createElement("div");
                pinned_closer.innerText = "x";
                pinned_closer.addEventListener("click", control_panel.remove_pin);
                
                pinned_item.appendChild(pinned_text);
                pinned_item.appendChild(pinned_closer);
                
                document.querySelector("div.control_panel").appendChild(pinned_item);
            }
        }
    },
    create_element: function create_element() {
        control_panel.temp = document.createElement("div");
        var control_panel_el = document.createElement("div");
        control_panel_el.className = "control_panel";
        document.querySelector("body").appendChild(control_panel_el);
    },
    on_ticket_page: function on_ticket_page() {
        if (document.URL.slice(0, 45) == "https://support.workato.com/helpdesk/tickets/"
                && !!(document.URL.slice(45).replace("#", "") * 1) ) {
            return true;
        } else {
            return false;
        }
    },
    init: function init() {
        if (control_panel.has_localstorage()) {
            if (!localStorage["pinned"]) {
                localStorage["pinned"] = "{}";
            }
        };
        control_panel.create_element();
        setInterval(control_panel.update_pinned, 1000);
        time_helper.init();
    }
},
time_helper = {
    timer_status: "off",
    change_status: function change_status(s) {
        if (s == "on" || s == "off") {
            time_helper.timer_status = s;
            time_helper.time_element.innerText = "Timer is " + s + "!!";
            time_helper.time_element.className = "workato_timer " + s;
        } else {
            throw "Timer helper error: change_status() method only accepts 'on' or 'off' strings. Does not accept '" + s + "'.";
        }
    },
    check_timer: function check_timer() {
        if (control_panel.on_ticket_page()) {
            var timesheet_container = document.querySelector("#timesheetlist"),
                timesheets_on = document.querySelectorAll("#timesheetlist .time_running").length;
            if (Boolean(timesheet_container) === false) {
                document.querySelector("#TimesheetTab h3").click();
            } else if (timesheets_on === 0) {
                time_helper.change_status("off");
            } else {
                time_helper.change_status("on");
            };
        } else {
            time_helper.change_status("off");
            time_helper.time_element.className = "workato_timer hidden";
        }
    },
    toggle_timer: function toggle_timer(evt) {
        if (time_helper.timer_status === "on") {
            document.querySelectorAll(".toggle_timer").forEach(function(el) {
                if (el.innerText.toLowerCase() === "stop timer") {
                    el.click();
                }
            });
        } else {
            document.querySelector("#triggerAddTime").click();
        };
    },
    create_element: function create_element() {
        time_helper.time_element = document.createElement("div");
        time_helper.time_element.className = "workato_timer hidden";
        time_helper.time_element.addEventListener("click", time_helper.toggle_timer);
        document.querySelector("div.control_panel").appendChild(time_helper.time_element);
    },
    init: function init() {
        time_helper.create_element();
        time_helper.check_timer();
        setInterval(time_helper.check_timer, 1000);
        window.onbeforeunload = function (e) {
            if (time_helper.timer_status == "on") {
                return "Timer's still on";
            }
        };
    }
};
control_panel.init();

// var present_options = {
//     create_element: function create_element() {
//         var options_container = document.createElement("div"),
//             link_one = document.createElement("a"),
//             link_two = document.createElement("a"),
//             left_content = document.querySelector("#tkt-inner .leftcontent");
//         options_container.style = "position: absolute; background: rgba(0, 0, 0, 0.5); left: -30px; top: -5px; right: 10px; bottom: 0px; z-index: 999;";
//         left_content.style.position = "relative";
//         left_content.appendChild(options_container);
//     }
// };
// 
// //present_options.create_element();
