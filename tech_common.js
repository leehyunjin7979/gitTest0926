/**
 * 기술지원 공통 자바스크립트
 */

$(document).ready(function(){
	techCommon.init();
});

var techCommon = {


		init : function(){
			$(".date_period_tech").each(function(){
				var $start = $(this).find(".ip_start");
				var $end = $(this).find(".ip_end");
				var today = kendo.date.today();

				var start = $start.kendoDatePicker({
					value: today,
					change: startChange,
					//parseFormats: ["yyyy.MM.dd"]
					//culture: "ko-KR",
					format : "yyyy-MM-dd",
					//footer :  "#: kendo.toString(getUCTDate(), \"D\", \"ko-KR\") #"

				}).data("kendoDatePicker");

				var end = $end.kendoDatePicker({
					value: today,
					change: endChange,
					//parseFormats: ["yyyy.MM.dd"]
					//culture: "ko-KR",
					format : "yyyy-MM-dd",
					//footer :  "#: kendo.toString(getUCTDate(), \"D\", \"ko-KR\") #"
				}).data("kendoDatePicker");

				$start.attr("readonly", true);
				$end.attr("readonly", true);

				var startChange = function () {
					var startDate = start.value(),
					endDate = end.value();

					if (startDate) {
						startDate = new Date(startDate);
						startDate.setDate(startDate.getDate());
						end.min(startDate);
					} else if (endDate) {
						start.max(new Date(endDate));
					} else {
						endDate = new Date();
						start.max(endDate);
						end.min(endDate);
					}
				}

				var endChange = function() {
					var endDate = end.value(),
					startDate = start.value();

					if (endDate) {
						endDate = new Date(endDate);
						endDate.setDate(endDate.getDate());
						start.max(endDate);
					} else if (startDate) {
						end.min(new Date(startDate));
					} else {
						endDate = new Date();
						start.max(endDate);
						end.min(endDate);
					}
				}
			});

		   /* //datetimepicker
			$(".date_period_tech_nodate").each(function(){
				var $start = $(this).find(".ip_start");
				var today = kendo.date.today();
				var start = $start.kendoDatePicker({
					culture: "ko-KR",
					format : "yyyy-MM-dd"
				}).data("kendoDatePicker");
				$start.attr("readonly", true);
			});*/


		},

		//전역변수
		GV : {
			tempFileSeq : null,	//파일업로드 , 임시첨부파일 그룹번호
			allpop  :null,
			//exts : commonprop.fileupload.exe,	//첨부파일 허용 확장자
//			 exts : [ ".pdf", ".png",".jpg",".gif",".txt",".ppt", ".pptx",".xls", ".xlsx",".doc",".bmp"
//                      ,".docx",".hwp",".log",".orig",".zip"],	//첨부파일 허용 확장자 2018-04-10  .orig, .zip 확장자 추가 유재희 차장 요청
			//size : commonprop.fileupload.size,	//첨부파일 허용 사이즈
			  //size : 2147483648,	//첨부파일 허용 사이즈 50mb(47.683716mb)
			size : 52428800,
			userGbCd : ""
		},

		MSG : {
			select : $.gsisMsg('ts.common.msg.13'),

			all : $.gsisMsg('ts.common.msg.12'),

			nodata : function() {
				return $.gsisMsg('ts.common.msg.44');
			}
		},

		/*
		 * 공통 코드 URL
		 */
		CODE_URL : {
			//이관구분 코드
			rctRcCd : "/common/getComCodeAjax.do?codeGroupId=T001&searchType=ALL1",
			//요청타입 코드
			reqTypeCd : "/common/getComCodeAjax.do?codeGroupId=T002&searchType=ALL1",
			//진행상태 코드
			pgStatCd : "/common/getComCodeAjax.do?codeGroupId=T003&searchType=ALL1",
			//장애유형 코드
			errTypeCd : "/common/getComCodeAjax.do?codeGroupId=T007&searchType=ALL1",
			//L4이관 코드
			l4TransferCd : "/common/getComCodeAjax.do?codeGroupId=T005&searchType=ALL1",
			//Sub-status 코드
			subStatusCd : "/common/getComCodeAjax.do?codeGroupId=T004&searchType=ALL1",
			//Type of Resolution 코드
			resolutionCd : "/common/getComCodeAjax.do?codeGroupId=T006&searchType=ALL1",
			//The reason of site plan 코드
			sitePlanResnCd : "/common/getComCodeAjax.do?codeGroupId=T010&searchType=ALL1",
			//컨텐츠 구분 코드
			contentGb : "/common/getComCodeAjax.do?codeGroupId=T008&searchType=ALL1",
			//에러등급 코드
			T009 : "/common/getComCodeAjax.do?codeGroupId=T009&searchType=ALL1"
		},

		/*
		 * 기술지원 Ajax
		 */
		ajax : function (_url, _type, _params, _onsuccess) {
			$.ajax({
				url 		: _url,
			    async 		: false,
				dataType 	: _type,
				type 		: "post",
				data 		: _params,
				error: function(e){
					 //techUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);

				},
				success: function(responseData, statusText){
					if(undefined != _onsuccess){
						_onsuccess(responseData, statusText);
					}
				}
			});
		},



		/*
		 * 그리드 만들기
		 */
		makeGrid :  function (_target, _url, _params, _columns, _change) {
			var _dataSource = new kendo.data.DataSource({
				transport : {
					read : {
		          	    url				: _url,
		          	    dataType		: "json",
		          	    data 			: _params,
		          	    sendDataType 	: "string",
		          	    type			: "POST",
		          	    error			: function(){
		          	    	 //techUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);
						}
		            }
				},
				schema: {
		        	data	: "list",
		        	total 	: "totalCnt"
		        },
		        serverPaging	: true,
		        pageSize		: 10
			});

			_dataSource.fetch(function(){
				$("#" + _target).kendoGrid({
					dataSource 	: _dataSource,
					columns 	: _columns,
			        pageable	: true,
			        selectable	: true,
			        editable	: false,
			       // sortable	: true,
			        //scrollable:true,
			        columnMenu	: false,
			        noRecords 	: {template : techCommon.MSG.nodata},
			        change		: _change
				});

				$("#totalCnt").html(_dataSource.total());
			});
		},

		/*
		 * 그리드 만들기 No paging
		 */
		makeGridNopaging :  function (_target, _url, _params, _columns, _change) {
			$("#" + _target).kendoGrid({
				dataSource : {
					transport : {
						read : {
							url				: _url,
			          	    dataType		: "json",
			          	    data 			: _params,
			          	    sendDataType 	: "string",
			          	    type			: "POST",
			          	    error			: function(e){
			          	    	 //techUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);
							}
			            }
					},
					schema: {
			        	data	: "list"
			        }
				},
				columns 	: _columns,
		        selectable	: true,
		        //sortable	: true,
		        columnMenu	: false,
		        noRecords 	: {template : techCommon.MSG.nodata},
		        change		: _change
			});
		},
		/*
		 * 파일업로드 , 임시첨부파일 그룹번호 조회
		 */
		getAttachFileSeqAjax : function(){
			var _tempFileSeq = null;

			$.ajax({
			    url : "/common/getTempAttchFileSeqAjax.do",
			    async:false,
				dataType : "json",
				type: 'post',
				data : "",
				error: function(e){
					 techUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);

				},
				success		: function(r){
				    var tempFileSeq = r.tempFileSeq;
				    techCommon.GV.tempFileSeq = tempFileSeq;
				    _tempFileSeq = r.tempFileSeq;
				}
			});

			return _tempFileSeq;
		},
		/*
		 * kendo DatePicker input date를 원하는 포맷으로 변경하여 리턴
		 * techCommon.setSubmitDate($(element).data("kendoDatePicker").value() , format)
		 * format 이 없을 경우 ex) 20170801 리턴
		 */
		setSubmitDate : function(date , format){
			function pad(num) {
		        num = num + '';
		        return num.length < 2 ? '0' + num : num;
		    }
			if(format == undefined){
				format ="";
			}
		    return date.getFullYear() +format+ pad(date.getMonth()+1) +format+ pad(date.getDate());
		},
		/*
		 * multipartAjax
		 */
		multipartAjax : function(_url, _params, _onsuccess){
			$.ajax({
	            type: "POST",
	            enctype: 'multipart/form-data',
	            url: _url,
	            data: _params,
	            processData: false,
	            contentType: false,
	            cache: false,
	            timeout: 600000,
	            success: function(responseData, statusText){
					if(undefined != _onsuccess){
						_onsuccess(responseData, statusText);
					}
				},
	            error: function (e) {
	            	 techUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);
	            }
	        });
		},

		/*
		 * 모델의 S/N 정보 팝업
		 */
		openSrlNoInfoPopup : function(_target, _mdlCd) {
			$("#" + _target).gsisOpenWindow({
				content : "/tech/common/searchSrlNoAction.do",
				reloadable : false,
				animation: {
					open : {effects : "fade:in"},
					close : {effects: "fade:out"}
				},
				close : function(){
				}
			});
		},

		/*
		 * 지도 팝업
		 */
		openMapInfoPopup : function(_target) {
			$("#" + _target).gsisOpenWindow({
				content : "/tech/common/searchMapAction.do",
				reloadable : false,
				animation: {
					open : {effects : "fade:in"},
					close : {effects: "fade:out"}
				},
				close : function(){

				}
			});
		},

		/* KendoUi 첨부파일 */
		kendoFile : function(_target, _fileNo,_autoFlag) {
			//파일업로드 , 임시첨부파일 그룹번호 조회
			var _tempFileSeq = techCommon.getAttachFileSeqAjax();
			var _flag=true;

			if(_autoFlag != undefined){
				_flag = _autoFlag;
			}
			$("#" + _fileNo).val(_tempFileSeq);
			$("#" + _target).kendoUpload({
				async : {
					saveUrl : "/common/insertTempAttchFileAjax.do",
					removeUrl : "/common/deleteTempAttchFileAjax.do",
					autoUpload : _flag
				},
				validation : {
					allowedExtensions : techCommon.GV.exts,	//허용 확장자
					maxFileSize : techCommon.GV.size	//공통 파일사이즈 적용
					//,maxFileSize : commonprop.fileupload.size	//공통 파일사이즈 적용
					//maxFileSize : techCommon.GV.size
				},
				upload : function(e){
					e.sender.options.async.saveUrl = "/common/insertTempAttchFileAjax.do?tempSeq=" + _tempFileSeq;
					e.sender.options.async.removeUrl = "/common/deleteTempAttchFileAjax.do?tempSeq=" + _tempFileSeq;
				}
			});
		}
}

