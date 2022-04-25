//javascript로 구현한 Request
function Request(valuename){
    var rtnval;
    var nowAddress = unescape(location.href);
    var parameters = new Array();
    parameters = (nowAddress.slice(nowAddress.indexOf("?")+1,nowAddress.length)).split("&");
    for(var i = 0 ; i < parameters.length ; i++){
        if(parameters[i].indexOf(valuename) != -1){
            rtnval = parameters[i].split("=")[1];
            if(rtnval == undefined || rtnval == null){
                rtnval = "";
            }
            return rtnval;
        }
    }
}


//이미지 새로 불러오기
function RefreshImage(valImageId) {
	var objImage = document.getElementById(valImageId)
	if (objImage == undefined) {
		return;
	}
	var now = new Date();
	objImage.src = objImage.src.split('?')[0] + '?x=' + now.toUTCString();
}

var oldText = "";
// 콤마 없애기 
function RemoveComma(num) { 
	while(num.indexOf(",") > -1) { 
	num = num.replace(",", ""); 
	} 
	return num; 
} 

//==========================================================================
//금액 콤마 처리
//==========================================================================
function SetComma(num){
	var rightchar = RemoveComma(num.value);
	//alert(rightchar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	num.value = rightchar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}

//==========================================================================
// Input박스 체크 확인
// 사용법 : if (ChkInput(필드명, 메세지) == false) return or return false;
//==========================================================================
function ChkInput(Object,Name) {
	if (typeof(Object)!="undefined") {
		if(Object.value=="" || !Object.value.replace(/\s/g, "")) {
			alert(Name);
			eval(Object.focus());
			return false;
		}
	}
}

//==========================================================================
// Select박스 체크 확인
// 사용법 : if (ChkSelect(필드명, 메세지) == false) return or return false;
//==========================================================================
function ChkSelect(Object,Name) {
	if(!Object.options[Object.selectedIndex].value) {
		alert(Name);
		eval(Object.focus());
		return false;
	}
}

//==========================================================================
// Radio박스 체크 확인
// 사용법 : if (ChkRadio(필드명, 메세지) == false) return or return false;
//==========================================================================
function ChkRadio(Object,Name) {
	var chk_i = 0;

	for( var i = 0; i < Object.length; i++ ) {
		if(Object[i].checked == true) {
			chk_i++;
			break;
		}
	}
	if (chk_i <= 0) {
		alert(Name);
		eval(Object[0].focus());
		return false;
	}
}

//==========================================================================
// Check박스 체크 확인
// 사용법 : if (ChkCheckBox(필드명, 메세지) == false) return or return false;
//==========================================================================
function ChkCheckBox(Object,Name) {
	var chk_i = 0;

	for( var i = 0; i < Object.length; i++ ) {
		if(Object[i].checked == true) {
			chk_i++;
			break;
		}
	}
	if (chk_i <= 0) {
		alert(Name);
		eval(Object[0].focus());
		return false;
	}
}

//==========================================================================
// Input박스 필터링 체크
// 사용법 : onKeyPress="filterKey('[0-9a-zA-Z]');"
//==========================================================================
function filterKey(filter) {
	if(filter){
		var sKey = String.fromCharCode(event.keyCode);
		var re = new RegExp(filter);
		if(!re.test(sKey)) event.returnValue=false;
	}
}

//==========================================================================
// 이미지 확장자 체크 확인
// 사용법 : onChange="ChkImagefile(this.value);"
// 파일 업로드 필드가 <div id="fileDiv"></div>로 감싸져있어야하며 fileValueReset()과 세트로 구성됨
//==========================================================================
function ChkImagefile(Object) {
	var fileType = /\.(bmp|gif|jpg|jpeg|png)$/i
	if (!Object.match(fileType)) {
		alert("gif,jpg,png,bmp 파일만 업로드 하세요");
		fileValueReset();
		return false;
	}
}

function fileValueReset() {
	var fileDiv = document.getElementById("fileDiv");
	html = "&nbsp;<input name=\"upfile\" type=\"file\" class=\"input\" style=\"width:500px;\" onChange=\"ChkImagefile(this.value);\" />";
	html = html + "<br />&nbsp;※ 이미지 파일만 등록하세요";
	fileDiv.innerHTML = html;
}

//==========================================================================
// Input박스 이메일체크 확인
// 사용법 : 
//
//	if (Check_Email_Rule(obj.email1.value +"@"+ obj.email2.value) == false) {
//		alert("메일주소를 정확히 입력하세요");
//		obj.email1.focus();
//		return;
//	}
//
//==========================================================================
/* Email Validation */
function Check_Email_Rule(strEmail) {
	return strEmail.search(/^\s*[\w\~\-\.]+\@[\w\~\-]+(\.[\w\~\-]+)+\s*$/g)>=0;
}


//==========================================================================
// 이미지 리사이즈
// 사용법 : onLoad="resizeImg(this,500);" 
//==========================================================================
function resizeImg(imgObj,size) {
	if(imgObj.width > size) {
		imgObj.width = size;
	}
}


//합계 금액 업데이트
function ItmTotalUpd(obj){
	if ($("input[name=p_amount]").length>0){
		var p_qty = obj.val();
		var opt_idx = $("input[name=p_qty]").index(obj);
		var p_amount = document.getElementsByName("p_amount")[opt_idx].value;

		var p_total = p_qty*p_amount;
		p_total = p_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		document.getElementsByName("td_price")[opt_idx].innerHTML = p_total + "원";
	}
}

$(document).ready(function(){

	//==========================================================================
	// 숫자 전용 필드
	//==========================================================================
	$(document).on("blur keyup", 'input:text[numberOnly]', function(e) {
		e.stopImmediatePropagation();
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});

	//==========================================================================
	//수량 증가 감소
	//==========================================================================
	$(document).on("click", '.quantity_box .minus', function(e) {
		e.stopImmediatePropagation();
		var con = $(this).siblings('input').val();
		if(con == '1'){
			alert('최소수량은 1개 이상입니다.');
		}else{
			con--;
			$(this).siblings('input').val(con);
			ItmTotalUpd($(this).siblings('input'));
			TotalAmount();
		}
	});

	$(document).on("click", '.quantity_box .plus', function(e) {
		e.stopImmediatePropagation();
		var con = $(this).siblings('input').val();
		con++;
		$(this).siblings('input').val(con);
		ItmTotalUpd($(this).siblings('input'));
		TotalAmount();
	});
});




