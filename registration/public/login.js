let click = 0;
function showPass() {
    if(click % 2 == 0){
      document.getElementById("icon").src = "public/img/eye_opened.svg";
    } else{
      document.getElementById("icon").src = "public/img/eye_closed.svg";
    }
    let x = document.getElementById("pass");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    click++;
  }
