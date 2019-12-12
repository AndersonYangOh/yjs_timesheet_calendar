//工时分配减价
function  listProjectsOfDay(day) {
	if (!day) {
        var specifyDate = $("#Time").text().replace('年','-').replace('月','-').replace('日','');
        if (specifyDate != '--') day =  $.fullCalendar.moment(specifyDate,"YYYY-MM-DD").format("YYYY-MM-DD");
        else day =  $.fullCalendar.moment().format("YYYY-MM-DD");
    } else day = day.format("YYYY-MM-DD");
   	$(".schedule").empty();
	$.ajax({
				type: "get",
				url: "projectList?date=" + day ,
				async: false,
				success: function(data) {
				    var completeStyle = '';         //填报完成样式
                    var canNotAdStyle = '';         //不可加计扣除样式
				    var inputBoxClass = 'how-many-2';
					$.each(data, function(key, value) {
                        if (value['confirmed']) {
                            completeStyle = 'boxBG';
                            inputBoxClass = '';
                        }
                        else completeStyle = '';
                        if (value['autoAssign']) canNotAdStyle = '';
                        else canNotAdStyle = 'style="background: #e05858" title="注意：该项目不可加计扣除"';
						var curr =
                            '<div class="schedule-list '+ completeStyle +'">'+
                            '<div class="schedule-list-z">'+
                            '<ul>'+
                            '<li>' + value['projectName'] + '</li>'+
                            '<li>' + value['startDate'].substr(0,10) + "至" + value['endDate'].substr(0,10)  + "  (" +
								value['expendHours'] + '/'+ value['totalHours'] + ') ' +
								((value['status'] == '审核不通过')?('<a href="#" onclick="if (confirm(\'是否确认并提交修改？\')) saveCorrection(' + value['timeRecordId'] + ');"><i title="请按项目经理意见修改：'+ value['memo'] +'" class="fa fa-exclamation-circle warnIcon"></i></a>'):'') +
                                ((value['status'] == '已更正')?('<i title="已经按要求更正：'+ value['memo'] +'" class="fa fa-check warnIcon"></i>'):'') +
								'<span class="projectCode" style="display:none;">'+ value['projectCode'] +'</span>' +
                                '<span class="autoAssign" style="display:none;">'+ value['autoAssign'] +'</span></li>' +
                            '</ul>'+
                            '</div>'+
                            '<div class="schedule-list-y time-add">'+
                            '<ul>'+
                            '<li><i class="fa fa-sort-asc add" id="button' + key + '"></i></li>'+
                            '<li><input disabled type="number" class="how-many-2" '+ canNotAdStyle + ' name="value" id="input' + key + '" value="' + value['todayHours'] + '"/></li>'+
                            '<li><i class="fa fa-sort-desc remove" id="remove' + key + '"></i></li>'+
                            '</ul>'+
                            '</div>'+
                            '</div>';
                        $('.schedule').append(curr);

						$('#button' + key + "").click(function() {
							var v = $('#input' + key + "").val();
							v = parseFloat(v);
							$('#input' + key + "").val(v + 1);	//递增值0.5
                            refreshSum();
						});
						$('#remove' + key + "").click(function() {
							var v = $('#input' + key + "").val();
							v = parseFloat(v);
							if(v > 0) {
								$('#input' + key + "").val(v - 1);	//递减值0.5
                                refreshSum();
							}
						});
                        refreshSum();
					});
				},
        		error: function(data) {console.log(data.status);}
			});
	//灰色的禁用滚轮
    $("#hasClass").find(".boxBG").each(function(){
        $(this).find(".how-many-2").each(function(){
            $(this).removeClass("how-many-2")
        })
    });
}

function saveWorkingHours(showInfo) {
    //var url = "/fillin/update.json?projects=" + $("#updateString").text();
    $.ajax({
        type: "post",
        url: 'update.json',
        async: false, // 使用同步方式
        data: $("#updateString").text(),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
            if (showInfo) alert('保存成功');
            $('#calendar').fullCalendar('refetchEvents');
            //console.log(data.result);
        }, // 注意不要在此行增加逗号
        error: function(data) {console.log(data.status);}
    });
}

