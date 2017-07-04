// var exec = require("child_process").exec;

var querystring = require("querystring")
var fs = require("fs");
var formidable = require("formidable");

function start(response){
  console.log("Request handler 'start' was called");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    '<content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload" multiple="multiple" />'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();

    // exec("find /",
    //   { timeout: 10000, maxBuffer: 20000*1024 },
    //   function(error, stdout, stderr) {
    //     response.writeHead(200, {"Content-Type": "text/plain"});
    //     response.write(stdout);
    //     response.end();
    //   });
}

function upload(response, request) {
  console.log("Request handler 'upload' was called");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files)
  {
    console.log("parsing done");
    fs.rename(files.upload.path, "/tmp/test.gif", function(err) {
      if (err) {
        fs.unlink("/tmp/test.gif");
        fs.rename(files.upload.path, "/tmp/test.gif");
      }
    });

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<image src='/show' />");
    response.end();
  });
}

function show(response) {
  console.log("Requests handler 'show' was called.");
  fs.readFile("/tmp/test.gif", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/gif"});
      response.write(file, "binary");
      response.end();
    }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
