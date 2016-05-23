var fs = require("fs");
var http = require('http');

var filename = "/data/cont-stats.json";

http.createServer(function(request,response){

    var data = fs.readFileSync(filename);
    var jsondata = JSON.parse(data);
    var tableData = "";

    var totCpuUsage = 0;
    var totMemUsage = 0;
    var totNetUsage = 0;
    var totdskUsage = 0;

    for(var i=0;i<jsondata.length;i++) {
        var cpuUsage = parseInt(jsondata[i].precpu_stats.cpu_usage.total_usage);
        var memUsage = parseInt(jsondata[i].memory_stats.usage);
        var netUsage = parseInt(jsondata[i].networks.eth0.rx_bytes) +
                       parseInt(jsondata[i].networks.eth0.tx_bytes);
        var dskUsage = parseInt(jsondata[i].blkio_stats.io_service_bytes_recursive[4] == undefined ? 0 :
                             jsondata[i].blkio_stats.io_service_bytes_recursive[4].value);

        tableData += ("<tr>" +
                       "<td> " + jsondata[i].Name + "</td>" +
                       "<td style='text-align: right;padding-left:25px; padding-right:25px;'>" + cpuUsage + "</td>" +
                       "<td style='text-align: right;padding-left:25px; padding-right:25px;'>" + memUsage + "</td>" +
                       "<td style='text-align: right;padding-left:25px; padding-right:25px;'>" + netUsage + "</td>" +
                       "<td style='text-align: right;padding-left:25px; padding-right:25px;'>" + dskUsage + "</td>" +
                     "</tr>");


        totCpuUsage += cpuUsage;
        totMemUsage += memUsage;
        totNetUsage += netUsage;
        totdskUsage += dskUsage;

    }

    var tableHeader = ("<tr style='background-color: #c0c0c0;'>" +
                            "<th style='text-align: center;'></th>" +
                            "<th style='text-align: center;'> CPU</br>"+ totCpuUsage +"</th>"+
                            "<th style='text-align: center;'> Memory</br>"+ totMemUsage +"</th>"+
                            "<th style='text-align: center;'> NET I/O</br>"+ totNetUsage +"</th>"+
                            "<th style='text-align: center;'> BLOCK I/O</br>"+ totdskUsage +"</th>"+
                        "</tr>" );

    response.writeHead(200,{'Content-Type':'text/html'});

    response.write("<html> \
                      <head> \
                        <meta http-equiv='refresh' content='5'>  \
                        <title>Swarm Monitor</title> \
                        <style>tr:nth-child(odd) {background: #ffffff;} tr:nth-child(even) { background: #c0c0c0;}</style> \
                      </head> \
                      <body>");
    response.write("<table align='center' style='float:center; padding:25px 25px 25px 25px;'>"); 
    response.write("<thead><bold>");
    response.write(tableHeader);
    response.write("</bold></thead>");
    response.write("<tbody>");
    response.write(tableData);
    response.write("</tbody>");
    response.write("</table>");
    response.write("</body></html>");
    response.end();
}).listen(5000);

console.log("Server listening to port : 5000");

