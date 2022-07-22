let click1 = 0;
let click2 = 0;
function showPass1() {
  if(click1 % 2 == 0){
    document.getElementById("icon1").src = "public/img/eye_opened.svg";
  } else{
    document.getElementById("icon1").src = "public/img/eye_closed.svg";
  }
  let x = document.getElementById("pass");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
  click1++;
}

function showPass2() {
  if(click2 % 2 == 0){
    document.getElementById("icon2").src = "public/img/eye_opened.svg";
  } else{
    document.getElementById("icon2").src = "public/img/eye_closed.svg";
  }
  let x = document.getElementById("pass2");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
  click2++;
}

  function checkPass(){
    let x = document.getElementById("pass").value;
    let y = document.getElementById("pass2").value;
    if(x != y){
      window.location.replace("http://www2.spse.1984.cz/register?error=1");
        return false;
    }else{
        return true;
    }
  }
