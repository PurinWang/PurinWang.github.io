function setStatus(data){
  status = "";
  status_button = "";
  achieve = 0;
  for(var i=0;i<data.length;i++){
    if(i<3){
      switch (data[i]["status"]) {
        case 0:
          status = "src/未登入.png";
          break;
        case 1:
          status = "src/已登入.png";
          break;
        default:
          status = "src/未綁定.png";
        }
      $("#"+data[i]["condition_name"]).attr('src',status);
    }
    else if(i<6){
      switch (data[i]["status"]) {
        case 0:
          status = "hidden";
          break;
        case 1:
          status = "visible";
          break;
        default:
          status = "hidden";
        }
      $("#"+data[i]["condition_name"]).css('visibility',status);
    }
    else{
      if(i==9||i==13){
        if(achieve == 3){
          status = "src/玩家已達成活動條件。.png";
          // switch (data[i]["status"]) {
          //   case 0:
              status_button = "src/領取獎勵.png";
            //   break;
            // case 1:
              // status_button = "src/領取獎勵(灰).png";
            //   break;
            // default:
              // status_button = "src/領取獎勵(灰).png";
          // }
        }
        else{
          status = "src/玩家尚未達成活動條件。.png";
          status_button = "src/領取獎勵(灰).png";
        }

        $("#"+data[i]["condition_name"]+"_field").attr('src',status);
        $("#"+data[i]["condition_name"]+"_image").css('src',status_button);
        $("#"+data[i]["condition_name"]).attr('status',data[i]["status"]);
        achieve = 0;
      }
      else{
        $("#"+data[i]["condition_name"]).text(data[i]["status"]);
        if(i<9){
          if(data[i]["status"] >= 25){
            achieve++;
          }
        }
        else{
          if(data[i]["status"] >= 5){
            achieve++;
          }
        }
      }
    }
  }
}

function bindStatus(url,aryPara){
  var apiurl = url + "/api/v1/events/2?line_id=" + aryPara['line_id'];
  // var apiurl = myURL + 'api/v1/events/2?line_id=' + aryPara['line_id'];
  console.log(apiurl);
  $.ajax({
    type: "GET",
    url: apiurl,
    contentType: "application/json",
    success : function(res) {
      setStatus(res['data']);
    }
  });
}

function setReward(url,aryPara,field){
  var apiurl = url + "/api/v1/events/2";
	var dataAry = {
				"line_id": aryPara['line_id'],
				"condition_name": field,
				"status": "1"
			};
  // var dataAry = {
  //       "line_id": "U6af3abaf703cf160d366cf9995cee50a",
  //       "condition_name": "consume_ticket_reward",
  //       "status": "1"
  //     };

	$.ajax({
		type: "PUT",
		url: apiurl,
		contentType: "application/json",
		data: JSON.stringify(dataAry),
		success: function(res){

		}
	});
}

$(function(){
  var strUrl = location.href;
  var aryPara = [];

  if (strUrl.indexOf("?") != -1) {
		var getSearch = strUrl.split("?");
		getPara = getSearch[1].split("&");
		for (i = 0; i < getPara.length; i++) {
			ParaVal = getPara[i].split("=");
			aryPara[ParaVal[0]] = ParaVal[1];
		}
	}
  else{
    return;
  }

	// 以env判斷叫哪個api環境
	var env = aryPara['env'];

	console.log(env);
	if(env == 'development'){
		myURL = 'https://linebot-dev.isweetygirl.com';
	}else if(env == 'production'){
		myURL = 'https://linebot.isweetygirl.com';
	}

  bindStatus(myURL,aryPara);

	//如果沒有綁定的話
	//to do....
  $(".event_button").click(function() {
    // if(!parseInt($(this).attr("status"))){
      setReward(myURL,aryPara,this.id);
    // }
      console.log("click");
  });
});
