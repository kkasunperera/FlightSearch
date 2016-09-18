$(function () {

    $('form').on('submit', function (e) {
        document.getElementById("mySubmit").disabled = true;
        document.getElementById("tabbar").style.display= "none";
        document.getElementById("tableday1").style.display= "none";
        document.getElementById("tableday2").style.display= "none";
        document.getElementById("tableday3").style.display= "none";
        document.getElementById("tableday4").style.display= "none";
        document.getElementById("tableday5").style.display= "none";
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/search',
            data: $('form').serialize(),
            success: function (data) {
                if(data !== null){
                var count = 0;
                for (var k in data) {
                    count++;
                    // console.log('#day' + count)
                    // console.log("********************")
                    // console.log(k)
                    $('#tab' + count).html(k);
                    $('#day' + count).html(k);
                    fillTable('tableday' + count, data[k])

                }
                document.getElementById("tabbar").style.display= "block";
                document.getElementById("mySubmit").disabled = false;
                //alert('form was submitted');
            }
            else{
               document.getElementById("tabbar").style.display= "none";
               document.getElementById("mySubmit").disabled = false;
               alert("Please Enter a date grater than today!");
            }
        }
        });

    });


    function fillTable(tableName, data) {

        console.log("tableName " + tableName)
        console.log("data " + JSON.stringify(data))
        // var array = [{ name: "Test1", phoneNumb: 123, email: "abc" }, {name: "Test2", phoneNumb: 321, email: "cba"}];
        //var tabbar = document.getElementById("tabbar");
        //tabbar.style.display = (tabbar.style.display == "tabbar") ? "none" : "tabbar";
        var table = document.getElementById(tableName);
        table.style.display = (table.style.display == "table") ? "none" : "table";
        for (var i = 0; i < data.length; i++) {
            var row = table.insertRow();
            var Id = row.insertCell(0);
            var Airline = row.insertCell(1);
            var Start = row.insertCell(2);
            var Finish = row.insertCell(3);
            var Duration = row.insertCell(4);
            var Price = row.insertCell(5);

            Id.innerHTML = i + 1;
            Airline.innerHTML = data[i].airline.name;
            Start.innerHTML = data[i].start.dateTime;
            Finish.innerHTML = data[i].finish.dateTime;
            Duration.innerHTML = data[i].durationMin;
            Price.innerHTML = data[i].price;
        }
    }

});
