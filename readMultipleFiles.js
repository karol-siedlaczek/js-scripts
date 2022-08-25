function readMultipleFiles(files) {
    var reader = new FileReader();
    var filesList = []

    function readFile(index) {
      if (index >= files.length) return;
      var file = files[index];
      reader.onload = function(e) {
        filesList.push({
          "name": files[index].name,
          "content": e.target.result
        }) //binary content
        readFile(index + 1)
      }
      reader.readAsBinaryString(file)
    }
    readFile(0)
    return filesList
  }
