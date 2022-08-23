async function getDashboardData(url = "/data.json") {
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

class DashboardItem {
    static PERIODS = {
        daily: "day",
        weekly: "week",
        monthly: "month"
    }
    constructor(data, container = ".content", view = "weekly") {
        this.data = data;
        this.container = document.querySelector(container);
        this.view = view;
        
        this._createMarkup();
    }

    _createMarkup() {
        const {title, timeframes} = this.data;

        const id = title.toLowerCase().replace(/ /g, "-");
        const {current, previous} = timeframes[this.view.toLowerCase()];
    
        this.container.insertAdjacentHTML("beforeend", `
        <div class="timer timer--${id}">

        <article class="tracker">

          <header class="t_header">
            <h4 class="t_title">${title}</h4>
            <img class="t_menu" src="images/icon-ellipsis.svg" alt="menu">
          </header>

          <div class="t_body">
            <div class="t_time">
              ${current}hrs
            </div>
            <div class="t_prev">
              Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs
            </div>
          </div>

        </article>

      </div>`);

      this.time = this.container.querySelector(`.timer--${id} .t_time`)
      this.prev = this.container.querySelector(`.timer--${id} .t_prev`)
    }

    changeView(view) {
        this.view = view.toLowerCase();
        const {current, previous} = this.data.timeframes[this.view.toLowerCase()];

        this.time.innerText = `${current}hrs`;
        this.prev.innerText = `Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getDashboardData()
        .then(data => {
            const activities = data.map(activity => new DashboardItem(activity));
        
            const selectors = document.querySelectorAll(".item");
            selectors.forEach(selector => 
                selector.addEventListener("click", function() {
                    selectors.forEach(sel => sel.classList.remove("item--active"))
                    selector.classList.add("item--active")
                    
                    const currentView = selector.innerText.trim().toLowerCase();
                    activities.forEach(activity => activity.changeView(currentView));
                }))
        
        })
})