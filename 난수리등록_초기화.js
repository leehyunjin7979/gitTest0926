var CURRENT_SRL_NO = null;

var hrTicketForm = {


    init : function(){
                hrTicketForm.setInitDefault();
                hrTicketForm.setInitEvent();
                var tsAuth = $("#tsAuth").val();
                var combosrlno =   $("#combo_srlNo").val();
                //20180502  mod -  유재희 차장 요청으로 HQ인 경우도 저장버튼 노출되도록 처리
                /*if(tsAuth=="HQ")
                {
                    $("#ticket_save").hide();
                    $("#temp_ticket_save").hide();
                }*/
                if(combosrlno!=''){
                $("#sn_search_btn").trigger("click");
                }
            },

---hrTicketForm.setInitDefault();
         /*
		 * 초기 화면 설정
		 */
		setInitDefault : function() {
            //1 
            this.makeComboBox();
            //2
			this.makeEditor();

            //3
			this.setProcessRequestInfo($("#combo_reqTypeCd").val());

			//4 첨부파일
			this.makeUploadView();
			//techCommon.kendoFile("hrTicketFile", "hrTicketFileTempSeq");

			//5 raonupload 이벤트 호출
			raonUploadSetting("uploadHolder1","kupload1");
        },



        // 1 
        /*
		 * 콤보박스 만들기
		 */
		makeComboBox : function(){			
            //요청타입  ts.common.msg.13=Select
            //이관구분 코드
			//rctRcCd : "/common/getComCodeAjax.do?codeGroupId=T001&searchType=ALL1",
			//요청타입 코드
			//reqTypeCd : "/common/getComCodeAjax.do?codeGroupId=T002&searchType=ALL1",
			//진행상태 코드
			//pgStatCd : "/common/getComCodeAjax.do?codeGroupId=T003&searchType=ALL1",
			//장애유형 코드
			//errTypeCd : "/common/getComCodeAjax.do?codeGroupId=T007&searchType=ALL1",
			techUtil.makeSingleComboBox("combo_reqTypeCd", techCommon.CODE_URL.reqTypeCd, "Y", {codeNm : techCommon.MSG.select, codeId : ""}, function(e){
				//요청타입에 따른 처리요청정보 화면 세팅
				techUtil.setEventComboBox("combo_reqTypeCd", "change", function(e){
					var _value = this.value();
					hrTicketForm.setProcessRequestInfo(_value);
                });
                /* KendoUI combo box event setting
                setEventComboBox : function(_target, _type, _event) {
                    var combobox = $("#" + _target).data("kendoComboBox");
                    combobox.bind(_type, _event);
                },
                */
                /*
               setProcessRequestInfo : function(_reqTypeCd) {
                if (_reqTypeCd == "S") {
                    $("#non_site_plan").hide();
                    $("#site_plan").show();
                    techUtil.initEditor("cfmContent");
                    techUtil.setEditorValue("sitePlanContent", this._contents.S);
                } else {
                    $("#non_site_plan").show();
                    $("#site_plan").hide();
    
                    techUtil.initEditor("sitePlanContent");
                }
                },*/ 

            });
     
       /*
	 * KendoUI combo box 단일 세팅
	 * _target : comboBox target ID
	 * _url : comboBox URL
	 * _appendCode : 조회된 data 외에 추가로 append할 데이터가 있을 경우 "Y"
	 * _appendData : "Y"일경우 추가될 data obj ex) {"codeNm" : "전체","codeId" : ""}
	 * _fetchCallback : comboBox가 그려진 후 데이터 셋팅 및 추가 작업이 필요할 경우 callback
	  
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
        */


			//장애유형
			techUtil.makeSingleComboBox("combo_errTypeCd", techCommon.CODE_URL.errTypeCd, "Y", {codeNm : techCommon.MSG.select, codeId : ""}, function(e){
				//장애유형에 따른 화면내용 세팅
				techUtil.setEventComboBox("combo_errTypeCd", "change", function(e){
					var _value = this.value();
					if (_value == "E") {
						techUtil.setEditorValue("cfmContent", hrTicketForm._contents.E);
					} else if (_value == "P") {
						techUtil.setEditorValue("cfmContent", hrTicketForm._contents.P);
					} else if (_value == "D") {
						techUtil.setEditorValue("cfmContent", hrTicketForm._contents.D);
					} else {
						techUtil.setEditorValue("cfmContent", "");
					}
				});
			});

			//The reason for site plan
			techUtil.makeSingleComboBox("combo_sitePlanResnCd", techCommon.CODE_URL.sitePlanResnCd);

			//제품군, 제품, 모델 cascade combo
			techUtil.makeProductCascadeComboBox("combo_prodGrpCd", "combo_prodCd", "combo_mdlCd", function(){
				if(CURRENT_SRL_NO != null) {
					if($("#combo_srlNo").data("kendoComboBox")) {
						$("#combo_srlNo").data("kendoComboBox").wrapper.remove();

						var srlNoInput = '<input id="combo_srlNo" calss="k-textbox" name="srlNo" />';
						$("#srlNo_btn_group").prepend(srlNoInput);
						$("#combo_srlNo").kendoAutoComplete({
							animation: false
						});
					}
				}
				//$("#getProdGrpCd").val($("#combo_prodGrpCd").data("kendoComboBox").value());
			});

			//요청자

			var _reqUserCorpId = $("#reqUserCorpId").val();

			var argsR = {
					target : "combo_reqUserId",
					url : "/tech/common/engineerInfoListAjax/R.do",
					param : {userGbCd : techCommon.GV.userGbCd, reqUserCorpId : _reqUserCorpId},
					data : "engineerList",
					text : "userNm",
					value : "userNo",
					callback : function() {
					},
					appendComboData : {
						"userNm" : techCommon.MSG.select,
						"userNo" : ""
					}
			};
			techUtil.makeCommonComboBox(argsR);
		},

        //2
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

        //3   this.setProcessRequestInfo($("#combo_reqTypeCd").val());
        /*
		 * 요청 타입에 따른 처리요청정보 화면 제어
		 */
		setProcessRequestInfo : function(_reqTypeCd) {
			if (_reqTypeCd == "S") {
				$("#non_site_plan").hide();
				$("#site_plan").show();
				techUtil.initEditor("cfmContent");
				techUtil.setEditorValue("sitePlanContent", this._contents.S);
			} else {
				$("#non_site_plan").show();
				$("#site_plan").hide();

				techUtil.initEditor("sitePlanContent");
			}
		},


        //4  this.makeUploadView();        
        /*첨부파일 등록/수정 시 구분하면 화면을 만든다.*/

		makeUploadView : function(){
			var editFlag = true;	//티켓번호를 찍고 들어온 경우

			if(!Boolean($("#viewChk_hdTicketNo").val())){
				editFlag = false; //신청으로 들어온 경우
			}

			if(editFlag){		//수정
				var data = {
						fileNo : $("#hrTicketFileNo").val()
				}
				techCommon.ajax("/tech/hrts/selectAttachFileInfoAjax.do","json",data,function(resultData){
					if(resultData.fileUpdateInfo == null){	//파일정보가 없을 경우
                        techCommon.kendoFile("hrTicketFile", "hrTicketFileTempSeq");   -->>>>                      
                        /* KendoUi 첨부파일 */
                        // kendoFile : function(_target, _fileNo,_autoFlag) {
                        //     //파일업로드 , 임시첨부파일 그룹번호 조회
                        //     var _tempFileSeq = techCommon.getAttachFileSeqAjax();
                        //     var _flag=true;
                        //     if(_autoFlag != undefined){
                        //         _flag = _autoFlag;
                        //     }
                        //     $("#" + _fileNo).val(_tempFileSeq);
                        //     $("#" + _target).kendoUpload({
                        //         async : {
                        //             saveUrl : "/common/insertTempAttchFileAjax.do",
                        //             removeUrl : "/common/deleteTempAttchFileAjax.do",
                        //             autoUpload : _flag
                        //         },
                        //         validation : {
                        //             allowedExtensions : techCommon.GV.exts,	//허용 확장자
                        //             maxFileSize : techCommon.GV.size	//공통 파일사이즈 적용
                        //         },
                        //         upload : function(e){
                        //             e.sender.options.async.saveUrl = "/common/insertTempAttchFileAjax.do?tempSeq=" + _tempFileSeq;
                        //             e.sender.options.async.removeUrl = "/common/deleteTempAttchFileAjax.do?tempSeq=" + _tempFileSeq;
                        //         }
                        //     });
                        // }
					}else{
						var rData = resultData.fileUpdateInfo;
						var _tempFileSeq = techCommon.getAttachFileSeqAjax();
						$("#hrTicketFileTempSeq").val(_tempFileSeq);

						techUtil.attachedFilesView({
							target : "hrTicketFile",		//element id
							saveUrl : "/common/insertTempAttchFileAjax.do",	//saveUrl
							removeUrl : "/common/deleteTempAttchFileAjax.do",	//removeUrl
							saveFileNm : rData.saveFileNm,	//저장된 파일명
							originFileNm : rData.originFileNm,	//오리지널 파일명
							fileExt : rData.fileExt, //파일확장자
							fileSize : rData.fileSize, //파일사이즈
							fileNo : rData.fileNo, //파일seq
							seq : rData.seq,		//업무단위파일seq
							autoUploadFlag : true,
							tempFileSeq : _tempFileSeq
						});
					}
				});
			}else{	//등록
				techCommon.kendoFile("hrTicketFile", "hrTicketFileTempSeq");
			}
        },
        
        /*        
		 기술지원 Ajax		
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
        */

        /*
		 파일업로드 , 임시첨부파일 그룹번호 조회		
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
		}, */
