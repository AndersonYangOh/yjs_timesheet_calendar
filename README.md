# yjs_timesheet_calendar
研究院工时日历系统

##一、使用说明

该代码为工时系统采用的日历javascript前端，代码如下：

├─fonts								字体文件，用于显示日历里面的特殊符号
│      fontawesome-webfont.eot
│      fontawesome-webfont.svg
│      fontawesome-webfont.ttf
│      fontawesome-webfont.woff
│      fontawesome-webfont.woff2
│      FontAwesome.otf
│      
├─images								图形文件，图形资源
│  │  apple-touch-icon-retina.png
│  │  apple-touch-icon.png
│  │  favicon.ico
│  │  favicon.old.ico
│  │  grails-cupsonly-logo-white.svg
│  │  grails.svg
│  │  spinner.gif
│  │  
│  └─skin
│          database_add.png
│          database_delete.png
│          database_edit.png
│          database_save.png
│          database_table.png
│          exclamation.png
│          house.png
│          information.png
│          shadow.jpg
│          sorted_asc.gif
│          sorted_desc.gif
│          
├─javascripts							关键js文件
│      application.js						框架所需，串联js资源的总文件
│      bootstrap.bundle.min.js			开源bootstrap bundle包文件
│      bootstrap.js						开源bootstrap.js文件
│      footer.js							页面尾部引入的js片段
│      freelancer.min.js					开源freelancer.js文件
│      fullcalendar.min.js					开源freelancer.js文件
│      header.js							页面头部引入的js片段
│      html5shiv.min.js					用于兼容html5的文件
│      ie.js								ie兼容文件
│      jquery-1.11.1.min.js				开源jquery
│      jquery-2.2.0.min.js					开源jquery
│      jquery.min.js						开源jquery
│      jquery.mousewheel.min.js			开源jquery，鼠标滚轮响应包
│      moment.min.js					用于处理javascript moment对象
│      tsapp.js							time_sheet主js文件
│      tsappCalendar.js					time_sheet日历控制及相应
│      tsappOperation.js					time_sheet操作函数
│      
└─stylesheets							风格目录
        application.css
        bootstrap.css
        bootstrap.min.css
        errors.css
        font-awesome.min.css
        freelancer.min.css
        fullcalendar.min.css
        fullcalendar.print.min.css
        grails.css
        index.css
        main.css							主要风格定制class都在这个文件里
        mobile.css
        tsapp.css
## 二、实现功能

	渲染fullcalendar日历，我们进行了深度定制，使其显示月视图，并且每一格只有颜色标记

	定义切换事件，当日历切换时，将触发自动保存和重新渲染，这两个动作都是通过pjson与后台服务交互获取数据的

	滚轮分配，通过鼠标滚轮时间出发工时数的变化，同时兼容chrome和ie浏览器

	自动分配的计算，双击8小时，触发自动分配，当分配不能整除时，将余数优先分配给靠前的项目

	自动保存，检测日期的切换、浏览器的页面切换、页签切换、焦点切换、退出等事件，进行保存，确保数据不丢失
