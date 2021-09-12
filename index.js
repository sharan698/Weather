const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceval = (tempval, orgval) => {
    let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
        temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
        temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
        temperature = temperature.replace("{%location%}", orgval.name);
        temperature = temperature.replace("{%country%}", orgval.sys.country);
        temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
        return temperature;
};
const server = http.createServer((req, res) =>{
        if(req.url == "/") {
            requests("https://api.openweathermap.org/data/2.5/weather?q=RAICHUR,KA,IN&units=metric&appid=3bc85c67290250df24d24390859ba50d")
            .on("data", (chunck) => {
                    const objdata = JSON.parse(chunck);
                    const arrData = [objdata];
               const realTimeData = arrData.map((val) => replaceval(homeFile, val)).join("");  
                      res.write(realTimeData);    
            })
            .on("end",(err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            });
        } else {
            res.end("File not found");
        }
});

server.listen(9000,"127.0.0.1");