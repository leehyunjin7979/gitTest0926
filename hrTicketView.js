/**
 * 기술지원 난수리 티켓 목록 자바스크립트
*/
var hrTicketView = {
		GV : {
			selFileNo			: null,	// 선택한 파일 번호
			gvmemoList			: null,
			cntSeq			    : 0,
		},

		/*
		 * 난수리티켓 상세 초기화
		 */
		init : function() {
			/////////////////////////////////////////////////////////////////////////////////////////
			//raon file upload 팝업
			$("#fileUploadPopup").kendoWindow({
				title : "Upload Popup",
				animation : false,
				width : 600,
				height : 300,
				modal : false,
				scrollable : true,
				resizable : false
			});

			//임시 Ship to 관리 팝업 이벤트
			$("#raonUploadBtn").off('click').on('click', function() {

				$("#fileUploadPopup").data("kendoWindow").center().open();
			});



			//raonupload 이벤트 호출
			raonUploadSetting("uploadHolder2","kupload2");

			raonUploadSetting("memoFileDownloadHolder","kdownload");


			/////////////////////////////////////////////////////////////////////////////////////////////////////////

			var dMap2= hrTicketView.getmapList("hrTicketfileViewAction.do",{hdTicketNo: hrTicketCommon._PARAM.hdTicketNo});

			 //기술자료 첨부파일 view
            if(dMap2.originFileNm != undefined){	//등록된 첨부파일이 있을 경우
            	$("#attachTd").empty();

            	var len = 1;
            	var splitSeq;
            	var splitOriginFileNm;

            	$("#attachTd").empty();

            	if(dMap2.saveFileNm.indexOf(",") > -1){
            		len = dMap2.saveFileNm.split(",").length;
            		splitSeq = dMap2.seq.split(",");
            		splitOriginFileNm = dMap2.originFileNm.split(",");

            		for(var i=0; i<len; i++){
	            		$("#attachTd").append("<a/>");
	            		$("#attachTd a:eq("+i+")").attr({href:"javascript:;",class:"link", onclick:"techUtil.fileDownload(\""+dMap2.fileNo+"\",\""+splitSeq[i]+"\")"});
	            		if(i == 0){
	            			$("#attachTd a:eq("+i+")").text(splitOriginFileNm[i]);
	            			$("#attachTd").append("<br>");
	            		}else{
	            			$("#attachTd a:eq("+i+")").text("  "+splitOriginFileNm[i]);
	            			$("#attachTd").append("<br>");
	            		}
	            	}
            	}else{

            		$("#attachTd").append("<a/>");
            		$("#attachTd a:eq(0)").attr({href:"javascript:;",class:"link", onclick:"techUtil.fileDownload(\""+dMap2.fileNo+"\",\""+dMap2.seq+"\")"});
            		$("#attachTd a:eq(0)").text(dMap2.originFileNm);
            		$("#attachTd").append("<br>");
            	}

            }
            //클라우드 서버로 올라간 파일 다운로드 로직
            if(dMap2.originFileNm2 != undefined){	//등록된 첨부파일이 있을 경우
            	//헤더에 인증 정보 추가
                //RAONKUPLOAD.AddHttpHeader("Authorization", "Basic Z3Npcy5zbUBzYW1zdW5nbWVkaXNvbi5jb206TWVkaXNvbjEh", "kdownload");

            	var len = 1;
            	var splitSeq;
            	var splitOriginFileNm;
            	if(dMap2.saveFileNm2.indexOf(",") > -1){
            		len = dMap2.saveFileNm2.split(",").length;
            		splitOriginFileNm = dMap2.originFileNm2.split(",");
            		var uuid = dMap2.saveFileNm2.split(",");

            		for(var i=0; i<len; i++){
            			/*alert(dMap2.fileNo+"_"+i);
            			RAONKUPLOAD.AddUploadedFile('1', 'test444.zip', 'https://mhme-a430673.documents.us2.oraclecloud.com/documents/api/1.2/files/D98D3FF725A9CAEF2B50D15374174AF41EEE86FCFE55/data/', '14448388', '', "kdownload");*/
	            		$("#attachTd").append("<a/>");
	            		//$("#attachTd a:eq("+i+")").attr({href:"javascript:;",class:"link", onclick:"techUtil.fileDownload(\""+dMap2.fileNo+"\",\""+i+"\")"});
	            		$("#attachTd a:eq("+i+")").attr({id:dMap2.fileNo+"_"+uuid[i],href:"javascript:;",class:"link", onclick:"hrTicketView.raonDownload('"+dMap2.fileNo+"_"+uuid[i] +"','kdownload')"});

	            		if(i == 0){
	            			$("#attachTd a:eq("+i+")").text(splitOriginFileNm[i]);
	            			$("#attachTd").append("<span class='k-icon k-i-close' onclick='hrTicketView.fileDeleteFunc('"+dMap2.fileNo+"','"+uuid[i]+"','"+dMap2.fileNo+"_"+uuid[i] +"',this);'></span><br>");
	            		}else{
	            			$("#attachTd a:eq("+i+")").text("  "+splitOriginFileNm[i]);
	            			$("#attachTd").append("<span class='k-icon k-i-close' onclick='hrTicketView.fileDeleteFunc('"+dMap2.fileNo+"','"+uuid[i] +"','"+dMap2.fileNo+"_"+uuid[i] +"',this);'></span><br>");
	            		}
	            	}
            	}else{
            		/*alert(dMap2.fileNo+"_0@@");
            		RAONKUPLOAD.AddUploadedFile('1', 'test444.zip', 'https://mhme-a430673.documents.us2.oraclecloud.com/documents/api/1.2/files/D98D3FF725A9CAEF2B50D15374174AF41EEE86FCFE55/data/', '14448388', '', "kdownload");*/
            		//raon에 파일 추가
            		//RAONKUPLOAD.AddUploadedFile(dMap2.fileNo+"_0", splitOriginFileNm, "https://mhme-a430673.documents.us2.oraclecloud.com/documents/api/1.2/files/"+splitOriginFileNm+"/data/", dMap2.fileSize2, '', 'kdownload');
            		$("#attachTd").append("<a/>");
            		//$("#attachTd a:eq(0)").attr({href:"javascript:;",class:"link", onclick:"techUtil.fileDownload(\""+ dMap2.fileNo2+"_"+splitOriginFileNm +"\",\"1\")"});
            		$("#attachTd a:eq(0)").attr({id:dMap2.fileNo+"_"+dMap2.saveFileNm2,href:"javascript:;",class:"link", onclick:"hrTicketView.raonDownload('"+ dMap2.fileNo+"_"+dMap2.saveFileNm2 +"','kdownload');"});
            		$("#attachTd a:eq(0)").text(dMap2.originFileNm2);
            		$("#attachTd").append("<span class='k-icon k-i-close' onclick='hrTicketView.fileDeleteFunc('"+dMap2.fileNo+"','"+dMap2.saveFileNm2 +"','"+dMap2.fileNo+"_"+dMap2.saveFileNm2 +"',this);'></span><br>");
            	}

            }

			var TS_AUTH = $("#tsAuth").val();

			if(TS_AUTH != 'HQ'){
				$("#radio_sw").hide();
				$("#l4_transfer_btn").hide();
			}

			if(TS_AUTH == 'SC'){
				$("#radio_sw").show();
			}
			this.setInitDefault();
			this.setInitEvent();
			
			//hrTicketCommon._PARAM.currentPage = "view";
			//메모 첨부파일
			techCommon.kendoFile("memoFile", "memoTempSeq");
			console.log(TS_AUTH);

			$("#fileNoCnt0").bind("click", function(){
				console.log("fileNoCnt0");
				hrTicketView.fileViewPopup($("#fileNoCnt0"),'0');
			});
			$("#fileNoCnt1").bind("click", function(){
				console.log("fileNoCnt1");
				hrTicketView.fileViewPopup($("#fileNoCnt1"),'1');
			});

			$("#fileNoCnt2").bind("click", function(){
				console.log("fileNoCnt2");
				hrTicketView.fileViewPopup($("#fileNoCnt2"),'2');
			});

			$("#fileNoCnt3").bind("click", function(){
				console.log("fileNoCnt3");
				hrTicketView.fileViewPopup($("#fileNoCnt3"),'3');
			});


			$("#editBtn").bind("click", function(){
				$("#cc_list_view").hide();
				$("#cc_list").show();
				techUtil.enableComboBox("search_ccEmail", true);
				$("#btn_ccEmail").show();

			});

//			$('#editBtn').toggle(function(){
//				$("#cc_list_view").hide();
//				$("#cc_list").show();
//		    }, function(){
//		    	$("#cc_list_view").show();
//				$("#cc_list").hide();
//		    });


			$("#transBtn").bind("click", function(){
				hrTicketView.HQtransfer(); //HQ로 이관하는것 .setAutoYn:Y, setOwnerId:0, setL3TransferYn:Y 으로 변경
				//Ticket has been transfered to HQ.
			});




			//관련정보 버튼
			$("#relate_info_btn").bind("click", function(e){
				var _hospitalId = $("#hospitalId").val();
				var setReqNo = $("#setReqNo").val();
				var _srlNo = $("#setsrlNo").val();
				/*if(!_hospitalId) {
					kendo.alert($.gsisMsg('ts.common.msg.51'));
					return;
				}*/

				 /*if(!_srlNo) {
					kendo.alert($.gsisMsg('ts.common.msg.52'));
					return;
				} */


				$("#dialog_componentsDetail").append("<div id='dialog_structure_stat2'></div>");

                $("#dialog_structure_stat2").gsisLoadWindow({
                    width : 1200,
                    modal : true,
                    title: "",
                    animation: {
                        close: false,
                        open: false
                    },
                    content :{
                        url : "/tech/resp/componentsPopAction.do",
                    },
                    open : function(e) {
                        // 제품구성 팝업 초기화

                        componentsPop.init({ setReqNo : setReqNo, srlNo : _srlNo });
                    },
                    close : function(){
                        this.destroy();
                    },
                });

			});


			//관련정보 버튼 빨간색 일때. ////VOC-20200710-001 난수리 티켓 화면상 설치 안된 SN 표기_[수정 요청] 난수리 티켓 정보 수리 요청
			$("#relate_info_btn_chk").bind("click", function(e){
				kendo.alert($.gsisMsg('ts.common.msg.84'));
				return;
			});



		},
		structure: function() {
			$("#relate_info_btn").trigger("click");
		},
		/*
		 * 난수리종료티켓 초기화
		 */
		initClosed : function() {
			//raonupload 이벤트 호출

			raonUploadSetting("memoFileDownloadHolder","kdownload");

			var dMap2= hrTicketView.getmapList("hrTicketfileViewAction.do",{hdTicketNo: hrTicketCommon._PARAM.hdTicketNo});
			console.log(dMap2);
			console.log(dMap2.originFileNm);

			 //기술자료 첨부파일 view
            if(dMap2.originFileNm != undefined){	//등록된 첨부파일이 있을 경우
            	$("#attachTd").empty();

            	var len = 1;
            	var splitSeq;
            	var splitOriginFileNm;
            	if(dMap2.saveFileNm.indexOf(",") > -1){
            		len = dMap2.saveFileNm.split(",").length;
            		splitSeq = dMap2.seq.split(",");
            		splitOriginFileNm = dMap2.originFileNm.split(",");

            		for(var i=0; i<len; i++){
	            		$("#attachTd").append("<a/>");
	            		$("#attachTd a:eq("+i+")").attr({href:"javascript:;",class:"link", onclick:"techUtil.fileDownload(\""+dMap2.fileNo+"\",\""+splitSeq[i]+"\")"});
	            		if(i == 0){
	            			$("#attachTd a:eq("+i+")").text(splitOriginFileNm[i]);
	            			$("#attachTd").append("<br>");
	            		}else{
	            			$("#attachTd a:eq("+i+")").text(" "+splitOriginFileNm[i]);
	            			$("#attachTd").append("<br>");
	            		}

	            	}
            	}else{
            		$("#attachTd").empty();
            		$("#attachTd").append("<a/>");
            		$("#attachTd a:eq(0)").attr({href:"javascript:;",class:"link", onclick:"techUtil.fileDownload(\""+dMap2.fileNo+"\",\""+dMap2.seq+"\")"});
            		$("#attachTd a:eq(0)").text(dMap2.originFileNm);
            		$("#attachTd").append("<br>");
            	}

            }

          //클라우드 서버로 올라간 파일 다운로드 로직
            if(dMap2.originFileNm2 != undefined){	//등록된 첨부파일이 있을 경우
            	//헤더에 인증 정보 추가
                //RAONKUPLOAD.AddHttpHeader("Authorization", "Basic Z3Npcy5zbUBzYW1zdW5nbWVkaXNvbi5jb206TWVkaXNvbjEh", "kdownload");

            	var len = 1;
            	var splitSeq;
            	var splitOriginFileNm;
            	if(dMap2.saveFileNm2.indexOf(",") > -1){
            		len = dMap2.saveFileNm2.split(",").length;
            		splitOriginFileNm = dMap2.originFileNm2.split(",");
            		var uuid = dMap2.saveFileNm2.split(",");

            		for(var i=0; i<len; i++){
            			/*alert(dMap2.fileNo+"_"+i);
            			RAONKUPLOAD.AddUploadedFile('1', 'test444.zip', 'https://mhme-a430673.documents.us2.oraclecloud.com/documents/api/1.2/files/D98D3FF725A9CAEF2B50D15374174AF41EEE86FCFE55/data/', '14448388', '', "kdownload");*/
            			//raon에 파일 추가
            			//RAONKUPLOAD.AddUploadedFile(dMap2.fileNo+"_"+i, splitOriginFileNm, "https://mhme-a430673.documents.us2.oraclecloud.com/documents/api/1.2/files/"+splitOriginFileNm+"/data/", fileSize[i], '', 'kdownload');
	            		$("#attachTd").append("<a/>");
	            		//$("#attachTd a:eq("+i+")").attr({href:"javascript:;",class:"link", onclick:"techUtil.fileDownload(\""+dMap2.fileNo+"\",\""+i+"\")"});
	            		$("#attachTd a:eq("+i+")").attr({id:dMap2.fileNo+"_"+uuid[i],href:"javascript:;",class:"link", onclick:"hrTicketView.raonDownload('"+dMap2.fileNo+"_"+uuid[i] +"','kdownload')"});

	            		if(i == 0){
	            			$("#attachTd a:eq("+i+")").text(splitOriginFileNm[i]);
	            			$("#attachTd").append("<span class='k-icon k-i-close' onclick='hrTicketView.fileDeleteFunc('"+dMap2.fileNo+"','"+uuid[i] +"','"+dMap2.fileNo+"_"+uuid[i] +"',this);'></span><br>");
	            		}else{
	            			$("#attachTd a:eq("+i+")").text("  "+splitOriginFileNm[i]);
	            			$("#attachTd").append("<span class='k-icon k-i-close' onclick='hrTicketView.fileDeleteFunc('"+dMap2.fileNo+"','"+uuid[i] +"','"+dMap2.fileNo+"_"+uuid[i] +"',this);'></span><br>");
	            		}
	            	}
            	}else{
            		$("#attachTd").append("<a/>");
            		//$("#attachTd a:eq(0)").attr({href:"javascript:;",class:"link", onclick:"techUtil.fileDownload(\""+ dMap2.fileNo2+"_"+splitOriginFileNm +"\",\"1\")"});
            		$("#attachTd a:eq(0)").attr({id:dMap2.fileNo+"_"+dMap2.saveFileNm2,href:"javascript:;",class:"link", onclick:"hrTicketView.raonDownload('"+ dMap2.fileNo+"_"+dMap2.saveFileNm2 +"','kdownload');"});
            		$("#attachTd a:eq(0)").text(dMap2.originFileNm2);
            		$("#attachTd").append("<span class='k-icon k-i-close' onclick='hrTicketView.fileDeleteFunc('"+dMap2.fileNo+"','"+dMap2.saveFileNm2 +"','"+dMap2.fileNo+"_"+dMap2.saveFileNm2 +"',this);'></span><br>");
            	}

            }
            var TS_AUTH = $("#tsAuth").val();
			//메모 목록
			this.memoList(hrTicketCommon._PARAM.hdTicketNo);
			hrTicketView.ccList();
			var _pgStatCd = $("#combo_pgStatCd").val();
			var _sortOrder = $("#sortOrder").val();

			if (_pgStatCd == "ICP") {
				_sortOrder = _sortOrder - 1;
			}

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
			console.log(args);
			//techUtil.makeCommonComboBox(args);
			// Accordian
			$(".panelbar").accordian();
			//취소 버튼

			$("#ticket_view_close").bind("click", function(e){
				hrTicketView.windowClose();
			});

			//관련정보 버튼
			$("#relate_info_btn").bind("click", function(e){
				var _hospitalId = $("#hospitalId").val();
				var setReqNo = $("#setReqNo").val();
				var _srlNo = $("#setsrlNo").val();
				/*if(!_hospitalId) {
					kendo.alert($.gsisMsg('ts.common.msg.51'));
					return;
				}*/

				 /*if(!_srlNo) {
					kendo.alert($.gsisMsg('ts.common.msg.52'));
					return;
				} */


				$("#dialog_componentsDetail").append("<div id='dialog_structure_stat2'></div>");

                $("#dialog_structure_stat2").gsisLoadWindow({
                    width : 1200,
                    modal : true,
                    title: "",
                    animation: {
                        close: false,
                        open: false
                    },
                    content :{
                        url : "/tech/resp/componentsPopAction.do",
                    },
                    open : function(e) {
                        // 제품구성 팝업 초기화

                        componentsPop.init({ setReqNo : setReqNo, srlNo : _srlNo });
                    },
                    close : function(){
                        this.destroy();
                    },
                });

			});

			//관련정보 버튼 빨간색 일때. ////VOC-20200710-001 난수리 티켓 화면상 설치 안된 SN 표기_[수정 요청] 난수리 티켓 정보 수리 요청
			$("#relate_info_btn_chk").bind("click", function(e){
				kendo.alert($.gsisMsg('ts.common.msg.84'));
				return;
			});


		},

		getmapList : function(_url, _params) {

			var d = null;
			$.ajax({
			    url : _url,
			    async:false,
				dataType : "json",
				type: 'POST',
				data : _params,
				error: function(){

				},
				success: function(r){
					d = r.dMap;
				}
			});
			return d;

		},


		setInitDefault : function() {

			//시장품질 이관 버튼
			$("#l4_transfer_btn").bind("click", function(e){
				//$("#l4transfer_btn").trigger("click");
				hrTicketView.transPopup();
				//hrTicketView.transfer();

				$("#dialog_l4transfer").append("<div id='dialog_l4transfer2'></div>");
				$("#dialog_l4transfer2").gsisLoadWindow({
					width : 1200,
					modal : true,
					title: $.gsisMsg('ts.01.01.006.14'),
					animation: {
						close: false,
						open: false
					},
					content :{
						url : "/tech/hrts/hrTicketTransAction.do",
					},
					open : function(e) {
						// 제품구성 팝업 초기화
					 //<spring:message code="ts.01.01.006.14"/>

						//componentsPop.init({ setReqNo : setReqNo, srlNo : _srlNo });
					},
					close : function(){
						this.destroy();
					},
				});

			});

			var _pgStatCd = $("#combo_pgStatCd").val();

			if(_pgStatCd != 'R' && _pgStatCd != 'C'){
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

				var args2 = {
						target : "symptomM",
						url : "/tech/common/symptomCodeAjax.do",
						data : "codeList",
						param : {prodGrpCd : ""},
						text : "codeNm",
						value : "codeId",
						callback : function(){
						},
						appendComboData : {
							"codeNm" : techCommon.MSG.select,
							"codeId" : ""
						}
				};

				var args3 = {
						target : "symptomS",
						url : "/tech/common/symptomCodeAjax.do",
						data : "codeList",
						param : {prodGrpCd : ""},
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
				techUtil.makeCommonComboBox(args2);
				techUtil.makeCommonComboBox(args3);
			}

			$("#symptomL").change(function(){
				//Symptom Code
				var args1 = {
						target : "symptomM",
						url : "/tech/common/symptomLcodeAjax.do",
						data : "codeList",
						param : {prodGrpCd : $("#prodGrpCd").val(), symptomL : $("#symptomL").val()},
						text : "codeNm",
						value : "codeId",
						callback : function(){
						},
						appendComboData : {
							"codeNm" : techCommon.MSG.select,
							"codeId" : ""
						}
				};


				var args2 = {
						target : "symptomS",
						url : "/tech/common/symptomMcodeAjax.do",
						data : "codeList",
						param : {prodGrpCd : "", symptomM : ""},
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
				techUtil.makeCommonComboBox(args2);


			});

			$("#symptomM").change(function(){
				//Symptom Code
				var args1 = {
						target : "symptomS",
						url : "/tech/common/symptomMcodeAjax.do",
						data : "codeList",
						param : {prodGrpCd : $("#prodGrpCd").val(), symptomM : $("#symptomM").val()},
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


			});


			// Accordian
			$(".panelbar").accordian();

			this.makeComboBox();

			//메모 목록
			this.memoList(hrTicketCommon._PARAM.hdTicketNo);

			this.setViewByPgStatCd($("#combo_pgStatCd").val());

			//참조자 목록
			this.ccList();

			//Resolution Report 첨부파일
			//techCommon.kendoFile("reportFile", "reportFileNo");

			//techUtil.makeEditor();
		},


		/* 난수리티켓 상세 팝업 */
		transPopup : function() {
			 $("#l4transfer_btn").gsisOpenWindow({
				content : "/tech/hrts/hrTicketTransAction.do",
				data : {hdTicketNo : hrTicketCommon._PARAM.hdTicketNo},
				reloadable : false,
				minWidth: 1200,
				animation: {
					open : {effects : "fade:in"},
					close : {effects: "fade:out"}
				},
				close : function(){
					//난수리 티켓 번호 초기화
					hrTicketCommon._PARAM.hdTicketNo = null;
					hrTicketCommon._PARAM.title = $.gsisMsg('ts.01.01.003.2');
				}
			});
		},


		setInitEvent : function() {
			//나에게
			$("#pickMe").bind("click", function(e){
				hrTicketView.pickMe();
			});

			$("#btn_ccEmail").bind("click", function(e){
				hrTicketView.ccEmailAdd();
			});

			 //시장품질 이관 버튼
			$("#l4_transfer_btn2").bind("click", function(e){
				//$("#l4transfer_btn").trigger("click");
				//hrTicketView.transPopup();

				hrTicketView.transfer();
			});

			//저장버튼
			$("#ticket_view_save").bind("click", function(e){
				var ownerId = $("#combo_ownerId").val();
				var corponr = $("#corpOwnerId").val();
				var pgStatCd = $("#combo_pgStatCd").val();
				if(ownerId == ''||ownerId == '0') {
					if(pgStatCd == 'O'|| pgStatCd == 'N') {
					hrTicketView.ticketSave();
					return;
					}else{
					kendo.alert($.gsisMsg('ts.common.msg.50'));
					return;
					}
				}else{
				hrTicketView.ticketSave();
				}
			});

			//티켓 완료처리 버튼
			$("#ticket_close_save").bind("click", function(e){
				hrTicketView.ticketClose();
			});

			//취소 버튼
			$("#ticket_view_close").bind("click", function(e){
				hrTicketView.windowClose();
			});

			$(".update_memo").each(function(){
				$(this).bind("click", function(e){
					var _hdTicketNo = $(this).attr("hdTicketNo");
					var _seqNo = $(this).attr("seqNo");
					var _fileNo = $(this).attr("fileNo");
					$("#memoFileNo").val(_fileNo);
					$("#fileInfoViewer").html("");

					hrTicketView.updateMemo(_hdTicketNo, _seqNo);
				});
			});

		},
		/* 파일다운로드 상세 팝업 fileNoCntId=>$("#fileNoCnt1")$("#fileNoCnt2") */
		fileViewPopup : function(fileNoCntId, seq) {
			fileNoCntId.gsisOpenWindow({
				title : $.gsisMsg("ts.01.03.001.43"),
				open:function(e){
					hrTicketView.GV.selFileNo = $("#fileNoCnt"+seq).data("id2");
					var $div4 = $('<div id="cnt_form'+i+' style="display:none;"></div>');
					var _memoList = hrTicketView.GV.gvmemoList;
					var fileNoNameTd2 = '';
					var fileNoCnt = '';
					var fileNoSize = 0;
					parseInt(fileNoSize);
					$.each(_memoList, function(i, _memo){
						if (_memo.attachFileList == null) {
							fileNoNameTd2 = $.gsisMsg('ts.common.msg.28');
						} else {
							if (_memo.attachFileList.length == 0) {
								fileNoSize = 0;
								fileNoCnt = 'file(0)';
							} else {
								//fileNoCnt = _memo.attachFileList.length
								console.log(_memo.attachFileList.length);
								$.each(_memo.attachFileList, function(j, _attachFile){
									var margin = '<br/>';
									if (j > 0) {
										fileNoNameTd2 += margin;
									}
									console.log(fileNoNameTd2);
								});
							}
						}
						$.each(_memo.attachFileList, function(j, _attachFile){
							console.log(hrTicketView.GV.selFileNo);
							console.log(_memo.fileNo);
							if(hrTicketView.GV.selFileNo==_memo.fileNo){
								//fileNoNameTd2   += '<a href="javascript:;" class="link" onclick="techUtil.fileDownload(' + _memo.fileNo + ', ' + _memo.seq + ')">' + _attachFile.originFileNm+'</a>';
								/*fileNoNameTd2   += '<a href="javascript:;" class="link" onclick="techUtil.fileDownload(' + _attachFile.fileNo + ', ' + _attachFile.seq + ')">' + _attachFile.originFileNm+'</a>';
								fileNoNameTd2   += '<br/>';*/

								if(_attachFile.fileSavePath == ""){
									fileNoNameTd2   += '<a href="javascript:;" class="link" onclick="hrTicketView.raonDownload(\'' + _attachFile.fileNo+"_"+_attachFile.saveFileNm + '\', \'kdownload\')">' + _attachFile.originFileNm+'</a>';
									fileNoNameTd2   += '<br/>';
								}else{
									fileNoNameTd2   += '<a href="javascript:;" class="link" onclick="techUtil.fileDownload(' + _attachFile.fileNo + ', ' + _attachFile.seq + ')">' + _attachFile.originFileNm+'</a>';
									fileNoNameTd2   += '<br/>';
								}
							}
						});


					});
					$div4.append(fileNoNameTd2);
					$('#cnt_form').append(fileNoNameTd2);
				},
				close:function(){
				}
			});
		},
		/*
		 * 난수리티켓 상세팝업창 닫기
		 */
		windowClose : function() {
			techUtil.closeWindow("dialog_ticket_view");
		},
		windowClose2 : function() {
			techUtil.closeWindow("dialog_ticket_view");
			techUtil.closeWindow("dialog_l4transfer2");
		},

		/* 나에게 */
		pickMe : function() {
			var sessionUserId = $("#sessionUserId").val();
			techUtil.selectComboBox("combo_ownerId", sessionUserId);

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
						//console.log(r);
						//kendo.alert("정상처리되었습니다.");
						hrTicketCommon.refresh();

						//T:임시,N:신규,O:오픈 상태일때 담당자등록시 상태 값 A로 수정
						var tempPgStatCd1 = $("#combo_pgStatCd").val();
						if(tempPgStatCd1 == 'T' || tempPgStatCd1 == 'N' || tempPgStatCd1 == 'O') {
							$("#combo_pgStatCd").val("A");
						}
						kendo.alert($.gsisMsg("success.success"));

						hrTicketList.list();
						/*hrTicketView.windowClose();*/

						//owner 수정후 팝업내에 입력되있는 owner 정보 session user정보로 수정
						$("#corpOwnerId").val($("#sessionCorpId").val());

						$("#ticket_view_save").show();
					}
				});
			});
		},

		ccEmailAdd : function() { // 추가한다.
			var sessionUserId = $("#sessionUserId").val();
			//techUtil.selectComboBox("search_ccEmail", sessionUserId);
			var params = hrTicketView.makeParams("memoForm");

			kendo.confirm($.gsisMsg("ts.01.01.006.1001")).done(function(){
				$.ajax({
					url : "/tech/hrts/hrTicketccEmailAddAjax.do",
					dataType : "json",
					type : 'POST',
					data : params,
					error : function() {
						kendo.alert('error...');
					},
					success : function(r) {
						hrTicketCommon.refresh();
						//T:임시,N:신규,O:오픈 상태일때 담당자등록시 상태 값 A로 수정
						var tempPgStatCd1 = $("#combo_pgStatCd").val();
						if(tempPgStatCd1 == 'T' || tempPgStatCd1 == 'N' || tempPgStatCd1 == 'O') {
							$("#combo_pgStatCd").val("A");
						}
						kendo.alert($.gsisMsg("success.success"));
						hrTicketView.list();
						//owner 수정후 팝업내에 입력되있는 owner 정보 session user정보로 수정
						$("#corpOwnerId").val($("#sessionCorpId").val());
						$("#ticket_view_save").show();
					}
				});
			});

		},

		/*
		 * 티켓 신청에 필요한 콤보박스 만들기
		 */
		makeComboBox : function(){
			//진행상태
			var _pgStatCd = $("#combo_pgStatCd").val();
			var _sortOrder = $("#sortOrder").val();

			if (_pgStatCd == "ICP") {
				_sortOrder = _sortOrder - 1;
			}

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
						console.log("sessionUserId::"+sessionUserId);
						console.log("ownerId::"+hrTicketCommon._PARAM.ownerId);
						console.log("reqUserId::"+hrTicketCommon._PARAM.reqUserId);
							hrTicketView.controlComboBox("combo_pgStatCd");

					}
			};

			/*//소유자
			var argsO = {
					target : "combo_ownerId",
					url : "/tech/common/ownerEngineerListAjax.do",
					data : "engineerList",
					text : "userNm",
					value : "userNo",
					callback : function(){
						var sessionUserId = $("#sessionUserId").val();
						if(hrTicketCommon._PARAM.reqUserId == sessionUserId){
							hrTicketView.controlComboBox("combo_ownerId");
						}
					},
					appendComboData : {
						"userNm" : techCommon.MSG.select,
						"userNo" : ""
					}
			};
			//소유자 콤보박스 만들기
			techUtil.makeCommonComboBox(argsO);*/

			if($("#prodGrpCd").val()=="DR"){
				/*$("#combo_ownerId").val('');*/

				var args1 = {
						target : "combo_ownerId",
						url : "/tech/common/drComboAjax.do",
						data : "engineerList",
						param : {prodGrpCd : $("#prodGrpCd").val(), symptomM : $("#symptomM").val()},
						text : "userNm",
						value : "userNo",
						callback : function(){
							if($("#combo_ownerId").val() > 0) {
								$("#check_ownerId").prop('checked', true);
							} else {
								if (TS_AUTH == 'DP') {
									techUtil.enableComboBox("combo_ownerId", false);
									$("#pickMe_div").hide();
								}
								//techUtil.enableComboBox("combo_ownerId", false);
							}
						},
						appendComboData : {
							"userNm" : techCommon.MSG.select,
							"userNo" : ""
						}
				};
				/*techUtil.makeCommonComboBox(args1);
				techUtil.selectComboBox("combo_ownerId", hrTicketCommon._PARAM.ownerId);*/

				var ownerIdName = $('#ownerIdName').val();
				console.log(ownerIdName);
				console.log("hrTicketCommon._PARAM.ownerId"+hrTicketCommon._PARAM.ownerId);
				techUtil.makeCommonComboBox(args1);
				techUtil.selectComboBox2("combo_ownerId",hrTicketCommon._PARAM.ownerId,ownerIdName);
				$("#combo_ownerId").val(hrTicketCommon._PARAM.ownerId)

				if (TS_AUTH == 'DP') {
					techUtil.enableComboBox("combo_ownerId", false);
				}
			}else if($("#prodGrpCd").val()=="USS"){

				var args1 = {
						target : "combo_ownerId",
						url : "/tech/common/drComboAjax.do",
						data : "engineerList",
						param : {prodGrpCd : $("#prodGrpCd").val()},
						text : "userNm",
						value : "userNo",
						callback : function(){
							if($("#combo_ownerId").val() > 0) {
								$("#check_ownerId").prop('checked', true);
							} else {
								if (TS_AUTH == 'DP') {
									techUtil.enableComboBox("combo_ownerId", false);
									//$("#pickMe_div").hide();
								}

								//techUtil.enableComboBox("combo_ownerId", false);
							}
						},
						appendComboData : {
							"userNm" : techCommon.MSG.select,
							"userNo" : ""
						}
				};

				var natureGbCd = $("#natureGbCd").val();
				if(natureGbCd=="01" || natureGbCd==""){

					var ownerIdName = $('#ownerIdName').val();
					console.log(ownerIdName);
					console.log("hrTicketCommon._PARAM.ownerId"+hrTicketCommon._PARAM.ownerId);
					techUtil.makeCommonComboBox(args1);
					techUtil.selectComboBox2("combo_ownerId",hrTicketCommon._PARAM.ownerId,ownerIdName);
					$("#combo_ownerId").val(hrTicketCommon._PARAM.ownerId)
				}else{
					var ownerIdName = $('#ownerIdName').val();
					console.log(ownerIdName);
					console.log("hrTicketCommon._PARAM.ownerId"+hrTicketCommon._PARAM.ownerId);
					techUtil.makeCommonComboBox(args1);
					techUtil.selectComboBox2("combo_ownerId",hrTicketCommon._PARAM.ownerId,ownerIdName);
					$("#combo_ownerId").val(hrTicketCommon._PARAM.ownerId)
				}



				if (TS_AUTH == 'DP') {
					techUtil.enableComboBox("combo_ownerId", false);
				}
			}else {

				var args1 = {
						target : "combo_ownerId",
						url : "/tech/common/drComboAjax.do",
						data : "engineerList",
						param : {prodGrpCd : $("#prodGrpCd").val()},
						text : "userNm",
						value : "userNo",
						callback : function(){
							if($("#combo_ownerId").val() > 0) {
								$("#check_ownerId").prop('checked', true);
							} else {
								if (TS_AUTH == 'DP') {
									techUtil.enableComboBox("combo_ownerId", false);
									//$("#pickMe_div").hide();
								}

								//techUtil.enableComboBox("combo_ownerId", false);
							}
						},
						appendComboData : {
							"userNm" : techCommon.MSG.select,
							"userNo" : ""
						}
				};

				var natureGbCd = $("#natureGbCd").val();
				if(natureGbCd=="01" || natureGbCd==""){

					var ownerIdName = $('#ownerIdName').val();
					console.log(ownerIdName);
					console.log("hrTicketCommon._PARAM.ownerId"+hrTicketCommon._PARAM.ownerId);
					techUtil.makeCommonComboBox(args1);
					techUtil.selectComboBox2("combo_ownerId",hrTicketCommon._PARAM.ownerId,ownerIdName);
					$("#combo_ownerId").val(hrTicketCommon._PARAM.ownerId)
				}else{
					var ownerIdName = $('#ownerIdName').val();
					console.log(ownerIdName);
					console.log("hrTicketCommon._PARAM.ownerId"+hrTicketCommon._PARAM.ownerId);
					techUtil.makeCommonComboBox(args1);
					techUtil.selectComboBox2("combo_ownerId",hrTicketCommon._PARAM.ownerId,ownerIdName);
					$("#combo_ownerId").val(hrTicketCommon._PARAM.ownerId)
				}

				if (TS_AUTH == 'DP'){
					techUtil.enableComboBox("combo_ownerId", false);
				}
			};

			/* 이메일 검색 /////  T20C225*/
			var args9 = {
					target : "search_ccEmail",
					url : "/tech/common/selectHrTicketSearchCcEmailListAjax.do",
					data : "ccEmailList",
					param : {prodGrpCd : $("#prodGrpCd").val(),hdTicketNo: hrTicketCommon._PARAM.hdTicketNo},
					text : "email",
					value : "userNo",
					appendComboData : {
						//"email" : techCommon.MSG.all,
						"email" : "",
						"userNo" : ""
					}
			};

			//techUtil.makeCommonComboBox(args9);
			this.makeCommonComboBox(args9);
			/* 이메일 검색 /////  T20C225*/



			//진행상태 코드 콤보박스 만들기
			techUtil.makeCommonComboBox(args);


			//Sub-status
			techUtil.makeSingleComboBox("combo_subStatusCd", techCommon.CODE_URL.subStatusCd, "Y", {codeNm : techCommon.MSG.select});
			//Resolution
			techUtil.makeSingleComboBox("combo_resolutionCd", techCommon.CODE_URL.resolutionCd, "Y", {codeNm : techCommon.MSG.select});
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
			//$("#pickMe_div").hide();//admin.common.field.005

			console.log("combo_ownerId::::::: "+ $("#combo_ownerId").val());
			 console.log("natureGbCd 난수리권한  :::::" + $("#natureGbCd").val());
			 console.log("_target:::::" + _target);
			//natureGbCd

			var _pgStatCd = $("#combo_pgStatCd").val();
			//직파트너는 무조건 안보이도록 처리
			if($("#htPartnerYn").val() == "Y"){
				$("#transBtn").hide();
				$("#combo_pgStatCd").parent().css("width","100%");
			}else{
				//HQ가 아니고 법인일때  L3 이관 하지않고 N,O,A,I 단계일때 L3 이관 버튼 보임
				if($("#tsAuth").val() == 'SC' &&
						$("#schl3TransferYn").val() != 'Y' &&
						(_pgStatCd != 'T' /*||_pgStatCd != 'R' */||_pgStatCd != 'C')
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

			//Closed 단계일때를 제외 하고 저장 가능 하도록 처리 (Closed 단계는 페이지 따로 있음)
			/*if($("#tsAuth").val() == 'SC' && ($("#corpOwnerId").val() == 2 || $("#corpOwnerId").val() == 0 || $("#corpOwnerId").val() == '')){ //법인이고 L3 이관 한상태이면 글작성 불가능
				$("#ticket_view_save").hide();
			}else *//*if(($("#tsAuth").val() == 'SC' || $("#tsAuth").val() == 'HQ') && (_pgStatCd == 'T' || _pgStatCd == 'N'|| _pgStatCd == 'O')){
				//법인 HQ 인원은 Assigned 부터 글작성가능
				$("#ticket_view_save").hide();
			}*/

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
		 * 참조자 목록
		 */
		ccList : function() {
			var _url = "/tech/common/ownerEngineerListAjax.do";
			var _params = {hdTicketNo: hrTicketCommon._PARAM.hdTicketNo ,prodGrpCd : $("#prodGrpCd").val()};
			techCommon.ajax(_url, 'json', _params, hrTicketViewCallback.ccList);
		},

		/*
		 * 참조자 목록 화면 만들기
		 */
		drawCcList : function(_ccList) {
			$.each(_ccList, function(i, item){
				var $li = $('<li>');
				var $input = null;
				var hdTicketNo = item.hdTicketNo;
				//console.log(" OUT " +hdTicketNo);
				if(hdTicketNo != null && hdTicketNo !="" && hdTicketNo != 'undefined'){
					$input =$('<input>').attr({
						type : 'checkbox',
						id : 'cc_checkbox' + i,
						name : 'ccCheck',
						checked : true,
						value : item.userNo+","+item.inputType
					});
				}else{
					$input =$('<input>').attr({
						type : 'checkbox',
						id : 'cc_checkbox' + i,
						name : 'ccCheck',
						value : item.userNo
					});
				}
				var $label = $('<label>').attr('for', 'cc_checkbox' + i).text(item.userNm);

				$input.appendTo($li);
				$label.appendTo($li);

				$("#cc_list").append($li);
			});
			$.each(_ccList, function(i, item){
				var $li = $('<li>');
				var $userTxt = null;
				var hdTicketNo = item.hdTicketNo;
				//console.log(" OUT " +hdTicketNo);
				if(hdTicketNo != null && hdTicketNo !="" && hdTicketNo != 'undefined'){
					$userTxt =$('<label>').text(item.userNm);
					$userTxt.appendTo($li);
				}
				$("#cc_list_view").append($li);
			});
			 var natureGbCd = $("#natureGbCd").val();

			if(natureGbCd=="01" || natureGbCd==""){
				$("#cc_list").hide();
			}
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
				data.userId = _value.split(",")[0];
				data.inputType = _value.split(",")[1];
				//alert(_value.split(",")[0]+","+_value.split(",")[1]);
				json.push(data);
			});
			return JSON.stringify(json);
		},

		/*
		 * 메모 이력 목록
		 */
		memoList : function(_hdTicketNo) {
			var _target = "ticket_memo_list";
			var _url = "/tech/hrts/hrTicketMemoListAjax.do";
			var _params = {hdTicketNo : _hdTicketNo, reqUserId : hrTicketCommon._PARAM.reqUserId , ownerId : hrTicketCommon._PARAM.ownerId};

			techCommon.ajax(_url, 'json', _params, hrTicketViewCallback.memoList);
		},


		/*
		 * 메모 목록 그리기
		 */
		drawMemoList : function(_memoList) {



			$('#ticket_memo_list').html("");
			$('#cnt_form').html("");
			var voReqTypeCd = $('#voReqTypeCd').val();
			var voErrTypeCdName = $('#voErrTypeCdName').val();
			var voCfmContent = $('#voCfmContent').val();

			var voRoomSize1 = $('#voRoomSize1').val();
			var voRoomSize2 = $('#voRoomSize2').val();
			var voRailSize1 = $('#voRailSize1').val();
			var voRailSize2 = $('#voRailSize2').val();
			var voCeilingHg = $('#voCeilingHg').val();
			var voWallTk = $('#voWallTk').val();
			var voChkYn1Name = $('#voChkYn1Name').val();
			var voChkYn2Name = $('#voChkYn2Name').val();
			var voChkYn3Name = $('#voChkYn3Name').val();
			var voSitePlanResnCdName = $('#voSitePlanResnCdName').val();
			var voSitePlanContent = $('#voSitePlanContent').val();
			//voSitePlanContent = techUtil.checkXSS(voSitePlanContent);

			if(_memoList.length > 0) {
				hrTicketView.GV.cntSeq=0;
				hrTicketView.GV.gvmemoList = _memoList;
				$.each(_memoList, function(i, _memo){
					if(_memo.autoMsg =="Y"){
						var $div1 = $("<div>").addClass("contentsRow marT10");
						var $div2 = $("<div>").addClass("memo_history line02");
						var $div5 = $("<div>").addClass("txt_box");
						$div5.append(_memo.content);
						$div2.append($div5);
						$div1.append($div2);
						$('#ticket_memo_list').append($div1);
					} else{
					//memo_history line01
					var $div1 = $("<div>").addClass("contentsRow marT10");

					var $div2 = $("<div>").addClass("memo_history line02");
					//비공개 메시지 구분 Y=공개 N=비공개
					if(_memo.openYn == "Y"){
						if(hrTicketCommon._PARAM.ownerId == _memo.regUserId){
							 $div2 = $("<div>").addClass("memo_history line01");
						}else {
							 $div2 = $("<div>").addClass("memo_history line02");
						}
					}else{
						$div2 = $("<div>").addClass("memo_history line03");
					}
					//var $div2 = $("<div>").addClass("memo_history");

					var $div4 = $('<div id="cnt_form'+i+' style="display:none;"></div>');
					var $div3 = $("<div>").addClass("tit_box");
					var $div5 = $("<div>").addClass("txt_box");
					var view_off = '<span class="icon"></span>';
					var view_on	= '<span class="icon on"></span>';

					var open_off = '('+$.gsisMsg('ts.01.01.006.10')+')' ;
					var open_on	= '';


					hrTicketView.GV.cntSeq++;
					//console.log("hrTicketView.GV.cntSeq:"+hrTicketView.GV.cntSeq);

					var reqCheckYnName = (_memo.reqCheckYn == "Y") ? view_on :  view_off  ;
					var openCheckYnName = (_memo.openYn == "Y") ? open_on :  open_off  ;

					//var fileNoNameTd = (_memo.fileNo == null || _memo.fileNo == "") ? $.gsisMsg('ts.common.msg.28') : '<a href="#" class="link">' + _memo.fileNo;

					var fileNoNameTd = '';
					var fileNoCnt = '';
					var fileNoSize = 0;
					parseInt(fileNoSize);
					var checkYnTd = reqCheckYnName;

					if (_memo.attachFileList == null) {

						fileNoNameTd = $.gsisMsg('ts.common.msg.28');
					} else {
						if (_memo.attachFileList.length == 0) {
							fileNoSize = 0;
							fileNoCnt = 'file(0)';
						} else {
							//fileNoCnt = _memo.attachFileList.length
							console.log(_memo.attachFileList.length);
							$.each(_memo.attachFileList, function(j, _attachFile){
								var margin = '';
								if (j > 0) {
									fileNoNameTd += margin;
								}
								console.log(_memo.fileNo);
								fileNoSize += _attachFile.fileSize;
								//fileNoCnt = '<a href="javascript:;"  data-id="cnt_form" data-id2="'+_memo.fileNo+'" id="fileNoCnt'+hrTicketView.GV.cntSeq+'"  data-width="300" data-content="/tech/hrts/hrTicketFileAction.do">' +'file('+_memo.attachFileList.length+')' + '</a>';
								fileNoCnt ='file('+_memo.attachFileList.length+')';
							});
						}
					}

					/*if (_memo.reqCheckYn == 'N') {
						checkYnTd += '<button type="button" class="k-button pull-right update_memo" hdTicketNo="' + hrTicketCommon._PARAM.hdTicketNo + '" seqNo="' + _memo.seqNo + '" >' + $.gsisMsg('common.field.005') + '</button>'
					}*/
					//_memo.reqCheckYn ='N'

					var reqUsNm = $('#reqUsNm').val();
					var ownerUsNm = $('#ownerUsNm').val();
					var _pgStatCd = $("#combo_pgStatCd").val();



					if (_memo.reqCheckYn == 'N') {
						console.log(_pgStatCd);
						/*if(_pgStatCd == 'R' || _pgStatCd == undefined){*/
						checkYnTd += '<button type="button" class="k-button pull-left update_memo" hdTicketNo="' + hrTicketCommon._PARAM.hdTicketNo + '" seqNo="' + _memo.seqNo + '" fileNo="'+_memo.fileNo+'" >' + $.gsisMsg('ts.02.01.001.10') + '</button>'
						/*}*/
					}
					if(_memo.openYn == "Y"){
						if(TS_AUTH == 'HQ' ||TS_AUTH == 'SC'){
							$div3.append('<strong>' + _memo.regUserIdName2 +'('+_memo.regCorpName2+')' + '</strong><span class="date">'+_memo.regDt+'</span>');
						}else{
							$div3.append('<strong>' + _memo.regUserIdName2 +'('+_memo.regCorpName2+')' + '</strong><span class="date">'+_memo.regDt+'</span>');
						}
					} else {
						if(TS_AUTH == 'HQ' ||TS_AUTH == 'SC'){
							$div3.append('<strong>' + _memo.regUserIdName2 +'('+_memo.regCorpName2+')' + '</strong><span class="date">'+_memo.regDt+'    '+openCheckYnName+'</span>');
						}else{
							$div3.append('<strong>' + _memo.regUserIdName2 +'('+_memo.regCorpName2+')' + '</strong><span class="date">'+_memo.regDt+'</span>');
						}
					}

					$div3.append('<div class="option">'+checkYnTd+'<span class="file"><button type="button">'+fileNoCnt+'</button><em>/'+ fileNoSize +'byte</em></span></div>');

					$div5.append(_memo.content);

					$.each(_memo.attachFileList, function(j, _attachFile){

						var margin = '';
						if (j > 0) {
							fileNoNameTd += margin;
						}
						//fileNoNameTd   += '<br/><a href="javascript:;" class="link" onclick="techUtil.fileDownload(' + _attachFile.fileNo + ', ' + _attachFile.seq + ')">' + _attachFile.originFileNm+'</a>';
						//fileNoNameTd   += '<br/><a href="javascript:;" class="link" onclick="hrTicketView.raonDownload(' + _attachFile.fileNo + ', ' + _attachFile.seq + ')">' + _attachFile.originFileNm+'</a>';
						if(_attachFile.fileSavePath == ""){
							fileNoNameTd   += '<br/><a href="javascript:;" id="'+_attachFile.fileNo+'_'+_attachFile.saveFileNm+'", class="link" onclick="hrTicketView.raonDownload(\'' + _attachFile.fileNo+"_"+_attachFile.saveFileNm + '\', \'kdownload\')">' + _attachFile.originFileNm+'</a>';
							if (_memo.reqCheckYn == 'N') {
								fileNoNameTd   += '<span class="k-icon k-i-close" onclick="hrTicketView.fileDeleteFunc(\'' + _attachFile.fileNo+"\', \'"+_attachFile.saveFileNm + '\', \'' + _attachFile.fileNo+"_"+_attachFile.saveFileNm + '\',this);"></span>';
							}
						}else{
							fileNoNameTd   += '<br/><a href="javascript:;" class="link" onclick="techUtil.fileDownload(' + _attachFile.fileNo + ', ' + _attachFile.seq + ')">' + _attachFile.originFileNm+'</a>';
						}

						/*}*/
					});


					$div4.append('');
					//$div3.append(fileNoNameTd);
					$div3.append($div4);
					$div2.append($div3);
					$div5.append(fileNoNameTd);
					$div2.append($div5);
					$div1.append($div2);
					//var cnt_form = "cnt_form"+i
					//$('#'+cnt_form).val();

					if(_pgStatCd=="O" && TS_AUTH=="HQ" ){
							//_memo.content="";
					}

					if(_memo.openYn == "Y"){
						if(_memo.content.length!="0"){
							$('#ticket_memo_list').append($div1);
						}
					} else {
						if(TS_AUTH == 'HQ' ||TS_AUTH == 'SC' ){
							if(_memo.content.length!="0"){
								$('#ticket_memo_list').append($div1);
							}
						}else{

						}
					}
				}
				});
			} else {
				/*var $div1 = $("<div>").addClass("contentsRow marT10");
				var $div2 = $("<div>").addClass("k-grid k-widget k-row-normal").text("메모가 없습니다.");
				$div1.append($div2);
				$('#ticket_memo_list').append($div1);*/
			}

		},fileDeleteFunc : function(fileNo, qqUuid, aTagId,obj){
			//대용량 파일 del_yn 'Y'로 업데이트
			kendo.confirm($.gsisMsg('confirm.delete')).done(function(){
				$.ajax({
				    url : "/common/updateRaonFileDelYn.do",
				    async:false,
					dataType : "json",
					type: 'POST',
					data : {
						"gubun" : "D",
						"fileNo" : fileNo,
						"qqUuid" : qqUuid
					},
					success: function(r){
						kendo.alert($.gsisMsg('success.success'));
						console.log(aTagId);
						$("#"+aTagId).hide();
						$(obj).hide();

					}
				});
			});


		},

		/*
		 * 현재 선택한 모드 정보
		 */
		getCurrentMode : function() {
			var _mode = null;

			$("#view_tab>li").each(function(i){
				if($(this).hasClass("k-state-active")) {
					_mode = $(this).attr("mode");
				}
			});
			return _mode;
		},

		/*
		 * 메모, Resolution Report, 평가의 파라미터 생성
		 */
		makeParams : function(_form) {
			var _commonParams = {
				hdTicketNo : hrTicketCommon._PARAM.hdTicketNo,
				pgStatCd : $("#combo_pgStatCd").val(),
				ownerId: $("#combo_ownerId").val(),
				ccEmail: $("#search_ccEmail").val(), // 추가
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
		 * 시장품질 이관
		 */
		transfer : function() {

			if(techUtil.confirm($.gsisMsg('ts.common.msg.40'), function(){
				var _url = "/tech/hrts/transferToL4Ajax.do";

				var _params = {
						hdTicketNo : hrTicketCommon._PARAM.hdTicketNo,
						title : $("#title").val(),
						gticketNo :$("#gticketNo").val(),
						transfYn : "Y",
						status : "1",
						description : $("#description").val(),
						complnt : $("#complnt").val(),
						pantInvmnt : $("#pantInvmnt").val(),
						awrnssDt : $("#awrnssDt").val(),
						complntInfo : $("#complntInfo").val(),
						mdlCd : $("#mdlCd").val() ,
						srlNo : $("#srlNo").val() ,
						hospitalId : $("#hospitalId").val() ,
						cnrtNm : $("#reqregioncd").val()


				};
				techCommon.ajax(_url, "json", _params, hrTicketViewCallback.transfer);
			}));
		},


		/*
		 * HQ 이관
		 */
		HQtransfer : function() {
			if(techUtil.confirm("Ticket has been transfered to HQ.", function(){
				var _url = "/tech/hrts/transferToHqAjax.do";
				var _params = {
						//hdTicketNo : hrTicketCommon._PARAM.hdTicketNo
						//L2 ->L3 이관만 하도록 하기위해 pgStatCd 넘기지 않음
						//화면에 corpOwnerId 조회 조건이 정확히지 않기 때문에 컨트롤러에서 세션 정보를 입력함
						//pgStatCd : $("#combo_pgStatCd").val(),
						//corpOwnerId : $("#combo_ownerId").val()

						hdTicketNo : hrTicketCommon._PARAM.hdTicketNo,
						pgStatCd : $("#combo_pgStatCd").val(),
						//corpOwnerId : $("#combo_ownerId").val()
				};
				techCommon.ajax(_url, "json", _params, hrTicketViewCallback.transfer);

				hrTicketList.list();
				hrTicketView.windowClose();
			}));
		},


		/* 메모 수정 화면 세팅 */
		updateMemo : function(_hdTicketNo, _seqNo) {

			var _url = "/tech/hrts/hrTicketMemoInfoAjax.do";
			var _params = {hdTicketNo : _hdTicketNo, seqNo : _seqNo};
			techCommon.ajax(_url, "json", _params, function(data){
				var _memoInfo = data.memoInfo;
				var _fileUpdateInfo = data.fileUpdateInfo;

				$("#custom_attach_controll").empty().append("<input/>");
				$("#custom_attach_controll input").attr({type:"file",id:"memoFile",name:"attachFile"});
				if(_fileUpdateInfo != null){
					var _tempFileSeq = techCommon.getAttachFileSeqAjax();
					$("#memoTempSeq").val(_tempFileSeq);
					techUtil.attachedFilesView({
						target : "memoFile",		//element id
						saveUrl : "/common/insertTempAttchFileAjax.do",	//saveUrl
						removeUrl : "/common/deleteTempAttchFileAjax.do",	//removeUrl
						saveFileNm : _fileUpdateInfo.saveFileNm,	//저장된 파일명JSONStringfy
						originFileNm : _fileUpdateInfo.originFileNm,	//오리지널 파일명
						fileExt : _fileUpdateInfo.fileExt, //파일확장자
						fileSize : _fileUpdateInfo.fileSize, //파일사이즈
						fileNo : _fileUpdateInfo.fileNo, //파일seq
						seq : _fileUpdateInfo.seq,		//업무단위파일seq
						autoUploadFlag : true,
						tempFileSeq : _tempFileSeq
					});
				}else{
					techCommon.kendoFile("memoFile", "memoTempSeq");
				}


				$("#memoSeqNo").val(_memoInfo.seqNo);
				techUtil.setEditorValue("memo_content", _memoInfo.content);

				//기존 파일 번호 세팅
				//$("#memoFileNo").val(_memoInfo.fileNo);
				$("#kdownload1_raonFileSeq").val(_memoInfo.fileNo);


				if(_memoInfo.openYn == 'Y') {
					$("#memoForm").find('input[name=openYn][value="Y"]').attr('checked', true);
				} else {
					$("#memoForm").find('input[name=openYn][value="N"]').attr('checked', true);
				}
			});
		},

		/*
		 * 티켓 상세 저장 (메모, Resolution Report)
		 */
		ticketSave : function() {
			var _mode = this.getCurrentMode();
			var _url = null;
			var _msg = null;
			var _callback = null;
			var _formName = null;
			var status = "save";
			var onr = $("#combo_ownerId").val();
			var corponr = $("#corpOwnerId").val();
			var pgStatCd = $("#combo_pgStatCd").val();
			/*alert(_mode);*/
			console.log("!!!!!!!!!!!!!!!!");
			console.log($("#evalForm").length);
			console.log($("#evalForm").serializeArray().length);
			console.log("!!!!!!!!!!!!!!!!");
			if (_mode != null) {
				if(_mode != "cmemo") {
					if (_mode == "memo") {
						$("#memoForm").validator(function(){
							var _params = null;

							if ($("#memoForm").length > 0) {
								if($("#memoSeqNo").val()) {
									var fileJson = techUtil.getKendoFileListJson("memoFile");
									$("#memoFileJson").val(fileJson);

									_url = "/tech/hrts/hrTicketMemoUpdateAjax.do";
									_params = hrTicketView.makeParams("memoForm");
									//메모를 수정하시겠습니까?
									_msg = $.gsisMsg('ts.common.msg.56', $.gsisMsg('ts.01.01.006.7'));
									_callback = hrTicketViewCallback.ticketMemoUpdate;
									status = "update";
								} else {
									_url = "/tech/hrts/hrTicketMemoSaveAjax.do";
									if(onr ==""){
										$("#combo_ownerId").val("0");
										//kendo.alert($.gsisMsg('ts.common.msg.50'));
										//return;
									}
									if(corponr ==""){
										$("#corpOwnerId").val("0");
									}

									/*if(pgStatCd=="O" && TS_AUTH=="HQ"){
										$("#memo_content").val('');
									}*/

									//등록자
									var tempReqUserId = $("#reqUserId").val();
									var tempSessionId = $("#sessionUserId").val();
									var tempPgStatCd = $("#combo_pgStatCd").val();

									console.log("!!!!!!!!!!!!!!!!");
									console.log(tempReqUserId);
									console.log(tempSessionId);
									console.log(tempPgStatCd);
									console.log("!!!!!!!!!!!!!!!!");

									//등록자가 아니면 owner가 지정되야 메모 등록 가능
									/* 2020.02.04 주석 처리.
									 * Tech Ticket 의 Owner 가 지정되지 않아도 메모를 남길 수 있어야 합니다.
									 * 해외 지역 담당과의 시차가 있어서 해외 담당자가 티켓을 assigned 하기 전에 본사에서 먼저 확인하여 확인된 사항을 티켓에 남겨 놓는 경우가 있습니다.
									 **/
									/*if(tempReqUserId != tempSessionId){
										if(tempPgStatCd == 'T' || tempPgStatCd == 'N' || tempPgStatCd == 'O') {
											kendo.alert("Ticket has to be assigned the person in charge of model first.");

											return false;
										}
									}*/

									if($("#memo_content").val() == ""){
										kendo.alert("Please enter memo");

										return false;
									}



									_params = hrTicketView.makeParams("memoForm");

									//메모를 저장하시겠습니까?
									console.log(_params);
									//_msg = $.gsisMsg('ts.common.msg.17', $.gsisMsg('ts.01.01.006.7'));
									_msg = $.gsisMsg('confirm.save');
									_callback = hrTicketViewCallback.ticketMemoSave;
								}
								_formName = "memoForm";
							}
							if (techUtil.confirm(_msg, function(){
								console.log("confirm YES", _params);
								if (status == "save") {
									techCommon.ajax(_url, "json", _params, _callback);
								}
								if (status == "update") {
									techCommon.ajax(_url, "json", _params, _callback);
								}
							},
							function(){
								console.log("confirm NO", _params);
								//_params=null;
							}
							));

						});//$("#memoForm").validator(function(){
					} else if (_mode == "report") {
						var pgStatCd = $("#combo_pgStatCd").val();

						//진행상태가 Resolved 이면 요청한 파트너 엔지니어가 평가를 저장한다.
						//if ($("#evalForm").length > 0) {
						if ($("#evalForm").serializeArray().length > 0) {
							$("#evalForm").validator(function(){
								var _params = null;

								//Textarea 공백, 개행 처리
								//$("#eval_opinion").val(techUtil.replaceTextArea($("#eval_opinion").val()));
								//XSS 체크
								$("#eval_opinion").val(techUtil.checkXSS($("#eval_opinion").val()));
								_url = "/tech/hrts/hrTicketEvaluationSaveAjax.do";
								_params = hrTicketView.makeParams("evalForm");
								//평가 하시겠습니까?

								var agreeYn =$(":input:radio[name=agreeYn]:checked").val();

								_msg = $.gsisMsg('confirm.save');
								_callback = hrTicketViewCallback.ticketEvalSave;
								_formName = "evalForm";

								if (techUtil.confirm(_msg, function(){
									console.log("confirm YES", _params);
									if (status == "save") {
										techCommon.ajax(_url, "json", _params, _callback);
									}
									if (status == "update") {
										techCommon.ajax(_url, "json", _params, _callback);
									}
								},
								function(){
									console.log("confirm NO", _params);
									//_params=null;
								}
								));
							});//$("#evalForm").validator(function(){
						} else if($("#reportForm").length > 0) {
							$("#reportForm").validator(function(){
								var _params = null;

								//Textarea 공백, 개행 처리
								//$("#report_resolutionDtl").val(techUtil.replaceTextArea($("#report_resolutionDtl").val()));
								//XSS 체크
								//$("#report_resolutionDtl").val(techUtil.checkXSS($("#report_resolutionDtl").val()));
								//Textarea 공백, 개행 처리
							//	$("#report_followUpAction").val(techUtil.replaceTextArea($("#report_followUpAction").val()));
								//XSS 체크
								//$("#report_followUpAction").val(techUtil.checkXSS($("#report_followUpAction").val()));

								_url = "/tech/hrts/hrTicketResolutionReportSaveAjax.do";
								_params = hrTicketView.makeParams("reportForm");
								console.log("_params:::::::",_params);
								//Resolution Report를 저장하시겠습니까?
								_msg = $.gsisMsg('ts.common.msg.17', $.gsisMsg('ts.01.01.006.8'));
								_callback = hrTicketViewCallback.ticketReportSave;

								_formName = "reportForm";

								if (techUtil.confirm(_msg, function(){
									console.log("confirm YES", _params);
									if (status == "save") {
										techCommon.ajax(_url, "json", _params, _callback);
									}
									if (status == "update") {
										techCommon.ajax(_url, "json", _params, _callback);
									}
								},
								function(){
									console.log("confirm NO", _params);
									//_params=null;
								}
								));
							});//$("#reportForm").validator(function(){
						} else {

						}

					}

					var pgStatCd = $("#combo_pgStatCd").val();
					var ownerId = $("#combo_ownerId").val();
					console.log("ownerId:::"+ownerId);
					console.log("pgStatCd:::"+pgStatCd);
					if(ownerId == ''||ownerId == '0') {
						if(pgStatCd == 'A' || pgStatCd == 'I' || pgStatCd == 'ICP' || pgStatCd == 'R') {
							console.log("ownerId::: 11"+ownerId);
							console.log("pgStatCd::: 22"+pgStatCd);
							kendo.alert($.gsisMsg('ts.common.msg.50'));
							techUtil.focusComboBox("combo_ownerId");
							return;
						}
					}
					var sessionUserId = $("#sessionUserId").val();
					var reqUserId2 = $("#reqUserId2").val();
					var ownerId2 = $("#ownerId2").val();

					var ownerId3 = $("#combo_ownerId").val();
					console.log(ownerId3);
					/*if(sessionUserId = reqUserId){
						alert("sessionUserId: "+ sessionUserId + "reqUserId"+ reqUserId);
						return
					}else if( sessionUserId = ownerId){
						alert("sessionUserId: "+ sessionUserId + "ownerId"+ ownerId);
						return
					}*/

				} else {
					kendo.alert($.gsisMsg('ts.common.msg.32'));
				}
			}
		},

		/*
		 * 티켓 완료 처리 (Closed)
		 */
		ticketClose : function() {
			var _url = "/tech/hrts/hrTicketSaveAjax.do";
			var _params = {hdTicketNo : hrTicketCommon._PARAM.hdTicketNo, pgStatCd : "C"};

			//티켓을 완료처리 하시겠습니까?
			if (techUtil.confirm($.gsisMsg('ts.common.msg.19'), function(){
				techCommon.ajax(_url, "json", _params, hrTicketViewCallback.ticketClose);
			}));
		}
		,//파일 다운로드 이벤트
		raonDownload : function (fileId,raonId) {

			RAONKUPLOAD.SetSelectFileEx(fileId, '0', raonId);

			var _fileLen = fileId.length ;
			var _lastDot = fileId.lastIndexOf('.');
			var _fileEx = fileId.substring(_lastDot+1,_fileLen).toLowerCase();
			//console.log(_fileEx);
			if(_fileEx=='jpg' ||_fileEx=='jpeg' ||_fileEx=='gif' ||_fileEx=='png' ||_fileEx=='xlsx'
					||_fileEx=='xls' ||_fileEx=='doc' ||_fileEx=='docx'  ||_fileEx=='bmp' ||_fileEx=='ppt' ||_fileEx=='pptx'  ||_fileEx=='txt'  ||_fileEx=='log' ){
				//RAONKUPLOAD.OpenSelectedFile(raonId);// lhj ver1 -> 곧바로 열리는 함수
				//RAONKUPLOAD.SaveAndFolderOpen(raonId); // lhj ver2 -> 저장이 되면서 폴더열기
				RAONKUPLOAD.SaveAndOpen(raonId); // lhj ver3 -> 저장이 되면서 파일열기
			}else{
				RAONKUPLOAD.DownloadFile(raonId);
			}
		},

		makeCommonComboBox : function(arg) {
			var excuteDataSource;

			var dataSource = new kendo.data.DataSource({
				transport: {
					read: {
						url: arg.url,
						data : arg.param,
						dataType: "json",
						cache: false,
						async: false
					}
				},
				schema: {
		        	data	: arg.data
		        }
			});

			dataSource.fetch(function(){
				if(arg.appendComboData != undefined){
					var data = dataSource.data();
					data.unshift(arg.appendComboData);
					excuteDataSource = data;
				}else{
					excuteDataSource = dataSource;
				}
				$("#" + arg.target).kendoComboBox({
					dataSource : excuteDataSource,
					dataTextField		: arg.text,
					dataValueField		: arg.value,
					index				: 0,
					autoWidth			: true,
					autoBind 			: true,
					filter: "contains",
				    suggest: true
				});

				/*$("#" + arg.target).setOptions({
					template: $.proxy(kendo.template("#= formatValue(text, this.text()) #"), $("#" + arg.target))
				});*/

				//$("#" + arg.target).data("kendoComboBox").input.attr("readonly", true);
				if(arg.callback != undefined){
					arg.callback();
				}
			});
		}

}


//Callback
window.hrTicketViewCallback = {
		ccList : function(data){
			hrTicketView.drawCcList(data.engineerList);
		},

		/*
		 * 메목 목록 callback
		 */
		memoList : function(data) {

			hrTicketView.drawMemoList(data.list);
		},

		/*
		 * L4 시장품질 이관 callback
		 */
		transfer : function(data) {
			if (data.result == "200") {
				//이관하였습니다.
				techUtil.alert($.gsisMsg('ts.common.msg.42'), function(){
					//hrTicketView.windowClose2();
					//techUtil.closeWindow("dialog_l4transfer2");
				});
			} else {
				//이관중 오류가 발생하였습니다.
				kendo.alert($.gsisMsg('ts.common.msg.21', $.gsisMsg('ts.common.msg.41')));
			}
		},

		/*
		 * 메모 저장 callback
		 */
		ticketMemoSave : function(data) {
			if (data.result == "200") {
				//저장하였습니다.
				techUtil.alert($.gsisMsg('ts.common.msg.6'), function(){
					hrTicketCommon.refresh();
					hrTicketView.windowClose();
				});

			} else {
				//저장중 오류가 발생하였습니다.
				kendo.alert($.gsisMsg('ts.common.msg.21', $.gsisMsg('ts.common.msg.22')));
			}
		},

		/*
		 * Resolution Report 저장 callback
		 */
		ticketReportSave : function(data) {
			if (data.result == "200") {
				//저장하였습니다.
				techUtil.alert($.gsisMsg('ts.common.msg.6'), function(){
					hrTicketCommon.refresh();
					hrTicketView.windowClose();
				});
			} else {
				//저장중 오류가 발생하였습니다.
				kendo.alert($.gsisMsg('ts.common.msg.21', $.gsisMsg('ts.common.msg.22')));
			}
		},

		/*
		 * 난수리 티켓 평가 저장 callback
		 */
		ticketEvalSave : function(data) {
			if (data.result == "200") {
				//평가하였습니다.
				techUtil.alert($.gsisMsg('success.save'), function(){
					hrTicketCommon.refresh();
					hrTicketView.windowClose();
				});
			} else {
				//평가중 오류가 발생하였습니다.
				kendo.alert($.gsisMsg('ts.common.msg.21', $.gsisMsg('ts.common.msg.26')));
			}
		},

		/*
		 * 난수리 티켓 종료 (Closed)
		 */
		ticketClose : function(data) {
			if (data.result == "200") {
				//티켓을 완료처리 하였습니다.
				techUtil.alert($.gsisMsg('ts.common.msg.19'), function(){
					hrTicketCommon.refresh();
					hrTicketView.windowClose();
				});
			} else {
				//완료처리중 오류가 발생하였습니다.
				kendo.alert($.gsisMsg('ts.common.msg.21', $.gsisMsg('ts.common.msg.27')));
			}
		},

		/* 난수리 티켓 메모 수정 */
		ticketMemoUpdate : function(data) {
			if (data.result == "200") {
				//수정하였습니다.
				techUtil.alert($.gsisMsg('ts.common.msg.8'), function(){
					//메모 목록
					hrTicketView.memoList(hrTicketCommon._PARAM.hdTicketNo);
					hrTicketView.windowClose();
				});
			} else {
				//수정중 오류가 발생하였습니다.
				kendo.alert($.gsisMsg('ts.common.msg.21', $.gsisMsg('ts.common.msg.24')));
			}
		}
}

//업로드 생성완료 이벤트
function OracleCloud_CreationComplete(uploadID, oracleCloudJobID) {
    console.log('업로드 생성 완료 : jobId => ' + oracleCloudJobID);

	if("kdownload" == uploadID){
		RAONKUPLOAD.Hidden("kdownload");

		//대용량 다운로드 파일 리스트 조회

	    $.ajax({
		    url : "/tech/hrts/raonHardTicketDownLoadList.do",
		    async:false,
			dataType : "json",
			type: 'POST',
			data : {
				hdTicketNo : hrTicketCommon._PARAM.hdTicketNo
			},
			error: function(){

			},
			success: function(r){
				var fileList = r.resultMap;
				console.log(fileList);
				if(fileList.length > 0){
					//헤더에 인증 정보 추가
				    RAONKUPLOAD.AddHttpHeader("Authorization", "Basic Z3Npcy5jb21tb25AcGFydG5lci5zYW1zdW5nLmNvbTpTYW1zdW5nMSE=", "kdownload");
					for(var n=0;n<fileList.length;n++){
						//RAONKUPLOAD.AddUploadedFile(fileList[n].fileNo+"_"+fileList[n].qqUuid, fileList[n].qqFileName, 'https://mhme-a430673.documents.us2.oraclecloud.com/documents/api/1.2/files/'+fileList[n].qqUuid+'/data/', fileList[n].qqTotalFileSize, '', "kdownload");

						RAONKUPLOAD.AddUploadedFile(
								fileList[n].fileNo+"_"+fileList[n].qqUuid,
								fileList[n].qqFileName,
								'https://gsisfile.samsunghealthcare.com/kdownload?guid='+fileList[n].qqUuid,
								fileList[n].qqTotalFileSize,
								'',
								"kdownload");


						/*RAONKUPLOAD.AddUploadedFile(
								fileList[n].fileNo+"_"+fileList[n].qqUuid,
								fileList[n].qqFileName,
								'https://mhme-a430673.documents.us2.oraclecloud.com/documents/api/1.2/files/'+fileList[n].qqUuid+'/data/',
								fileList[n].qqTotalFileSize, '',
								"kdownload");*/
					}

				}

			}
		});

	}



}