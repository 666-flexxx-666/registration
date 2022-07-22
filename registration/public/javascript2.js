//generovani gridu

var urlString = $(location).attr('href');
var numberChar = urlString.charAt(urlString.length - 1);
var numberJson = [{number: numberChar}];

rows = [];
function makeObjectGrid() {
    $.get('http://www2.spse.1984.cz/data/' + numberChar, {}, function (data) {
        rows = data
        let container = document.getElementById("grid-container");
        let rowelement;
        let element;

        for (var y = 0; y < rows.length; y++) {
            rowelement = document.createElement("div");
            rowelement.id = rows[y].id;
            rowelement.className = "row";
            container.appendChild(rowelement);
            currRow = document.getElementById(rows[y].id);
            for (var i = 0; i < rows[y].item.length; i++) {
                element = document.createElement("div");
                element.textContent = rows[y].item[i].number;
                element.id = rows[y].item[i].id;
                if (rows[y].item[i].reservated == false) {
                    element.className = "normal";
                }
                else if (rows[y].item[i].reservated == true) {
                    element.className = "reservated";
                };
                currRow.appendChild(element);
            };
        };
    });
};

//tlacitko
var selectedid = [];
function sendSelected() {
    console.log(rows);
    $.get('http://www2.spse.1984.cz/data/' + numberChar, {}, function (data) {
        for (i = 0; i < selectedid.length; i++) {
            for (y = 0; y < rows.length; y++) {
                for (z = 0; z < rows[y].item.length; z++) {
                    if (rows[y].item[z].id == selectedid[i]) {
                        rows[y].item[z].reservated = true;
                    }
                }
            }
        }
        $.ajax({
            type:"POST",
            dataType:"json",
            contentType: "application/json",
            data:JSON.stringify(numberJson),
            url:"/currentNumber",
        })
        .done(function(response){
              console.log("Response of update: ",response)
        })

        $.ajax({
            type:"POST",
            dataType:"json",
            contentType: "application/json",
            data:JSON.stringify(selectedid),
            url:"/bought",
        })
        .done(function(response){
              console.log("Response of update: ",response)
        })

        $.ajax({
            type:"POST",
            dataType:"json",
            contentType: "application/json",
            data:JSON.stringify(rows),
            url:"/add",
        })
        .done(function(response){
              console.log("Response of update: ",response)
        })
        .fail(function(xhr, textStatus, errorThrown){
              console.log("ERROR: ",xhr.responseText)
              return xhr.responseText;
        });

    });
}

//clickable items
window.onclick = e => {
    if (e.target.className == "normal") {
        e.target.className = "selected";
        selectedid.push(e.target.id);
        for (i = 0; i < rows.length; i++) {
            for (j = 0; j < rows[i].item.length; j++) {
                if (rows[i].item[j].id == e.target.id) {
                    rows[i].item[j].selected = true;
                }
            }
        }
    }
    else if (e.target.className == "selected") {
        e.target.className = "normal";
        var index = selectedid.indexOf(e.target.id);
        if (index !== -1) {
            selectedid.splice(index, 1)
        }
        for (i = 0; i < rows.length; i++) {
            for (j = 0; j < rows[i].item.length; j++) {
                if (rows[i].item[j].id == e.target.id) {
                    rows[i].item[j].selected = false;
                }
            }
        }
    }
};
