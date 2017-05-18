(function() {

    const sheetId = "1yNF9Yi80ACtk_SIunr0nIY9LiKRmrz9YTGVrWpCqlJk",
        hrefHeader = "url",
        textHeader = "label";

    const addLink = (href, text) => {
        let ul = document.querySelector("#listContainer"),
            li = document.createElement("li"),
            a = document.createElement("a");
        a.href = href;
        a.target = "_blank";
        a.innerText = text;
        // Add to document
        li.appendChild(a);
        ul.appendChild(li);
    };

    fetch("https://spreadsheets.google.com/feeds/list/"+sheetId+"/od6/public/values?alt=json").then(function(response) {
        return response.json();
    }).then(function(json){
        json.feed.entry.forEach(function(row) {
            addLink(
                row["gsx$"+hrefHeader]["$t"],
                row["gsx$"+textHeader]["$t"]
            );
        });
    });
})();
