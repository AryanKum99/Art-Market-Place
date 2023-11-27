function upload(){
    var field = document.getElementById("finput");
    var canvas = document.getElementById("space");
    
    var image = new SimpleImage(field);
    
    image.drawTo(canvas);
    
    
  }