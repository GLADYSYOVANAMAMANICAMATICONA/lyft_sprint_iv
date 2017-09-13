//    var numero = 0;
 
//    function cambiar() 
//    {
//       if(numero==0){
//          document.body.style.backgroundImage=url("../img/fondo.jpg");
//          numero = 1;
//       }else if(numero==1){
//          document.body.style.backgroundImage=url("../img/fondo1.jpg");
//          numero = 2;
//       }else if(numero==2){
//          document.body.style.backgroundImage=url("../img/logo.png");
//          numero = 0;
//       }
//    }
 
//    setInterval("cambiar()",2000);




   ////////////////////////////////////
   
   var index = 0;
   
       var listaimg = ["https://fondosdepantallaparacelulares.net/wp-content/uploads/2016/10/fondos-de-pantalla-de-carros-audi.jpg", 
       "https://i.ytimg.com/vi/CXpVcb8Y11U/maxresdefault.jpg",
        "https://k60.kn3.net/taringa/D/2/E/4/1/D/1091009109100109/C8B.jpg",
         "http://www.infidelidad.com.mx/images/472618514.jpg"];
   
   $(function() {
     
       setInterval(changeImage, 2000);
     
   });
   
   function changeImage() {
     
    
      $('body').css("background-image", 'url(' + listaimg[index] + ')');
                     
      index++;
                     
      if(index == 4)
         index = 0;
       
       
   }
   