var techUtil = {
	/**
	 *	전체 체크 박스 Checked (grid의 elements 형식)
	 *
	 */
	elementToggleAll : function (e, el) {
		var checked = e.target.checked;

		$(el).data("kendoGrid").tbody.find("input[type=checkbox]").each(function(){
			$(this).prop("checked", checked);
		});
	},

	techcontentsView : {
		defaults : {
			target: null,
			layer : "techcontentsView",
			callbackFunc: null,
			height :400,
			width :1000,
			minWidth:1000,
			content: "/tech/hrts/techcontentsView.do",
			loadJS : function() { },
			seqNo : null,	/** 게시글 key **/
			fileNo : null
		},

		window: function(options) {
			softwareSearch = this;
			this.options = $.extend(true, {},  this.defaults, options);
			this.layer = this.options.layer;
			this.loadJS = this.options.loadJS;
			this.dataSource = this.dataSource;
			this.callbackFunc = this.options.callbackFunc;
			this.seqNo = this.options.seqNo;
			this.fileNo = this.options.fileNo;
			this.init();
		}
		,init : function() {
			that = this;
			options = that.options;
			this.seqNo = that.options.seqNo;
			this.fileNo = that.options.fileNo;
			this.parameters.fileSearchKey.fileNo = that.options.fileNo;
			this.parameters.fileSearchKey.seqNo = that.options.seqNo;


			$("#" + options.layer).gsisLoadWindow({
				target : options.target,
				height : options.height,
				width : options.width,
				minWidth : options.minWidth,
				content : {url:options.content,data:{"seqNo":options.seqNo!=undefined?options.seqNo:"0"}},
				modal : true,
				title : options.title,
				position : options.position,
				open : function(e) {
					// open이 메서드 일경우에는 자기자신을 호출 options 설정하면서 동시에 호출함.
					if (typeof options.open === "function") {
						options.open.call(this, this);
					}
					$.proxy(that.loadPopupView(), that);

					/**
					 * Software는 대용량 파입 업/다운로드 연계된 화면임.
					 * 대용량 첨부파일 그리드 생성
					 */
					that.setAttachFileGrid("attachFileGrid");

					/** 10분 주기로 세션이 끊기지 않게 하기 위해 아무 요청 **/
					maintainSession();

					/** 확인, 닫기 버튼 이벤트 **/
					$(document).on("click", ".pop_btn .btn_chk, .pop_btn .btn_cancel",function(){
						$("#" + options.layer).data("kendoWindow").close();
					});

					/** 파일 다운로드 다중선택 제한 **/
					$(document).on("change",".attachFileSeq",function(e){
						e.preventDefault();
						var chk = $(this);
						var cnt = 0;

						if(!$(this).is(":checked")){
							return false;
						}

						$(that.grid.attachFileGrid.element).find("tbody").find("input[type=\"checkbox\"]").each(function(){
							var checked = $(this).is(":checked");
							if(checked){
								cnt++;
							}
						});
						if(cnt != 1){
							techUtil.alert($.gsisMsg("FS-02-03-004.111"));//다운로드할 파일 하나를 선택해주세요.
							//console.log($.gsisMsg("FS-02-03-004.111"));
							chk.prop("checked",false);
							return false;
						}else{
							chk.prop("checked",true);
						}
					});
					/** 선택파일 다운로드 버튼 이벤트 **/
					$(document).on("click","#choiceDownload",function(){
						//that.attachFileGrid

						var seqArray = new Array();
						$(that.grid.attachFileGrid.element).find("tbody").find("input[type=\"checkbox\"]").each(function(){
							var checked = $(this).is(":checked");
							if(checked){
								seqArray.push($(this).val());
							}
						});

						if(seqArray.length > 0){
							that.addDownloadForm(seqArray);
						}else{
							//fieldUtil.alert($.gsisMsg("FS-02-03-005-3.44"));
							console.log($.gsisMsg("FS-02-03-005-3.44"));
							return false;
						}/*else{
							fieldUtil.alert($.gsisMsg("FS-02-03-004.111"));//다운로드할 파일 하나를 선택해주세요.
						}*/

					});
				}
			});

		},
		loadPopupView : function() {
			this.options = $.extend(true, {},  this.defaults, options);
		},

		// 현 화면에 Document가 생성되면 호출되는 함수
		loadView: function(options, layerId) {
			this.options = $.extend(true, {},  this.defaults, options);
			this.layer = this.options.layer;
			this.loadJS = this.options.loadJS;

			this.loadJS();
		}
		,parameters : {
				fileSearchKey 	   : {"fileNo":""},//첨부파일
		}
		,grid : {
			versionGrid : null 	//버전그리드
		}
		,seqNo :""
		,gridInit : function(gridOptions, el){
			var defaultDS = {
					transport: {
						parameterMap: function(def) {
							var obj = {"take":def.take,"skip":def.skip,"page":def.page,"pageSize":def.pageSize};
							return $.extend(true, {}, obj, gridOptions );
						}
					},/*
					error: function (e) {
						fieldUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);
					},*/
					serverPaging: true,
					pageSize: 10,
					batch:true
			};
			var initDS = $.extend(true,{},defaultDS, gridOptions.dsOps);
			var dataSource =  new kendo.data.DataSource(initDS);
			var defaultGridOps = {
					columns : [],
					scrollable: false,
					noRecords : {template : $.gsisMsg("FS-02-03-004.65")},
					pageable: true,
					autoBind:true,
		            dataBound : function() {
		            	this.pager.element.hide();
					},
					dataBinding : function(e){
						if( "rebind" !== e.action){	// 등록, 수정, 삭제 시 grid 적용 안함
							e.preventDefault();
						}
					},
					dataSource: {data : []},
					selectable:true
			}
			var initGridOps = $.extend(true,{},defaultGridOps,gridOptions.gridOps);
			var grid = $(el).kendoGrid(initGridOps);

			if(grid.data("kendoGrid") != undefined){
				grid.data("kendoGrid").setDataSource(dataSource);
			}
			return grid.data("kendoGrid");
		}
		,addDownloadForm : function(seqArray){
			var size = seqArray != undefined ? seqArray.length:0;
			//ypsDownload(seqArray[0]);
			for(var i=0;i<size;i++){
				ypsDownload(seqArray[i]);
			}
		}
		,setAttachFileGrid : function(idStr){
			var that = this;
			var idStr = idStr!=undefined?idStr:"attachFileGrid";
			var gridElement = $("#"+idStr);
			var data = new Array;
			$.ajax({
				url : "/oc/getFileList.do"
				,dataType:"JSON"
				,type:"POST"
				,async:false
				,data:JSON.parse(JSON.stringify(that.parameters.fileSearchKey))
				,success:function(r){
					data = r.fileList;
				}
			});
			var obj = {
					gridOps : {
						columns: [
									/*{
										template: "<input type='checkbox' class=\"attachFileSeq\" data-bind='checked: checked' value=\"#: seq #\"/>",
										width: 30
									},
									{ field: "originFileNm", title: $.gsisMsg("FS-02-03-004.55") },*/
									{
										template: "<input type='checkbox' class=\"attachFileSeq\" value=\"#: qqUuId #\"/>",
										width: 30
									}
									,{ field: "qqFileName", title: $.gsisMsg("FS-02-03-004.55")}
									,{ field: "qqTotalFileSize", title:"File Size", template:"<span class=\"fileSize\">#: qqTotalFileSize #</span>"}
									,{ field: "regDt", title: $.gsisMsg("FS-02-03-004.56") }
								]
						,dataSource : {
										data : data.length > 0 ? data : []
						}
						, dataBound : function(e){
							$(this.element).find("tr").each(function(){
								var o = $(this).find(".fileSize").text();
								var s = 0;
								if(undefined != o && null != o && "" != o ){
									s = getVolume(Number(o));
								}
								$(this).find(".fileSize").text(s);
							});
						}
						,noRecords : {template : $.gsisMsg("FS-02-03-004.65")}
						,editable: false
						,selectable:false
						,serverPaging:false
						,pagable:false
						,async:false
						,scrollable: false
				}
			}
			this.grid.attachFileGrid = $(gridElement).kendoGrid(obj.gridOps).data("kendoGrid");
		}
},

	techBetaView : {
		defaults : {
			target: null,
			layer : "beta_view",
			callbackFunc: null,
			height :500,
			width :1000,
			minWidth:1000,
			content: "/tech/teis/betaFileView.do",
			loadJS : function() { },
			seqNo : null,	/** 게시글 key **/
			fileNo : null
		},

		window: function(options) {
			softwareSearch = this;
			this.options = $.extend(true, {},  this.defaults, options);
			this.layer = this.options.layer;
			this.loadJS = this.options.loadJS;
			this.dataSource = this.dataSource;
			this.callbackFunc = this.options.callbackFunc;
			this.seqNo = this.options.seqNo;
			this.fileNo = this.options.fileNo;
			this.init();
		}
		,init : function() {
			that = this;
			options = that.options;
			this.seqNo = that.options.seqNo;
			this.fileNo = that.options.fileNo;
			this.parameters.fileSearchKey.fileNo = that.options.fileNo;
			this.parameters.fileSearchKey.seqNo = that.options.seqNo;
			this.parameters.versionSearchKey.seqNo = that.options.seqNo;

			$("#" + options.layer).gsisLoadWindow({
				target : options.target,
				height : options.height,
				width : options.width,
				minWidth : options.minWidth,
				content : {url:options.content,data:{"seqNo":options.seqNo!=undefined?options.seqNo:"0"}},
				modal : true,
				title : options.title,
				position : options.position,
				open : function(e) {
					// open이 메서드 일경우에는 자기자신을 호출 options 설정하면서 동시에 호출함.
					if (typeof options.open === "function") {
						options.open.call(this, this);
					}
					$.proxy(that.loadPopupView(), that);

					/**
					 * Software는 대용량 파입 업/다운로드 연계된 화면임.
					 * 대용량 첨부파일 그리드 생성
					 */
					that.setAttachFileGrid("attachFileGrid");

					/** 10분 주기로 세션이 끊기지 않게 하기 위해 아무 요청 **/
					maintainSession();

					/** 확인, 닫기 버튼 이벤트 **/
					$(document).on("click", ".pop_btn .btn_chk, .pop_btn .btn_cancel",function(){
						$("#" + options.layer).data("kendoWindow").close();
					});
//
//					/** 등록, 수정시 에디터로 입력되는 부분이므로 태그 치환 필요 **/
//					var detailDesc = null;
//					if(document.getElementById("detailDescription") != null && document.getElementById("detailDescription") != undefined ){
//						detailDesc = document.getElementById("detailDescription");
//					}
//					if($("#detailDescription").text() != undefined && $("#detailDescription").text() != ""){
//						var txt = $("#detailDescription").text().replace("/&quot;\/g","\"");
//						$("#detailDescription").html(txt);
//					}

					/** 파일 다운로드 다중선택 제한 **/
					$(document).on("change",".attachFileSeq",function(e){
						e.preventDefault();
						var chk = $(this);
						var cnt = 0;

						if(!$(this).is(":checked")){
							return false;
						}

						$(that.grid.attachFileGrid.element).find("tbody").find("input[type=\"checkbox\"]").each(function(){
							var checked = $(this).is(":checked");
							if(checked){
								cnt++;
							}
						});
						if(cnt != 1){
							//fieldUtil.alert($.gsisMsg("FS-02-03-004.111"));//다운로드할 파일 하나를 선택해주세요.
							console.log($.gsisMsg("FS-02-03-004.111"));
							chk.prop("checked",false);
							return false;
						}else{
							chk.prop("checked",true);
						}
					});
					/** 선택파일 다운로드 버튼 이벤트 **/
					$(document).on("click","#choiceDownload",function(){
						//that.attachFileGrid
						var seqArray = new Array();
						$(that.grid.attachFileGrid.element).find("tbody").find("input[type=\"checkbox\"]").each(function(){
							var checked = $(this).is(":checked");
							if(checked){
								seqArray.push($(this).val());
							}
						});
						if(seqArray.length > 0){
							that.addDownloadForm(seqArray);
						}else{
							//fieldUtil.alert($.gsisMsg("FS-02-03-005-3.44"));
							console.log($.gsisMsg("FS-02-03-005-3.44"));
							return false;
						}/*else{
							fieldUtil.alert($.gsisMsg("FS-02-03-004.111"));//다운로드할 파일 하나를 선택해주세요.
						}*/
					});
				}
			});

		},
		loadPopupView : function() {
			this.options = $.extend(true, {},  this.defaults, options);
		},

		// 현 화면에 Document가 생성되면 호출되는 함수
		loadView: function(options, layerId) {
			this.options = $.extend(true, {},  this.defaults, options);
			this.layer = this.options.layer;
			this.loadJS = this.options.loadJS;

			this.loadJS();
		}
		,parameters : {
				fileSearchKey 	   : {"fileNo":""},//첨부파일
				versionSearchKey   : {"job":"version"},//버전정보
		}
		,grid : {
			versionGrid : null,	//버전그리드
			attachFileGrid : null,//첨부파일그리드
		}
		,seqNo :""
		,gridInit : function(gridOptions, el){
			var defaultDS = {
					transport: {
						parameterMap: function(def) {
							var obj = {"take":def.take,"skip":def.skip,"page":def.page,"pageSize":def.pageSize};
							return $.extend(true, {}, obj, gridOptions );
						}
					},/*
					error: function (e) {
						fieldUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);
					},*/
					serverPaging: true,
					pageSize: 10,
					batch:true
			};
			var initDS = $.extend(true,{},defaultDS, gridOptions.dsOps);
			var dataSource =  new kendo.data.DataSource(initDS);
			var defaultGridOps = {
					columns : [],
					scrollable: false,
					noRecords : {template : $.gsisMsg("FS-02-03-004.65")},
					pageable: true,
					autoBind:true,
		            dataBound : function() {
		            	this.pager.element.hide();
					},
					dataBinding : function(e){
						if( "rebind" !== e.action){	// 등록, 수정, 삭제 시 grid 적용 안함
							e.preventDefault();
						}
					},
					dataSource: {data : []},
					selectable:true
			}
			var initGridOps = $.extend(true,{},defaultGridOps,gridOptions.gridOps);
			var grid = $(el).kendoGrid(initGridOps);

			if(grid.data("kendoGrid") != undefined){
				grid.data("kendoGrid").setDataSource(dataSource);
			}
			return grid.data("kendoGrid");
		}
		,addDownloadForm : function(seqArray){
			var size = seqArray != undefined ? seqArray.length:0;
			//ypsDownload(seqArray[0]);
			for(var i=0;i<size;i++){
				ypsDownload(seqArray[i]);
			}
		}
		,setAttachFileGrid : function(idStr){
			var that = this;
			var idStr = idStr!=undefined?idStr:"attachFileGrid";
			var gridElement = $("#"+idStr);
			var data = new Array;
			$.ajax({
				url : "/oc/getFileList.do"
				,dataType:"JSON"
				,type:"POST"
				,async:false
				,data:JSON.parse(JSON.stringify(that.parameters.fileSearchKey))
				,success:function(r){
					data = r.fileList;
				}
			});
			var obj = {
					gridOps : {
						columns: [
									/*{
										template: "<input type='checkbox' class=\"attachFileSeq\" data-bind='checked: checked' value=\"#: seq #\"/>",
										width: 30
									},
									{ field: "originFileNm", title: $.gsisMsg("FS-02-03-004.55") },*/
									{
										template: "<input type='checkbox' class=\"attachFileSeq\" value=\"#: qqUuId #\"/>",
										width: 30
									}
									,{ field: "qqFileName", title: $.gsisMsg("FS-02-03-004.55")}
									,{ field: "qqTotalFileSize", title:"File Size", template:"<span class=\"fileSize\">#: qqTotalFileSize #</span>"}
									,{ field: "regDt", title: $.gsisMsg("FS-02-03-004.56") }
								]
						,dataSource : {
										data : data.length > 0 ? data : []
						}
						, dataBound : function(e){
							$(this.element).find("tr").each(function(){
								var o = $(this).find(".fileSize").text();
								var s = 0;
								if(undefined != o && null != o && "" != o ){
									s = getVolume(Number(o));
								}
								$(this).find(".fileSize").text(s);
							});
						}
						,noRecords : {template : $.gsisMsg("FS-02-03-004.65")}
						,editable: false
						,selectable:false
						,serverPaging:false
						,pagable:false
						,async:false
						,scrollable: false
				}
			}
			this.grid.attachFileGrid = $(gridElement).kendoGrid(obj.gridOps).data("kendoGrid");
		}
},

	techajaxJson : function(options){
		var defaults = {
			    url : "/field",
			    //async:false,
				dataType : "json",
				type: 'POST',
				data : {},
				error: function(r){
					if ( options.errosMsg != undefined && options.errosMsg != "" ) {
						console.log(options.errosMsg);
					}else{
						console.log($.gsisMsg("am.common.msg.11")/*"에러가 발생했습니다. 관리자에게 문의 해 주세요."*/);
					}
				},
				success: function(r){
				}
			}
		$.ajax($.extend(true, {}, defaults, options));
	},

	/*
	 * serializeArray() => Json 형식으로 convert
	 */
	makeJsonParam : function (_formArray) {
		var _obj = {};
		$.each(_formArray, function(i, pair){
			var _cObj = _obj, _pObj, _cpName;
			$.each(pair.name.split("."), function(i, pName){
				_pObj = _cObj;
				_cpName = pName;
				_cObj = _cObj[pName] ? _cObj[pName] : (_cObj[pName] = {});
			});
			_pObj[_cpName] = pair.value;
		});
		return _obj;
	},

	/*
	 * Json 형식의 Object를 view_ + key Id의 <span> 태그에 bind
	 */
	setJsonToHtml : function(_json) {
		$.each(_json, function(key, value){
			$("#view_" + key).html(value);
		});
	},

	/*
	 * Json 형식의 Object를 Form의 <input> 태그에 bind
	 */
	setJsonToForm : function(_json, _form) {
		$.each(_json, function(key, value) {
			_form.find("input[name='" + key + "']").val(value);
		});
	},

	getGridTotalCount : function(_target) {
		var grid = $("#" + _target).data("kendoGrid");
		var dataSource = grid.dataSource;
		var totalRecords = dataSource.total();
		return totalRecords;
	},

	/*
	 * KendoUI check box 세팅
	 */
	setCheckBox : function(_target) {
		$("#check_" + _target).bind("click", function(){
			if($("#check_" + _target).prop('checked')) $("#" + _target).val("Y");
			else $("#" + _target).val("");
		});
	},

	/*
	 * KendoUI editor
	 */
	makeEditor : function(_target) {
		$("#" + _target).kendoEditor({
			tools: [
				"bold",
				"italic",
				"underline",
				"strikethrough",
				"justifyLeft",
				"justifyCenter",
				"justifyRight",
				"justifyFull",
				//"insertImage",
				"insertUnorderedList",
				"insertOrderedList",
				"indent",
				"outdent",
				"createTable",
				"addRowAbove",
				"addRowBelow",
				"addColumnLeft",
				"addColumnRight",
				"deleteRow",
				"deleteColumn",
				"viewHtml",
				"fontName",
				"fontSize"
				//"foreColor",
				//"backColor",
				// "print"

			],
			imageBrowser: {
                messages: {
                    	dropFilesHere: "Drop files here",
                    	deleteFile: "Are you sure? This action cannot be undone.",
                    	invalidFileType: "Supported file types are {1}. Please retry your upload.",
                },
                transport: {
                    read:  {
                    	url: "/common/editorImageLoad.do",
                    	complete : function(data) {
                    		var imageBrowser = $(".k-imagebrowser").data("kendoImageBrowser");
                    		imageBrowser.element.find(".k-breadcrumbs-wrap").html(imageBrowser._path);
    			   			imageBrowser.element.find("input").attr("readonly", "readonly");
    			   			imageBrowser.toolbar.find("button:first").hide();

                    		if(typeof data.responseJSON[0] !== "undefined"){
                    			if(typeof data.responseJSON[0].isMade !== "undefined" && data.responseJSON[0].isMade ===  "Y" ){
                    				imageBrowser.list.find("li:first").hide();
                    				imageBrowser.listView.bind("dataBound", function(e) { imageBrowser.list.find("li:first").hide();} );
                    			}
                    			if(typeof data.responseJSON[0].path !== "undefined" ) {
                    				imageBrowser.list.data("path", data.responseJSON[0].path);
                    			}
                    		}
                        }
                    },
                    destroy: {
                        url: "/common/editorImageDestroy.do",
                        type: "POST",
                        complete : function(data) {
                        	$(".k-loading-mask").hide();
                        }
                    },
                    create: {
                        url: "/common/editorImageCreate.do",
                        type: "POST",
                        complete : function(data) {
                        	$(".k-loading-mask").hide();
                        }
                    },
                    thumbnailUrl: "/common/editorImageThumbnail.do",
                    uploadUrl: "/common/editorImageUpload.do",
                    imageUrl: function(e){
                    	var imageBrowser = $(".k-imagebrowser").data("kendoImageBrowser");
                		var myFolder = imageBrowser.list.data("path");
                		var path1 = e.substring(0, e.lastIndexOf("/"));
                		var path2 = e.substring(e.lastIndexOf("/")+1);
                		var path = path1 + "/" + myFolder + "/" + path2
                    	return "/img/" + path;
                    }
                },
                path : "tech/",  //업무별로 파일이 경로를 다르게 한다.
                fileTypes: "*.gif,*.jpg,*.png,*.jpeg,*.bmp",
            },
			messages: {
			    bold: "Bold",
			    italic: "Italic",
			    underline: "Underline",
			    strikethrough: "Strikethrough",
			    superscript: "Superscript",
			    subscript: "Subscript",
			    justifyCenter: "Center text",
			    justifyLeft: "Align text left",
			    justifyRight: "Align text right",
			    justifyFull: "Justify",
			    insertUnorderedList: "Insert unordered list",
			    insertOrderedList: "Insert ordered list",
			    indent: "Indent",
			    outdent: "Outdent",
			    createLink: "Insert hyperlink",
			    unlink: "Remove hyperlink",

			    insertFile: "Insert file",
			    insertHtml: "Insert HTML",
			    fontName: "Select font family",
			    fontNameInherit: "(inherited font)",
			    fontSize: "Select font size",
			    fontSizeInherit: "(inherited size)",
			    formatBlock: "Format",
			    formatting: "Format",
			    style: "Styles",
			    viewHtml: "View HTML",
			    overwriteFile: "A file with name \"{0}\" already exists in the current directory. Do you want to overwrite it?",
			    imageWebAddress: "Web address",
			    imageAltText: "Alternate text",
			    fileWebAddress: "Web address",
			    fileTitle: "Title",
			    linkWebAddress: "Web address",
			    linkText: "Text",
			    linkToolTip: "ToolTip",
			    linkOpenInNewWindow: "Open link in new window",
			    dialogInsert: "Insert",
			    dialogUpdate: "Update",
			    dialogCancel: "Cancel",
			    dialogCancel: "Cancel",
			    createTable: "Create table",
			    addColumnLeft: "Add column on the left",
			    addColumnRight: "Add column on the right",
			    addRowAbove: "Add row above",
			    addRowBelow: "Add row below",
			    deleteRow: "Delete row",
			    deleteColumn: "Delete column"
			  },
			resizable: true,
			deserialization: {
	            custom: function(html) {
	                return html.replace(/(<\/?)b(\s?)/, "$1strong$2");
	            }
	        },
		});
	},

	editorRefresh : function() {
		$(".tech_editor").data("kendoEditor").refresh();
	},

	/*
	 * KendoUI editor 내용 불여넣기
	 */
	setEditorValue : function(_target, _content) {
		var editor = $("#" + _target).data("kendoEditor");
		editor.value(_content);
	},

	/*
	 * KendoUI editor 내용 초기화
	 */
	initEditor : function(_target) {
		this.setEditorValue(_target, "");
	},

	/*
	 * KendoUI combo box 단일 세팅
	 * _target : comboBox target ID
	 * _url : comboBox URL
	 * _appendCode : 조회된 data 외에 추가로 append할 데이터가 있을 경우 "Y"
	 * _appendData : "Y"일경우 추가될 data obj ex) {"codeNm" : "전체","codeId" : ""}
	 * _fetchCallback : comboBox가 그려진 후 데이터 셋팅 및 추가 작업이 필요할 경우 callback
	 *
	 */
	makeSingleComboBox : function(_target, _url, _appendCode, _appendData, _fetchCallback) {
		var excuteDataSource;

		var dataSource = new kendo.data.DataSource({
			transport: {
					read: {
						url: _url,
						dataType: "json"
					}
				},
				schema: {
		        	data	: "comCodeList",
		        }
		});

		dataSource.fetch(function(){
			if(_appendCode != undefined && _appendCode=="Y"){
				var data = dataSource.data();
				data.unshift(_appendData);
				excuteDataSource = data;
			}else{
				excuteDataSource = dataSource;
			}

			$("#" + _target).kendoComboBox({
				dataSource : excuteDataSource,
				dataTextField		: "codeNm",
				dataValueField		: "codeId",
				index				: 0,
				autoWidth			: true,
				autoBind 			: true
			});

			$("#" + _target).attr("readonly", true);

			if(_fetchCallback != undefined){
				_fetchCallback();
			}
		});
	},

	/*
	 * KendoUI combo box 복수 세팅
	 * _appendCode : 조회된 data 외에 추가로 append할 데이터가 있을 경우 "Y"
	 * _appendData : "Y"일경우 추가될 data obj ex) {"codeNm" : "전체","codeId" : ""}
	 * _fetchCallback : comboBox가 그려진 후 데이터 셋팅 및 추가 작업이 필요할 경우 callback
	 */
	makeMultiComboBox : function(_appendCode, _appendData, _fetchCallback) {
		$.each(techCommon.CODE_URL, function(key, value){
			var excuteDataSource;
			if($(".combo_" + key).length > 0){
				var dataSource = new kendo.data.DataSource({
					transport: {
							read: {
								url: value,
								dataType: "json"
							}
						},
						schema: {
				        	data	: "comCodeList",
				        }
				});

				dataSource.fetch(function(){
					if(_appendCode != undefined && _appendCode=="Y"){
						var data = dataSource.data();
						data.unshift(_appendData);
						excuteDataSource = data;
					}else{
						excuteDataSource = dataSource;
					}

					$(".combo_" + key).kendoComboBox({
						dataSource : excuteDataSource,
						dataTextField		: "codeNm",
						dataValueField		: "codeId",
						index				: 0,
						autoWidth			: true,
						autoBind 			: true
					});
					$(".combo_" + key).attr("readonly", true);

					if(_fetchCallback != undefined){
						_fetchCallback();
					}
				});
			}
		});
	},

	/*
	 * 제품군, 제품, 모델 선택 cascade 콤보박스
	 */
	makeProductCascadeComboBox : function(_parentGrp, _product, _model, _change) {
		$("#" + _parentGrp).kendoComboBox({
			dataTextField: "prodGrpNm",
			dataValueField: "prodGrpCd",
			dataSource:{
				transport: {
					read: {
						url			: "/tech/teis/productGroupListAjaxAction.do",
						dataType	: "json",
						cache		: false,
						data : {
							hospitalId : function(){
		          	    		return $("#hospitalId").val();
		          	    	}}
					}
				},
				schema: {data	: "list"}
			},
			change : _change
		}).data("kendoComboBox");
		$("#" + _parentGrp).data("kendoComboBox").input.attr("readonly", true);

		$("#" + _product).kendoComboBox({
			autoBind: false,
			cascadeFrom: _parentGrp,
		    dataTextField: "prodNm",
		    dataValueField: "prodCd",
		    dataSource:{
		    	transport: {
		    		read: {
		    			url			: "/tech/teis/productListComboAjax.do",
		    			dataType	: "json",
		    			cache		: false,
						data : {
							hospitalId :  $("#hospitalId").val()
							}
					}
				},
				schema: {data	: "list"}
		    },
		    change : _change
		}).data("kendoComboBox");
		$("#" + _product).data("kendoComboBox").input.attr("readonly", true);

		$("#" + _model).kendoComboBox({
			autoBind: false,
			cascadeFrom: _product,
			dataTextField: "modelNm",
			dataValueField: "mdlCd",
			dataSource:{
		    	transport: {
		    		read: {
		    			url			: "/tech/teis/modelListComboAjax.do",
		    			dataType	: "json",
		    			cache		: false,
						data : {
							hospitalId :  $("#hospitalId").val()
							}
					}
				},
				schema: {data	: "list"}
		    },
		    change : _change
		}).data("kendoComboBox");
		$("#" + _model).data("kendoComboBox").input.attr("readonly", true);
	},

	/**
     *  field를 지정할 수 있는 콤보박스 생성 함수
     *  argument 를 object 로 넘기면 콤보박스를 생성한다.
     *  target : 콤보박스 생성 위치
     *  url : 콤보박스 datasource uri
     *  data : json의 data key
     *  text : 콤보박스의 text
     *  value : 콤보박스의 value
     *  callback : 콤보박스 생성 후 콜백함수
        ex)
        var args = {
        	target : "combo_pgStatCd",
            url : "/tech/common/engineerInfoListAjax/R.do",
            data : "engineerList",
            param : {}
            text : "",
            value : "",
            callback : function(){},
            appendComboData : {
            	dataTextField명 : "",
            	dataValueField명 : ""
            }
        };

        techUtil.postForm(args);
    */
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
				autoBind 			: true
			});
			$("#" + arg.target).data("kendoComboBox").input.attr("readonly", true);
			if(arg.callback != undefined){
				arg.callback();
			}
		});
	},

	/*
	 * KendoUI combo box destroy
	 */
	destroyComboBox : function(_target) {
		var combobox = $("#" + _target).data("kendoComboBox");

		if(combobox != undefined) {
			combobox.destroy();
		}
	},

	/*
	 * KendoUI combo box select
	 */
	selectComboBox : function(_target, _value) {
		var combobox = $("#" + _target).data("kendoComboBox");
		combobox.value(_value);
		combobox.trigger("change");
	},

	selectComboBox2 : function(_target, _value ,_name) {
		var combobox = $("#" + _target).data("kendoComboBox");
		combobox.value(_value);
		combobox.text(_name);
		combobox.trigger("change");
	},


	/*
	 * KendoUI combo box event setting
	 */
	setEventComboBox : function(_target, _type, _event) {
		var combobox = $("#" + _target).data("kendoComboBox");
		combobox.bind(_type, _event);
	},

	/*
	 * KendoUI combo box enable, disable
	 */
	enableComboBox : function(_target, _flag) {
		var combobox = $("#" + _target).data("kendoComboBox");
		combobox.enable(_flag);
	},

	refreshComboBox : function(_target) {
		$("#" + _target).data("kendoComboBox").dataSource.read();
	},

	focusComboBox : function(_target) {
		var combobox = $("#" + _target).data("kendoComboBox");
		combobox.focus();
	},

	readOnlyComboBox : function(_target, _flag) {
		var combobox = $("#" + _target).data("kendoComboBox");
		combobox.input.attr("readonly", _flag)
	},

	/*
	 * KendoUI window open
	 */
	openWindow : function(_target) {
		$("#" + _target).data("kendoWindow").center().open();
	},

	/*
	 * KendoUI window close
	 */
	closeWindow : function(_target) {
		$("#" + _target).data("kendoWindow").close();
	},

	/*
	 * KendoUI window event setting
	 */
	setEventWindow : function(_target, _type, _event) {
		var window = $("#" + _target).data("kendoWindow");
		window.bind(_type, _event);
	},

	/*
	 * Alert 창
	 */
	alert : function(_msg, _callback) {
		kendo.alert(_msg).bind("close", function(){
			if("function" === typeof(_callback)){
				_callback();
			}
		});
	},

	/*
	 * Confirm 창
	 */
	confirm : function(_msg, _succFunc, _failFunc, _width) {
		var html = "<div id=\"_CONFIRM\"></div>";

		$("body").find("#_CONFIRM").remove();
	    $("body").append(html);

		if (_width == undefined) {
			_width = 300;
		}

		var confirm = $("#_CONFIRM").kendoConfirm({
			content	: _msg,
			width	: _width,
			messages:{
				okText: "OK",
				cancel: "CANCEL"
			}
		}).data("kendoConfirm").result.done(function(){
			if (_succFunc != undefined && _succFunc != '') {
				_succFunc();
			}
		}).fail(function(){
			if (_failFunc != undefined && _failFunc != '') {
				_failFunc();
			}
		});
	},

	/**
     *  post 형식으로 form 생성 후 submit
     *  argument 를 object 로 넘기면 form 을 생성하여 submit 한다.
     *  url는 서버 uri, params는 parameter
        ex)
        var args = {
            url : '/tech/hrts/hrTicketExcelDownAjax.do',
            params : {
                hdTicketNo : "T12321",
                pgStatusCd : "R"
            }
        };

        techUtil.postForm(args);
    */
	postForm : function(args) {
        var form = $('<form></form>');
        form.attr('action', args.url);
        form.attr('method', 'post');
        form.appendTo('body');

        if(args.params){
            for(var key in args.params){
                var value = args.params[key];
                form.append($('<input type="hidden" value="'+ value + '" name="' + key + '">'));
            }
        }

        form.submit();
    },

    /* Grid에서 현재 선택한 열에 포커스 */
    currentGridFocus : function(_target) {
    	var grid = $("#" + _target).data("kendoGrid");
    	var lastCell = grid.tbody.find("tr:last td:last");
    	grid.current(lastCell);
    	grid.table.focus();
    },


    /*
     * 저장된 첨부파일을 화면에 보여준다.
     * target : "attachFile",		//element id
	 * saveUrl : "/common/insertTempAttchFileAjax.do",	//saveUrl
	 * removeUrl : "/common/deleteTempAttchFileAjax.do",	//removeUrl
	 * saveFileNm : $("#savedFileAttr").data("savefilenm"),	//저장된 파일명
	 * originFileNm : $("#savedFileAttr").data("originfilenm"),	//오리지널 파일명
	 * fileExt : $("#savedFileAttr").data("fileext"), //파일확장자
	 * fileSize : $("#savedFileAttr").data("filesize"), //파일사이즈
	 * fileNo : $("#savedFileAttr").data("fileno"), //파일seq
	 * seq : $("#savedFileAttr").data("seq")		//업무단위파일seq
	 * exts : [".확장자명",".확장자명"]	//확장자validation (기본값 techCommon.GV.exts)
     * */
    attachedFilesView : function(param){
    	if(param.saveFileNm != undefined){
			var arr = new Array();

			var savedLen = 1;
			var data = {};
			var _autoUploadFlag = false;
			if(param.autoUploadFlag){
				_autoUploadFlag = true;
			}

			if(param.saveFileNm.indexOf(",") > -1){
				savedLen = param.saveFileNm.split(",").length;
				for(var i=0; i<savedLen; i++){
					data = new Object();
					data = {
							name : param.originFileNm.split(",")[i],
							extension : param.fileExt.split(",")[i],
							size : param.fileSize.split(",")[i],
							fileNo : param.fileNo.split(",")[i],
							state : "saved",
							seq : param.seq.split(",")[i],
							customIndex : i
					}
					arr.push(data);
				}
			}else{
				data = {
						name : param.originFileNm,
						extension : param.fileExt,
						size : param.fileSize,
						fileNo : param.fileNo,
						state : "saved",
						seq : param.seq,
						customIndex : 0
				}
				if(data.name != ""){
					arr.push(data);
				}
			}

			if(param.exts != undefined){
				techCommon.GV.exts = param.exts;
			}

			$("#"+param.target).kendoUpload({
				async : {
					saveUrl : param.saveUrl,
					removeUrl : param.removeUrl,
					autoUpload : _autoUploadFlag
				},
				validation : {
					allowedExtensions : techCommon.GV.exts,	//허용 확장자
					maxFileSize : techCommon.GV.size		//공통 파일사이즈 적용
					//maxFileSize : commonprop.fileupload.size	//공통 파일사이즈 적용
					//maxFileSize : techCommon.GV.size
				},
				files : JSON.parse(JSON.stringify(arr)),
				remove: function(e){
					e.preventDefault();
					var setData = e.files[0];
					setData.state = "delete";
					$("[data-uid="+setData.uid+"]").remove();

				},
				upload : function(e){
					e.sender.options.async.saveUrl = "/common/insertTempAttchFileAjax.do?tempSeq=" + param.tempFileSeq;
					e.sender.options.async.removeUrl = "/common/deleteTempAttchFileAjax.do?tempSeq=" + param.tempFileSeq;
				}
			});

		}

    },
    /**
     * 검색조건 date 초기값을 설정한다.
     * @param target	target element
     * @param day		현재날짜 - day 설정
     *  예)현재날짜로부터 3달전날짜 techUtil.setStartDate("stDate","90")
     *  예)현재날짜 techUtil.setStartDate("edDate","0")
     */
    setStartDate : function(target,day){
    	var toDate = new Date();
    	toDate.setDate(toDate.getDate()-Number(day));
    	var year = toDate.getFullYear();
    	var month = toDate.getMonth()+1;
    	var date = toDate.getDate();
    	if(Number(month) < 10 ){
    		month = "0"+month;
    	}
    	if(Number(date) < 10 ){
    		date = "0"+date;
    	}
    	$("#"+target).data("kendoDatePicker").value(year+"-"+month+"-"+date);
    	//$("#"+target).data("kendoDatePicker").options.change();
    },

    /* 첨부파일 다운로드 */
    fileDownload : function (_fileNo, _fileSeq) {
    	var args = {
    			url : "/common/fileDownload.do",
    			params : {__file_No : _fileNo, __file_Seq : _fileSeq}
    	};

    	this.postForm(args);
    },
    /*권역 콤보박스 생성*/
    makeRegionCombo : function(_target){
    	var argsR = {
				target : _target,
				url : "/tech/common/selectRegionComboBox.do",
				text : "regionNm",
				value : "regionCd",
				data : "regionList",
				param : {},
				appendComboData : {
					regionNm : $.gsisMsg('ts.common.msg.12'),
					regionCd : ""
				}
		};
		techUtil.makeCommonComboBox(argsR);

    },

    /* Kendo Upload file List */
    getKendoFileListJson : function(_fileTarget) {
    	if($("#" + _fileTarget).data("kendoUpload") != undefined) {
			//기존등록되어있던 첨부파일 삭제여부 판단
    		var savedAttach = $("#" + _fileTarget).data("kendoUpload").options;

			var savedAttachFiles = savedAttach.files.length;
			var fileData = null;
			var delCnt=0;

			var json = new Array() ;

			for (var i=0; i<savedAttachFiles; i++) {
				fileData = savedAttach.files[i];

				if(fileData.state == "delete"){
					var data = new Object();
					data.fileNo = fileData.fileNo;
					data.seq = fileData.seq;
					json.push(data);
				}
			}
			return JSON.stringify(json);
		}
    },

    /* Textarea 공백, 개행 처리 */
	replaceTextArea : function(_text) {
		_text = _text.replaceAll(/\n/g, '<br/>');
		_text = _text.replaceAll('\u0020', '&nbsp;');
		return _text;
	},

	/* Textarea XSS 체크 */
	checkXSS : function(_text)   {
		_text = _text.replace(/</g,'&lt;');
		_text = _text.replace(/>/g,'&gt;');
		_text = _text.replace(/\'/g, '');
		_text = _text.replace(/\"/g, '');
		_text = _text.replace(/\(/g, '&#40;');
		_text = _text.replace(/\)/g, '&#41;');
		return _text;
	},

	/* Textarea XSS 역치환 */
	unCheckXSS : function(untext)   {
		untext = untext.replace(/&lt;/g, '<');
		untext = untext.replace(/&gt;/g, '>');
		untext = untext.replace(/apos;/g, '\'');
		untext = untext.replace(/quot;/g, '\"');
		untext = untext.replace(/&#40;/g, '\(');
		untext = untext.replace(/&#41;/g, '\)');
		return untext;
	},

	stripHTMLtag : function(string) {
        var objStrip = new RegExp();
        objStrip = /[<][^>]*[>]/gi;

        string = string.replace(/<style[^>]*>(.*?)<\/style>/gi, "");
        string = string.replace(/[<][sS][tT][yY][lL][eE][^>]*[>][^>]*[sS][tT][yY][lL][eE][>]/gi,'');
        string = string.replace(/<br>/gi,'\n\n');
        string = string.replace(/<(\/)?[Pp](\/)?>/g,'');
        string = string.replace(objStrip, '');
        string = string.replace(/(\s*\n+\s*)+/gi,'\n\n');
        return string;
    }
}

/**
 * 기술지원 챠트 공통 함수
 */
var techChart = {
		/* Before Service chart */
		techBeforeServiceChart : function(opt) {
			console.log("opt::::",opt);
			console.log("opt.dataProvider::::",opt.dataProvider);
			AmCharts.makeChart( opt.target, {
				  "type": "gantt",
				  "theme": "light",
				  "marginRight": 70,
				  "period": "DD",
				  "dataDateFormat": "YYYY-MM-DD JJ:NN",
				  "columnWidth": 0.5,
				  "valueAxis": {
				    "type": "date"
				  },
				  "brightnessStep": 7,
				  "graph": {
				    "fillAlphas": 1,
				    "lineAlpha": 1,
				    "lineColor": "#fff",
				    "fillAlphas": 0.85,
				    "balloonText": "<b>[[bsSeqNo]] : [[srlNoCnt]]</b>건 <br />[[open]] - [[value]]"
				  },
				  "rotate": true,
				  "categoryField": "bsSeqNo",
				  "segmentsField": "segments",
				  "colorField": "color",
				  "startDateField": "stDate",
				  "endDateField": "edDate",
				  "dataProvider": opt.dataProvider,
				  "valueScrollbar": {
				    "autoGridCount": true
				  },
				  "chartCursor": {
				    "cursorColor": "#55bb76",
				    "valueBalloonsEnabled": false,
				    "cursorAlpha": 0,
				    "valueLineAlpha": 0.5,
				    "valueLineBalloonEnabled": true,
				    "valueLineEnabled": true,
				    "zoomable": false,
				    "valueZoomable": true
				  }
				} );
		},

		/* 제품군별 소유자 난수리티켓 현황 Chart */
		hrTicketStatisticsChartByOwner : function(opt) {
			AmCharts.makeChart(opt.target, {
				"type": "serial",
				"addClassNames": true,
				"theme": "light",
				"autoMargins": false,
				"marginLeft": 30,
				"marginRight": 8,
				"marginTop": 10,
				"marginBottom": 26,
				"balloon": {
					"adjustBorderColor": false,
					"horizontalPadding": 10,
					"verticalPadding": 8,
					"color": "#ffffff"
				},

				"dataProvider": opt.dataProvider,

				"legend": {
					visible: false,
					position: "bottom"
				},

				"valueAxes": [{
					visible: true,
					majorGridLines: {
					  visible: false
					}
				}],

				"startDuration": 1,

				"balloon": {
					"borderAlpha": 1,
					"borderThickness": 1,
					"fillAlpha": 1,
					"fillColor": "#f1f1f1"
				},

				"graphs": [{
					"alphaField": "alpha",
					"balloonText": "<span style='font-size:12px;'>[[category]] : <br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
					"lineColor": "#03a5e5",
					"fillColors": ["#03a5e5"],
					"gradientOrientation" :"horizontal",
					"fillAlphas": 1,
					"title": $.gsisMsg('ts.01.01.011.009'),
					"type": "column",
					"valueField": "value",
					"clustered": false,
					"columnWidth": 0.3,
					"labelText": "[[value]]"
				}, {
					"id": "graph2",
					"balloonText": "<span style='font-size:12px;'>평균 : <br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
					"bullet": "round",
					"bulletBorderAlpha": 1,
					"bulletColor": "#FFFFFF",
					"bulletSize": 5,
					"lineThickness": 1,
					"lineColor": "#de5834",
					"type": "line",
				    "title": $.gsisMsg('FS-02-03-003.27'),
				    "valueField": "avg",
				    "useLineColorForBulletBorder": true
				}],

				"categoryField": "ownerNm",

				"categoryAxis": {
					labels: {
						font: "12px sans-serif",
						color: "#464747",
						margin: {
							top: 0
						}
					},
					majorGridLines: {
						visible: false
					},
					majorTicks: {
						visible: false
					},
					line: {
						color: "#000000",
						width: 0.5
					}
				}
			});
		},

		/* 엔지니어별 티켓 현황 Chart */
		hrTicketProcessByEngineerChart : function(opt) {
			AmCharts.makeChart(opt.target, {
				"type": "serial",
				"addClassNames": true,
				"theme": "light",
				"autoMargins": false,
				"marginLeft": 30,
				"marginRight": 8,
				"marginTop": 10,
				"marginBottom": 26,
				"balloon": {
					"adjustBorderColor": false,
					"horizontalPadding": 10,
					"verticalPadding": 8,
					"color": "#ffffff"
				},

				"dataProvider": opt.dataProvider,

				"legend": {
					visible: false,
					position: "bottom"
				},

				"valueAxes": [{
					visible: true,
					majorGridLines: {
					  visible: false
					}
				}],

				"startDuration": 1,

				"balloon": {
					"borderAlpha": 1,
					"borderThickness": 1,
					"fillAlpha": 1,
					"fillColor": "#f1f1f1"
				},

				"graphs": [{
			        "balloonText": "[[title]] : <b>[[value]]</b>",
			        "fillAlphas": 1,
			        "lineAlpha": 0.2,
			        "title": $.gsisMsg('admin.userMgt.field.029'),//
			        "type": "column",
			        "valueField": "completeCnt"
			    }, {
			        "balloonText": "[[title]] : <b>[[value]]</b>",
			        "fillAlphas": 1,
			        "lineAlpha": 0.2,
			        "title": $.gsisMsg('passwordSearch.button.000'),
			        "type": "column",
			        "clustered":false,
			        "columnWidth":0.5,
			        "valueField": "reqCnt"
			    }],

			    "plotAreaFillAlphas": 0.1,
				"categoryField": "userNm",
				"categoryAxis": {
			        "gridPosition": "start"
			    }
			});
		}
}


function getVolume(fileSize){
	/** 파일 크기 구함.**/
		var kb = 1024;
		var mb = kb * 1024;
		var gb = mb * 1024;
		var volume = "Byte";

		/** 각 단위별로 계산 **/
		if(fileSize >= gb){			// 1GB 이상
			fileSize = parseFloat(fileSize / gb).toFixed(2);// + "GB";
			volume = "GB";
		}else if(fileSize >= mb){	// 1MB ~ 1023MB
			fileSize = parseFloat(fileSize / mb).toFixed(2);// + "MB";
			volume = "MB";
		}else if(fileSize >= kb){	// 1KB ~ 1023KB
			fileSize = parseFloat(fileSize / kb).toFixed(2);// + "KB";
			volume = "KB";
		}else{						// 0 ~ 1023 Byte
			fileSize = parseFloat(fileSize).toFixed(2);// + "Byte";
		}

		/** 파일크기가 xxx.00 이면 .00 지우고 xxx 로 표시 **/
		var lastIndexOf = String(fileSize).lastIndexOf(".");
		if(lastIndexOf > -1){
			fileSize = "00" == String(fileSize).substring(lastIndexOf + 1, fileSize.length) ? String(fileSize).substring(0, lastIndexOf) : fileSize;
			fileSize = fileSize + " " +  volume;
		}
		return fileSize;
}

function maintainSession(){
	/** 10분 주기로 세션 끊기지 않게 ajax 통신함. **/
	var temp = {"temp":"temp"};
	setInterval(function(){
		techUtil.techajaxJson({
			url:"/oc/maintainSession.do"
			,type:"POST"
			,data:JSON.parse(JSON.stringify(temp))
			,async:false
			,success:function(r){
				console.log("=================== MAINTAIN SESSION SUCCESS ===============");
			}
			,error:function(request, status, error){
				console.log("=================== MAINTAIN SESSION ERROR ===============");
				console.log("code",request.status);
				console.log("msg",request.responseText);
				console.log("error",error);
				console.log("=================== MAINTAIN SESSION ERROR ===============");
			}
		})
	}, 600000);
}