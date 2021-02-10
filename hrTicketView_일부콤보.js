init : function() {
    this.setInitEvent();
    $("#editBtn").bind("click", function(){
				$("#cc_list_view").hide();
				$("#cc_list").show();
				techUtil.enableComboBox("search_ccEmail", true);//VOC-20200206-005,난수리 TICKET 내에 CC 인원 수정 요청
				$("#btn_ccEmail").show();//VOC-20200206-005,난수리 TICKET 내에 CC 인원 수정 요청
	});

setInitEvent : function() {
    $("#btn_ccEmail").bind("click", function(e){// VOC-20200206-005,난수리 TICKET 내에 CC 인원 수정 요청
				hrTicketView.ccEmailAdd();
	});
    this.makeComboBox();
}

makeComboBox : function(){
    //VOC-20200206-005,난수리 TICKET 내에 CC 인원 수정 요청
	this.callEmail();
}

ccEmailAdd : function() { 
    url : "/tech/hrts/hrTicketccEmailAddAjax.do",// 삽입하기
    hrTicketView.callEmail();// email 목록 가져오기
    hrTicketView.ccList(); // ccs 참조자 목록을 다시 호출한다.
}

callEmail : function (){
    url : "/tech/common/selectHrTicketSearchCcEmailListAjax.do",
    techUtil.makeCommonComboBox(args9);
}

controlComboBox : function(_target) {
    techUtil.enableComboBox("search_ccEmail", false); // 추가함.
	$("#btn_ccEmail").hide();// 추가함
}

makeParams : function(_form) {
			var _commonParams = {
				hdTicketNo : hrTicketCommon._PARAM.hdTicketNo,
				pgStatCd : $("#combo_pgStatCd").val(),
				ownerId: $("#combo_ownerId").val(),
				ccEmail: $("#search_ccEmail").val(), // VOC-20200206-005,난수리 TICKET 내에 CC 인원 수정 요청
				//ccvList : this.getCcListJson(),
				jsonParam : this.getCcListJson()
			};
}

==================================================
-- parameter 넘기기 hrTicektView.js 에서 자기한테 ownerid 설정하기 
var params = hrTicketView.makeParams("memoForm");

kendo.confirm($.gsisMsg("ts.01.01.006.1001")).done(function(){
				$.ajax({
					url : "/tech/hrts/hrTicketAssigedAjax.do",
					dataType : "json",
					type : 'POST',
					data : params,
					error : function() {
						kendo.alert('error...');
					},
					success : function(r) {						
						hrTicketCommon.refresh();						
						var tempPgStatCd1 = $("#combo_pgStatCd").val();
						if(tempPgStatCd1 == 'T' || tempPgStatCd1 == 'N' || tempPgStatCd1 == 'O') {
							$("#combo_pgStatCd").val("A");
						}
						kendo.alert($.gsisMsg("success.success"));
						hrTicketList.list();						
						//owner 수정후 팝업내에 입력되있는 owner 정보 session user정보로 수정
						$("#corpOwnerId").val($("#sessionCorpId").val());
						$("#ticket_view_save").show();
					}
				});
			});


	makeParams : function(_form) {
			var _commonParams = {
				hdTicketNo : hrTicketCommon._PARAM.hdTicketNo,
				pgStatCd : $("#combo_pgStatCd").val(),
				ownerId: $("#combo_ownerId").val(),
				ccEmail: $("#search_ccEmail").val(), // VOC-20200206-005,난수리 TICKET 내에 CC 인원 수정 요청
				//ccvList : this.getCcListJson(),
				jsonParam : this.getCcListJson()
			};
			var _params = $("#" + _form).serializeArray();

			for (var key in _commonParams) {
			    if (_commonParams.hasOwnProperty(key)) {
			    	if(_commonParams[key] != "" && _commonParams[key] != null){
			    		_params.push({name : key, value : _commonParams[key]});
			    	}
			    }
			}
			console.log(" params  :  " + _params);
			return _params;
		},


		/*
		 * 참조자 목록 Jason
		 */
		getCcListJson : function() {
			//참조자 데이터
			var _data = $("#cc_list").find("input[type=checkbox]:checked");
			var json = new Array() ;
			$.each(_data, function(i){
				var data = new Object() ;
				var _value = $(this).val();
				data.userId = _value;
				json.push(data);
			});
			return JSON.stringify(json);
		},

-- java 
@RequestMapping (value="hrTicketAssigedAjax.do")
	public String hrTicketAssigedAjax (ModelMap model, HttpServletRequest request,
			@ModelAttribute HardTicketMemoVO param,
			@ModelAttribute ("hardTicketVo") HardTicketVO hardTicketVo,
			@ModelAttribute ("hrtkMeVo") HardTicketMemoVO hrtkMeVo,
			@RequestParam ("jsonParam") String jsonParam
			) throws Exception{		

		//기존 난수리 정보 조회
		HashMap<String, Object> selectHardTicketMap = new HashMap<String, Object>();
		selectHardTicketMap.put("hdTicketNo", hardTicketVo.getHdTicketNo());
		selectHardTicketMap.put("lang", LocaleContextHolder.getLocale().toString());


		String json = StringEscapeUtils.unescapeHtml(jsonParam);
		ObjectMapper mapper = new ObjectMapper();
		List<HardTicketVO> userIdList = mapper.readValue(json, TypeFactory.defaultInstance().constructCollectionType(List.class, HardTicketVO.class));

		HardTicketVO hdvo = this.hrTicketService.selectHardTicket(selectHardTicketMap);

		if(hdvo.getPgStatCd().equals("T") || hdvo.getPgStatCd().equals("N")  || hdvo.getPgStatCd().equals("O") ){
			hardTicketVo.setPgStatCd(HardTicketConstants.PG_STAT_CD_A);
		}else{
			hardTicketVo.setPgStatCd(hdvo.getPgStatCd());
		}
		//hardTicketVo.setc
		LoginVO loginVo = TechUtil.getSession(request);
		loginVo.setLang(LocaleContextHolder.getLocale().toString());

		String reqnm = hdvo.getReqUserIdName();
		String msg = "";

		Date date = new Date();
		//Date클래스
		SimpleDateFormat format =  new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
		String dateFormat = format.format(date);

		if(hardTicketVo.getOwnerId()!=hdvo.getOwnerId()){
			HardTicketMemoVO hrtmemoVo = hrtkMeVo;
			hrtmemoVo.setAutoYn("N");
			hrtmemoVo.setAutoMsg("Y");
			hrtmemoVo.setContent("This ticket has been assigned to"+ "  "+ loginVo.getUserEnNm()+"("+loginVo.getCorpNm()+")"+"<br>"+ loginVo.getUserEnNm()+"("+loginVo.getCorpNm()+")"+" has assigned this ticket to "+ loginVo.getCorpNm()+ " / " + loginVo.getUserEnNm()+"("+loginVo.getCorpNm()+") "+ dateFormat);
			//hrtmemoVo.setContent("This ticket has been assigned to"+ "  "+ hdownervo.getUserenNm()+"("+hdownervo.getCorpOwnerengNm()+")"+"<br>"+ loginVo.getUserEnNm()+"("+loginVo.getCorpNm()+")"+" has assigned this ticket to "+ hdownervo.getCorpOwnerengNm()+ " / " + hdownervo.getUserenNm()+"("+hdownervo.getCorpOwnerengNm()+") "+ dateFormat);
			this.hrTicketService.insertHardTicketMemo(hrtmemoVo);

			//메일 전송
			//..........
		}

		hardTicketVo.setFileNo('0');
		hardTicketVo.setCorpOwnerId(loginVo.getCorpId());

		//HQ 사용자 owner 세팅시 L3 이관 값 저장
		if(loginVo.getCorpId() == 2){
			hardTicketVo.setL3TransferYn("Y");
		}

		//난수리 티켓 정보 저장
		this.savetHardTicket(hardTicketVo);
		return AJAX;
	}



=== 진행 상태코드 ??
 init : function (){
	 setInitDefault();
 }

 setInitDefault : function () {
	 :
	 :
	makeComboBox();
	this.memoList(hrTicketCommon._PARAM.hdTicketNo);
	this.setViewByPgStatCd($("#combo_pgStatCd").val());
	this.ccList();
 }

 makeComboBox : function(){
	//진행상태 코드
	var args = {
			target : "combo_pgStatCd",
			url : "/tech/common/selectComCodeListAjax.do",
			data : "commonCodeList",
			param : {codeGroupId : "T003", sortOrdr : _sortOrder},
			text : "codeNm",
			value : "codeId",
			callback : function(){
				techUtil.setEventComboBox("combo_pgStatCd", "change", function(e){
					var _value = this.value();
					hrTicketView.setViewByPgStatCd(_value);
				});
				var sessionUserId= $("#sessionUserId").val();				
				hrTicketView.controlComboBox("combo_pgStatCd");
			}
	};
	//진행상태 코드 콤보박스 만들기
	techUtil.makeCommonComboBox(args);
 }


 	/*
	 * KendoUI combo box event setting
	 */
	setEventComboBox : function(_target, _type, _event) {
		var combobox = $("#" + _target).data("kendoComboBox");
		combobox.bind(_type, _event);
	},


	/*
		 * 진행상태에 따른 난수리 티켓 상세화면 구성
		 */
		setViewByPgStatCd : function(_pgStatCd) {

		  $("#cc_list_view").show();
		  $("#cc_list").hide();
		  techUtil.enableComboBox("search_ccEmail", false);
		  $("#btn_ccEmail").hide();

			if(_pgStatCd == 'R' || _pgStatCd == 'C'){
				$("#report_tab").show();
				$("#memo_div").hide();
				$("#report_tab").trigger("click");
			} else {
				$("#report_tab").hide();
				$("#memo_div").show();
				$("#memo_tab").trigger("click");
			}

			if(_pgStatCd == 'I' || _pgStatCd == 'ICP') {
				$(".in_progress").show();
				//Symptom Code
				var args1 = {
						target : "symptomL",
						url : "/tech/common/symptomCodeAjax.do",
						data : "codeList",
						param : {prodGrpCd : $("#prodGrpCd").val()},
						text : "codeNm",
						value : "codeId",
						callback : function(){
						},
						appendComboData : {
							"codeNm" : techCommon.MSG.select,
							"codeId" : ""
						}
				};
				//Symptom Code 콤보박스 만들기
				techUtil.makeCommonComboBox(args1);
			} else {
				$(".in_progress").hide();
			}
		},


		/*
		 * 콤보박스 제어
		 */
		controlComboBox : function(_target) {
			$("#editBtn").hide();
			$("#cc_list").hide();
			$("#pickMe").hide();
			techUtil.enableComboBox("search_ccEmail", false); // 추가함.
			$("#btn_ccEmail").hide();// 추가함.
			techUtil.enableComboBox("combo_ownerId", false);
			techUtil.enableComboBox("combo_pgStatCd", false);			

			var _pgStatCd = $("#combo_pgStatCd").val();
			//직파트너는 무조건 안보이도록 처리
			if($("#htPartnerYn").val() == "Y"){
				$("#transBtn").hide();
				$("#combo_pgStatCd").parent().css("width","100%");
			}else{
                // HQ가 아니고
                // 법인일때  L3 이관 하지않고 N,O,A,I 단계일때 L3 이관 버튼 보임                
				if($("#tsAuth").val() == 'SC' &&
						$("#schl3TransferYn").val() != 'Y' && (_pgStatCd != 'T' /*||_pgStatCd != 'R' */||_pgStatCd != 'C')
				){
					$("#transBtn").show();
					$("#combo_pgStatCd").parent().css("width","75%");
				}else{
					$("#transBtn").hide();
					$("#combo_pgStatCd").parent().css("width","100%");
				}
			}

			var rctrtcd =$("#rctrtcd").val();						
			var combo_ownerId =  $("#combo_ownerId").val();
			var natureGbCd = $("#natureGbCd").val()
			if(combo_ownerId=="0"){
				//$("#combo_pgStatCd").text($.gsisMsg('ts.common.msg.28'));
				techUtil.selectComboBox("combo_ownerId", '');
			}

			// Temporary, Resolved, Closed 단계일때를 제외 하고 owner 선택가능 하도록 처리
			if(_pgStatCd != 'T' ||_pgStatCd != 'R' ||_pgStatCd != 'C'){
				//법인일때는 모두 보임
				if($("#tsAuth").val() == 'HQ'){

					if($("#combo_ownerId").val() == $("#sessionUserId").val()){
						techUtil.enableComboBox("combo_pgStatCd", true);
					}else{
						techUtil.enableComboBox("combo_ownerId", true);
						$("#pickMe").show();
					}
				}else if($("#tsAuth").val() == 'SC' && $("#schl3TransferYn").val() != 'Y'){		//corpOwnerId 법인이 아니면 L3 이관 되지 않았기때문에 owner 선택 가능

					if($("#combo_ownerId").val() == $("#sessionUserId").val()){
						techUtil.enableComboBox("combo_pgStatCd", true);
					}else{
						techUtil.enableComboBox("combo_ownerId", true);
						$("#pickMe").show();
					}
				}
            }
            
			//Resolved 단계일때를 제외 하고 CC저장 가능 하도록 처리 (Closed 단계는 페이지 따로 있음)
			if($("#sessionUserId").val() == combo_ownerId && _pgStatCd != 'R'){
				$("#editBtn").show();
				techUtil.enableComboBox("search_ccEmail", true); // 추가함.
				$("#btn_ccEmail").show();
			}

			//요청자, 등록자 일때는 close 상태 변경 가능 하도록 처리
			if(($("#sessionUserId").val() == $("#reqUserId").val() || $("#sessionUserId").val() == $("#HtRegUserId").val()) && _pgStatCd == 'R'){
				techUtil.enableComboBox("combo_pgStatCd", true);
			}
		},