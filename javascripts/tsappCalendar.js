//fullcalendar日期
$(function() {
            var now = $.fullCalendar.moment( new Date());
            var time = $.fullCalendar.moment( new Date());
			var myDate = time.format('YYYY年M月D日');
            var specifyDate = $("#Time").text().replace('年','-').replace('月','-').replace('日','');
            if (specifyDate != '--') time =  $.fullCalendar.moment(specifyDate,"YYYY-MM-DD");

			var calendarColorData;
			var lastSelectedtDay = null;
			var inGray = false;
            var overMonth = false;
            var defaultSelectDate = null;

			$('#calendar').fullCalendar({
				header: {
					left: '',          //prev,next（开关-月份切换）
					center: 'title',
					right: ''          //today（开关-月份切换）
				},
				monthNames: ["一月", "二月", "三月", "四月",
					"五月", "六月", "七月", "八月", "九月",
					"十月", "十一月", "十二月"
				],
				dayNamesShort: ["周日", "周一", "周二",
					"周三", "周四", "周五", "周六"
				],
				firstDay: 0,

				buttonText: {
					today: '本月',
					month: '月',
					week: '周',
					day: '日',
					prev: '上一月',
					next: '下一月'
				},
				defaultDate: time,
				navLinks: true,
				selectable: true,
				selectHelper: true,
				select: function(date) {
                    var dateDisplay = date.format('YYYY年M月D日');
                    var dateIndex = date.format('YYYY-MM-DD');
                    //console.log(date + '被选中');
                    if (calendarColorData[dateIndex] != 'gray') {
                        $("#Time").html(dateDisplay);
                        listProjectsOfDay(date);
                        //console.log('调用listProjectsOfDay');
                    }
				},
				dayClick:function(date) {
                    //点击时刷新项目工时信息
                    $('#calendar').fullCalendar('refetchEvents');
                    if ((lastSelectedtDay != date)) {
                        if (calendarColorData[date.format('YYYY-MM-DD')] != 'gray') {
                            lastSelectedtDay = date;
                            inGray = false;
                        } else inGray = true;
                    }
				},
                unselect: function(view, jsEvent) {
                    //pullBackToCurrentDay();
                    saveWorkingHours();
                },
                // next( event, element) {
				//     alert("===");
                // },
                eventAfterAllRender: function(view) {
				    if (defaultSelectDate != null) {
                        while (calendarColorData[defaultSelectDate.format('YYYY-MM-DD')] == 'gray') defaultSelectDate.add(1, 'days');    //跳过灰色的日期
                        if (defaultSelectDate.format('YYYYMM') == $.fullCalendar.moment(time).format('YYYYMM')) defaultSelectDate = $.fullCalendar.moment(time);
                        $('#calendar').fullCalendar('select', defaultSelectDate);
                        $('#calendar').fullCalendar('gotoDate', defaultSelectDate);
                        lastSelectedtDay = defaultSelectDate;
                    }

                    var m = $.fullCalendar.moment(time);
                    var jump = false;
                    if (lastSelectedtDay == null) {
                        jump = true;
                    } else m = $.fullCalendar.moment(lastSelectedtDay);
                    if (inGray||jump) {
                        if (!overMonth) {
                            lastSelectedtDay = m;
                            inGray= false;
                        }
                        $('#calendar').fullCalendar('select', m);
                        $('#calendar').fullCalendar('gotoDate', m);
                    }
                    $('.fc-content-skeleton table tr td a').click(function(){ return false });
                    $(".fc-corner-left").attr("disabled",false);        //启用按钮
                    $(".fc-corner-right").attr("disabled",false);
                },
				editable: true,
				eventLimit: true,
                //eventOverlap: false,
                unselectAuto: false,
                showNonCurrentDates:false,
                events: function(start, end, timezone, callback, allDay, date) {
                    $(".fc-corner-left").attr("disabled",true);         //禁用按钮
                    $(".fc-corner-right").attr("disabled",true);

                    defaultSelectDate = null;
                    var strStart = start.format('YYYYMM');
				    if (lastSelectedtDay!=null && (strStart != (lastSelectedtDay.format('YYYYMM'))) && (strStart <= $.fullCalendar.moment(now).format('YYYYMM'))) {
                        defaultSelectDate = start;
                    } else if (start > now) {
				        overMonth = true;
                        inGray = true;
                    } else {
                        overMonth = false;
                    }
                    var startParam = start.format('YYYY-MM');
                    $.ajax({
                        url: "../fillin/monthStatus.json?month=" +  startParam ,
                        //async: false, // 使用同步方式，不支持同步
                        dataType: 'json',
                        success: function(data) {
                            //console.log("color saved");
                            calendarColorData = data;       //保存
                            var events = [];
                            $.each(data, function(i, value) {
                                events.push({
                                    start: i,
                                    overlap: false,
                                    rendering: 'background',
                                    color: value
                                })
                            });
                            // console.log("1:" + events[0].start);
                            // console.log("2:" + startParam);
                            callback(events);
                        }
                    });
                }
            });
});
			