const api = {
  STATE: null,
  INTERVAL: 1000,
  TIMER_STATUS: "off",
  hasLocalStorage() {
    try {
      localStorage["hello"] = "world";
      localStorage.removeItem("hello");
      return true;
    }
    catch(e) {
      return false;
    }
  },
  thisPage() {
    if(document.title.length > 40) {
      return {
        url: document.URL.split("#")[0],
        text: document.title.slice(0, 35) + "..."
      }
    }
    else {
      return {
        url: document.URL.split("#")[0],
        text: document.title
      }
    }
  },
  isTicketPage() {
    const ticketPath = "https://support.workato.com/helpdesk/tickets/";
    return document.URL.slice(0, 45) === ticketPath
      && document.URL.length > 45
      && !isNaN(Number(document.URL.slice(45).split("#")[0]));
  },
  addPin() {
    const currentPage = api.thisPage();
    const stored = JSON.parse(localStorage["pinned"]);
    stored[currentPage.url] = currentPage.text;
    localStorage["pinned"] = JSON.stringify(stored);
  },
  removePin(url) {
    const stored = JSON.parse(localStorage["pinned"]);
    delete stored[url];
    localStorage["pinned"] = JSON.stringify(stored);
  },
  changeStatus(s) {
    api.TIMER_STATUS = s;
  },
  pollTimer() {
    const timeSheetsElement = document.querySelector("#timesheetlist");
    const timeSheetsRunning = document.querySelectorAll("#timesheetlist .time_running").length;
    if(!timeSheetsElement) {
      const timeSheetsToggle = document.querySelector("#TimesheetTab h3");
      timeSheetsToggle ? timeSheetsToggle.click() : "";
    }
    else if(timeSheetsRunning === 0) {
      api.changeStatus("off");
    }
    else {
      api.changeStatus("on");
    }
  },
  toggleTimer() {
    if(api.TIMER_STATUS === "on") {
      document.querySelectorAll(".toggle_timer").forEach((el) => {
        if(el.innerText.toLowerCase() === "stop timer") {
          el.click();
        }
      });
    }
    else {
      document.querySelector("#triggerAddTime").click();
    }
  },
  refresh(callback) {
    const appProps = {
      pinned: [],
      timerStatus: null,
      thisPage: null
    };
    if(api.hasLocalStorage()) {
      if(!localStorage["pinned"]) {
        localStorage["pinned"] = "{}";
      }
      appProps.pinned = JSON.parse(localStorage["pinned"]);
    };
    if(api.isTicketPage()) {
      api.pollTimer();
      appProps.timerStatus = api.TIMER_STATUS;
      if(!(api.thisPage().url in appProps.pinned)) {
        appProps.thisPage = api.thisPage();
      }
    }
    if(api.STATE === null
       || JSON.stringify(api.STATE) !== JSON.stringify(appProps)) {
      api.STATE = appProps;
      callback(appProps);
    }
  },
  run(callback) {
    setInterval(()=>{ api.refresh(callback) }, api.INTERVAL);
    window.addEventListener("beforeunload", () => {
      if(api.TIMER_STATUS === "on") {
        return "Timer is still on";
      }
    });
  }
};
export default api;
