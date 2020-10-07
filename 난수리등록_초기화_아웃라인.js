/**
 * 기술지원 난수리 티켓 등록/수정 자바스크립트
*/

//제어용 변수
var CURRENT_SRL_NO = null;

var hrTicketForm = {
		/*
		 * 컨텐츠 default 내용
		 */
		_contents : {
            E : '<pre>□ Call Registration Information<br><br>' 
            P : '□ Text version of PDR report<br><br>' +		
            D : '□ Text version of DDR report<br><br>' +		
            S : '○ the considerations which are influential in the location of the system<br>' +		
		},

		init : function(){
			hrTicketForm.setInitDefault();
			hrTicketForm.setInitEvent();
		},

		/*
		 * 초기 화면 설정
		 */
		setInitDefault : function() {
			this.makeComboBox();
			this.makeEditor();
			this.setProcessRequestInfo($("#combo_reqTypeCd").val());
			//첨부파일
			this.makeUploadView();		
			//raonupload 이벤트 호출
			raonUploadSetting("uploadHolder1","kupload1");
		},
		formevent : function() {$("#sn_search_btn").trigger("click"); },

		/*
		 * 초기 이벤트 설정
		 */
		setInitEvent : function() {
			//병원 검색 팝업
			$("#hospital_search_btn").bind("click", function() {});

			$("#searchInstallProdButton").bind("click", function(e){
				common.searchInstallProdView.window()
			});

			//병원위치정보 지도 팝업
			$("#map_btn").bind("click", function(e){			});


			//S/N 검색 버튼
			$("#sn_search_btn").bind("click", function(e){	});

			//관련정보 버튼
			$("#relate_info_btn").bind("click", function(e){});

			//활성화 체크박스
			$("#check_ownerId").bind("click", function(e){			
			});

			//난수리 티켓 임시 저장 버튼
			$("#temp_ticket_save").bind("click", function(e){				
			});

			//난수리 티켓 저장 버튼
			$("#ticket_save").bind("click", function(e){				
			});

			//취소 버튼
			$("#ticket_cancel").bind("click", function(e){				
			});

			//임시 저장된 테켓 삭제 버튼
			$("#ticket_delete").bind("click", function(e){				
			});
			// 제품군 change 이벤트
			/*$("#combo_prodGrpCd").change(function(){
			});*/
		},

		/*
		 * 난수리티켓 Form 팝업창 닫기
		 */
		closeWindow : function() {
			techUtil.closeWindow("dialog_ticket_form");
		},

		/*
		 * 콤보박스 만들기
		 */
		makeComboBox : function(){
		
			//요청타입
			techUtil.makeSingleComboBox("combo_reqTypeCd", techCommon.CODE_URL.reqTypeCd, "Y", {codeNm : techCommon.MSG.select, codeId : ""}, function(e){		
			});

			//장애유형
			techUtil.makeSingleComboBox("combo_errTypeCd", techCommon.CODE_URL.errTypeCd, "Y", {codeNm : techCommon.MSG.select, codeId : ""}, function(e){				
			});

			//The reason for site plan
			techUtil.makeSingleComboBox("combo_sitePlanResnCd", techCommon.CODE_URL.sitePlanResnCd);

			//제품군, 제품, 모델 cascade combo
			techUtil.makeProductCascadeComboBox("combo_prodGrpCd", "combo_prodCd", "combo_mdlCd", function(){			});

			//요청자

			var _reqUserCorpId = $("#reqUserCorpId").val();

			var argsR = {					
			};
			techUtil.makeCommonComboBox(argsR);
		},

		/*
		 * 에디터 만들기
		 */
		makeEditor : function() {			
		},

		/*
		 * 요청 타입에 따른 처리요청정보 화면 제어
		 */
		setProcessRequestInfo : function(_reqTypeCd) {			
		},

		/*
		 * SN 정보 가져오기
		 */
		getSnInfo : function(_hospitalId) {			
		},

		/*
		 * SN 콤보박스 만들기
		 */
		makeSnComboBox : function(_data) {			
		},

		/*
		 * 제품군, 제품, 모델 콤보박스 값 세팅
		 */
		setCascadeValue : function(_item) {			
		},

		/* 설치 제품 S/N의 연계정보 */
		setSnSideInfo : function(_item) {			
		},

		/*
		 * SN 콤보박스 초기화
		 */
		initSnComboBox : function() {},

		saveTicket : function(){
			//난수리 티켓을 신청하시겠습니까?			
		},

		/*
		 * 난수리 티켓 임시 저장
		 */
		saveTempTicket : function(){
			//난수리 티켓을 임시저장 하시겠습니까?			
		},
		/*첨부파일 등록/수정 시 구분하면 화면을 만든다.*/
		makeUploadView : function(){		},
		/*
		 * 임시 난수리 티켓 삭제
		 */
		deleteTempTicket : function(){
			//삭제 하시겠습니까?
			
		}
}



//Callback
window.hrTicketFormCallback = {
		/*
		 * SN 정보 callback
		 */
		getSnInfo : function(data){
			var snInfoList = data.snInfoList;
			if(snInfoList.length > 0) {
				hrTicketForm.makeSnComboBox(snInfoList);
			} else {
				hrTicketForm.initSnComboBox();
			}
		}
}