function saveCorrection(id) {
    saveWorkingHours();
    $.ajax({
        type: "get",
        url: 'correction.json?id=' + id,
        async: false, // 使用同步方式
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
            //alert('保存成功');
            $('#calendar').fullCalendar('refetchEvents');
            listProjectsOfDay()
            //console.log(data.result);
        } // 注意不要在此行增加逗号
    });
}

function refreshSum() {
    var zong = 8;
    var sum1 = 0;
    var sum2 = 0;
    var projectCode = '';
    var projectInfo = [];
    $(".schedule-list").each(function(k, v) {
    	sum1 = +$(this).find('input[name="value"]').val(); //+表示把 字符串的数字转换为 number的数字
        sum2 += sum1;
        projectCode = $('.projectCode').eq(k).html();
        projectInfo.push({
			date: $('#Time').text().replace('年','-').replace('月','-').replace('日',''),
			projectCode: projectCode,
            workingHours: sum1
		});
        $("#updateString").html(JSON.stringify(projectInfo));
    });
    var cha = zong - sum2;
    $('.zongji span').html(cha);
    if(cha == 0) {
        $('.add').css('pointer-events','none');
    } else {
        $('.add').css('pointer-events','initial');
    }
    $(".zongji i").show();
    if( cha == 8) {
         $(".zongji i").html('双击自动分配');
    }else{
        //$(".zongji i").html('双击还原');
        $(".zongji i").hide();
    }
}

function pullBackToCurrentDay() {
    var pbTime = $('#Time').text();
    pbTime = pbTime.replace('年','-').replace('月','-').replace('日','');
    var m = $.fullCalendar.moment(pbTime,"YYYY-MM-DD");
    alert(m);
    $('#calendar').fullCalendar('select', m);
    $('#calendar').fullCalendar('gotoDate', m);
}

//双击8
$(".zongji span").dblclick(function() {
    if($(".zongji span").html() == 8) {
//			var and = 16;
        var and = 8;
        var geshu = $(".schedule-list").length; //取得个数
        $(".schedule-list").each(function(k, v) {   //减去不自动分配的
            var autoAssign = $('.autoAssign').eq(k).html();
            if (autoAssign == 'false') geshu--;
        });
        var zheng = Math.floor(and / geshu); //取得整数
        var yu = and % geshu; //取得余数
        var autoAssignCount = 0;        //记录自动分配的个数
        $(".schedule-list").each(function(k, v) {
            var autoAssign = $('.autoAssign').eq(k).html();
            if (autoAssign == 'true') {         //跳过不自动分配的
                if(autoAssignCount < yu) {
    //					var num = (zheng + 1) * 0.5
                    var num = (zheng + 1)
                    $("#input" + k).val(num);
                } else {
    //					var num = zheng * 0.5
                    var num = zheng
                    $("#input" + k).val(num);
                }
                autoAssignCount ++;
            }
        });
        $(".zongji i").empty();
        //$(".zongji i").append("双击还原");
        $(".zongji span").empty(); //清空8
        $(".zongji span").append(0); //追加0
        $('.add').css('pointer-events', 'none');
    }else{
        // $(".zongji i").empty();
        // $(".zongji i").append("双击自动分配");
        // $(".zongji span").html(8);
        // $("input").val(0);
        // $('.add').css('pointer-events', 'initial');
    }
    refreshSum();
});


function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}

$(function() {
    //滚轮事件
   /* $(".boxBG").mousewheel (function(event) {
        return false;
    });*/
    $(document).on("mousewheel", ".how-many-2", function(event) {
        event=event || window.event;
        var zong = 8;
        var sum2 = 0;
        $(".schedule-list").each(function(k, v) {
            sum2 += +$(this).find('input[name="value"]').val();
        });
        //$('.zongji span').html(cha);
        //console.log(event.originalEvent.wheelDelta);
        if(event.originalEvent.wheelDelta > 0) {
            console.log(event.currentTarget);
            var cha = zong - sum2 - 1;
            if(cha >= 0){
                //$('.zongji span').html(cha);
                this.value = parseInt(this.value) + 1;
                if(cha == 0){
                    $('.add').css('pointer-events', 'none');
                }else{
                    $('.add').css('pointer-events', 'inherit');
                }
            }
        } else {
            if(parseInt(this.value) > 0) {
                var cha = zong - sum2 + 1;
                //$('.zongji span').html(cha);
                this.value = parseInt(this.value) - 1;
            }
        }
        refreshSum();
        return false;
    });
});

