'use strict';

/* Controllers */

var CAControllers = angular.module('CAControllers', []);

CAControllers.controller('TimeCtrl', ['$scope',
    function ($scope){

    }
]);

CAControllers.controller('TimetableCtrl', ['$scope',
    function ($scope){
        document.getElementById("NavTitle").innerHTML = "Catherine ♥︎ Ant"

        $scope.today = Date.today().toString('ddd MMM dd yyyy');

        $scope.getUpAt = ""
        if (Date.today().addDays(1).is().monday()) {
            $scope.getUpAt = "7 AM😬";
        } else if (Date.today().addDays(1).is().weekday()) {
            $scope.getUpAt = "6 AM😪";
        } else {
            $scope.getUpAt = "WHENEVER🌝";
        }

        $scope.isMinimumDay = "NO😑";

        $scope.nextHoliday = "";
        if (!Date.today().addDays(1).is().weekday()) {
            $scope.nextHoliday = "TOMORROW💃🏻💃🏻💃🏻"
        } else if (!Date.today().addDays(2).is().weekday()) {
            $scope.nextHoliday = "2 days😃"
        } else {
            var d = new Date();
            //得到1970年一月一日到现在的秒数
            var len = d.getTime();
            //本地时间与GMT时间的时间偏移差
            var offset = d.getTimezoneOffset() * 60000;
            //得到现在的格林尼治时间
            var utcTime = len + offset;
            // 洛杉矶时间
            var currentDate = new Date(utcTime + 3600000 * -7);
            var dayDif = parseInt((Date.today().next().saturday().getTime() - currentDate.getTime()) /  1000  /  60  /  60  / 24)
            $scope.nextHoliday = dayDif + " days😃"
        }
    }
]);

CAControllers.controller('HomeworkCtrl', ['$scope', '$wilddogArray', "$window",
    function ($scope, $wilddogArray, $window){
        document.getElementById("NavTitle").innerHTML = "Catherine ♥︎ Ant"

        var ref = new Wilddog("https://chengkang.wilddogio.com/homework");

        $scope.switchTab = function(tabIndex) {
            var todoDom = $('#todo');
            var doneDom = $('#done');
            var lateDom = $('#late');

            var tab1 = $('#tab1');
            var tab2 = $('#tab2');
            var tab3 = $('#tab3');

            console.info("Tab Switched!");
            if (tabIndex == 0) {
                tab1.attr('class', 'is-active');
                tab2.attr('class', '');
                tab3.attr('class', '');

                todoDom.show();
                doneDom.hide();
                lateDom.hide();
            } else if (tabIndex == 1) {
                tab1.attr('class', '');
                tab2.attr('class', 'is-active');
                tab3.attr('class', '');

                todoDom.hide();
                doneDom.show();
                lateDom.hide();
            } else if (tabIndex == 2) {
                tab1.attr('class', '');
                tab2.attr('class', '');
                tab3.attr('class', 'is-active');

                todoDom.hide();
                doneDom.hide();
                lateDom.show();
            }
        };

        var selectedHomeworkId = "";
        $scope.showModal = function (homework) {
            console.log(homework);

            var modal = $("#modal");
            // var title = $("#modal-title");
            var content = $("#modal-content");
            var editBtn = $("#edit-btn");

            selectedHomeworkId = homework.$id

            content.html("<strong>Subject:</strong>&nbsp;&nbsp;&nbsp;&nbsp;"+homework.subject+"<br><strong>Content:</strong>&nbsp;&nbsp;&nbsp;&nbsp;"+homework.content+"<br><strong>Deadline:</strong>&nbsp;&nbsp;&nbsp;&nbsp;"+homework.deadline);
            modal.attr("class", "modal is-active");

            editBtn.attr("href", "#homework-edit/id="+homework.$id)
        }

        $scope.hideModal = function () {
            var modal = $("#modal");
            modal.attr("class", "modal");
        }

        $scope.markDone = function () {
            ref.child(selectedHomeworkId).update({"done":"YES", "doneAt":Wilddog.ServerValue.TIMESTAMP});
            // $scope.hideModal();
            $window.location.href = "#homework";
        }

        $scope.deleteHomework = function () {
            ref.child(selectedHomeworkId).remove();
            // $scope.hideModal();
            $window.location.href = "#homework";
        }

        $scope.getTimeText = function (dateText) {

            var d = new Date();
            //得到1970年一月一日到现在的秒数
            var len = d.getTime();
            //本地时间与GMT时间的时间偏移差
            var offset = d.getTimezoneOffset() * 60000;
            //得到现在的格林尼治时间
            var utcTime = len + offset;
            // 洛杉矶时间
            var currentDate = new Date(utcTime + 3600000 * -7);

            if (dateText.length > 10) {
                dateText = dateText.substring(0,10) + "T" + dateText.substring(11)
            }

            var dayDif = parseInt((Date.parse(dateText).getTime() - currentDate.getTime()) /  1000  /  60  /  60  / 24)

            if (dayDif > 1) {
                return dayDif + " days left"
            } else if (dayDif == 1) {
                return "Tomorrow"
            } else if (dayDif == 0) {
                return "Today"
            } else {
                return -dayDif + " days ago"
            }
        }

        $scope.getStatus = function (dateText) {

            var d = new Date();
            //得到1970年一月一日到现在的秒数
            var len = d.getTime();
            //本地时间与GMT时间的时间偏移差
            var offset = d.getTimezoneOffset() * 60000;
            //得到现在的格林尼治时间
            var utcTime = len + offset;
            // 洛杉矶时间
            var currentDate = new Date(utcTime + 3600000 * -7);

            if (dateText.length > 10) {
                dateText = dateText.substring(0,10) + "T" + dateText.substring(11)
            }

            var dayDif = parseInt((Date.parse(dateText).getTime() - currentDate.getTime()) /  1000  /  60  /  60  / 24)

            if (dayDif > 1) {
                return "nohurry"
            } else if (dayDif >= 0) {
                return "tight"
            } else {
                return "late"
            }
        }
        
        // 创建一个同步数组
        $scope.todo = $wilddogArray(ref.orderByChild("done").equalTo("NO"));
        $scope.done = $wilddogArray(ref.orderByChild("done").equalTo("YES"));

        $scope.todoList = [];
        $scope.doneList = [];
        $scope.lateList = [];
        
        $scope.todo.$loaded().then(function () {
            //to make sure that $scope.blogs is already loaded, otherwise length doesn't exist

            $scope.todoList = [];
            $scope.lateList = [];

            for(var i=0;i<$scope.todo.length;i++){
                var dateText = $scope.todo[i].deadline
                if (dateText.length > 10) {
                    dateText = dateText.substring(0,10) + "T" + dateText.substring(11)
                }
                $scope.todo[i].timestamp = Date.parse(dateText).getTime()

                var status = $scope.getStatus($scope.todo[i].deadline);
                if (status == "late") {
                    $scope.lateList.push($scope.todo[i]);
                } else if (status == "nohurry") {
                    $scope.todo[i].nohurry = true
                    $scope.todoList.push($scope.todo[i]);
                } else {
                    $scope.todo[i].nohurry = false
                    $scope.todoList.push($scope.todo[i]);
                }
            }
        });
        $scope.done.$loaded().then(function () {
            $scope.doneList = [];

            for(var i=0;i<$scope.done.length;i++){
                var dateText = $scope.done[i].deadline
                if (dateText.length > 10) {
                    dateText = dateText.substring(0,10) + "T" + dateText.substring(11)
                }
                $scope.done[i].timestamp = Date.parse(dateText).getTime()

                $scope.doneList.push($scope.todo[i]);
            }
        });
    }
]);

CAControllers.controller('HomeworkNewCtrl', ['$scope', '$wilddogArray', "$window",
    function ($scope, $wilddogArray, $window){
        
        var ref = new Wilddog("https://chengkang.wilddogio.com/homework");
        // 创建一个同步数组
        $scope.homeworks = $wilddogArray(ref);

        $scope.addHomework = function() {
            $scope.homeworks.$add({
                subject: $scope.subject,
                deadline:$scope.deadline,
                content: $scope.content,
                done:"NO",
                createAt:Wilddog.ServerValue.TIMESTAMP,
            });

            $window.location.href = "#homework";
        };
    }
]);

CAControllers.controller('HomeworkEditCtrl', ['$scope', '$wilddogObject', "$window", "$routeParams",
    function ($scope, $wilddogObject, $window, $routeParams){
        
        var ref = new Wilddog("https://chengkang.wilddogio.com/homework/"+$routeParams.id);
        // 创建一个同步数组
        var data = $wilddogObject(ref);

        data.$bindTo($scope,"homework")
    }
]);


CAControllers.controller('OptionCtrl', ['$scope', "OptionService", "AuthService",
    function ($scope, OptionService, AuthService){
        $scope.option =  OptionService.basic();
        $scope.AuthService = AuthService;

        $scope.option.$loaded().then(function () {
            $scope.l = CONFIG_LANG[$scope.option.language==undefined?"en":$scope.option.language];
        });


    }
]);

CAControllers.controller('BlogListCtrl', ['$scope', "BlogService", "OptionService",
	function ($scope, BlogService, OptionService){
        $scope.current_page = 1;
        $scope.count = 0;
        $scope.perpage = 10;

        $scope.blogs = BlogService.getAll();

        $scope.blogs.$loaded().then(function () {
            //to make sure that $scope.blogs is already loaded, otherwise length doesn't exist
            $scope.count = $scope.blogs.length;
        });

        $scope.totalPage = function() {
            //if $scope.count==0, means at this moment the data hasn't been loaded.
            return $scope.count==0?1:Math.ceil($scope.count/$scope.perpage);
        }

        //currentN is the number of articles of the current page.
        $scope.currentN = function() {
            var n = $scope.count - ($scope.current_page-1)*$scope.perpage;
            return n>=10?10:n;
        }

        $scope.hasPrev = function() {
            return $scope.current_page==1?false:true;
        }

        $scope.hasNext = function() {
            return $scope.totalPage()==$scope.current_page?false:true;
        }

        $scope.prevPage = function() {
            if(($scope.current_page--)<1){
                $scope.current_page = 1;
            }
        }

        $scope.nextPage = function() {
            if(($scope.current_page++)>$scope.totalPage()){
                $scope.current_page = $scope.totalPage();
            }
        }

        $scope.range = function(n) {
            return new Array(n);
        };

        $scope.BlogService = BlogService;

        var page_name = "HOME";
        var site_name = OptionService.setSiteTitle(page_name);
        OptionService.setCurrentNav("home");
    }
]);


CAControllers.controller('BlogDetailCtrl', ['$scope', "$location", "BlogService", "OptionService", "$sce", "$routeParams",
	function ($scope, $location, BlogService, OptionService, $sce, $routeParams){
        $scope.trustAsHtml = $sce.trustAsHtml;
        $scope.location = $location;
        $scope.blogs =  BlogService.getAll();

        $scope.toggleDuoshuoComments = function(container,blog){
            var el = document.createElement('div');//该div不需要设置class="ds-thread"
            el.setAttribute('data-thread-key', blog.$id);//必选参数
            el.setAttribute('data-url', $location.absUrl());//必选参数
            el.setAttribute('data-title', blog.title);//可选参数
            DUOSHUO.EmbedThread(el);
            $(container).html("");
            $(container).append(el);
        }

        $scope.blogs.$loaded().then(function () {
            $scope.blog = $scope.blogs.$getRecord($routeParams.blogId);
            var page_name = $scope.blog.title;
            var site_name = OptionService.setSiteTitle(page_name);
            OptionService.setCurrentNav("");
        });
    }
]);


CAControllers.controller('BlogPostCtrl', ['$scope', "OptionService", "BlogService", "$window",
	function ($scope, OptionService, BlogService, $window){
        $scope.allCats = BlogService.getAllCats();
        $scope.allTags = BlogService.getAllTags();

		$scope.title = "";
		$scope.cat = "";
		$scope.tags = "";
		$(editor.getElement('editor').body).html("");
		$($(editor.getElement('previewer').body).children()[0]).html("");

        $scope.selectCat = function(catname) {
            $scope.cat = catname;
        }

        $scope.addTag = function(tagname) {
            $scope.tags += " "+tagname;
        }

        $scope.clearCat = function() {
            $scope.cat = $scope.cat.split(' ')[0].toUpperCase();
        }

        $scope.clearTags = function() {
            $scope.tags = $.trim($scope.tags.toLowerCase());
        }

		$scope.newBlog = function() {
            var raw_content = $(editor.getElement('editor').body).html();
            editor.preview();
            var content = $($(editor.getElement('previewer').body).children()[0]).html();
            if( $scope.title != "" && raw_content != ""){
                var blogsRef = new Firebase("https://github-pages.firebaseio.com/users/"+CONFIG_UID+"/blogs/");
                var date = new Date().getTime();
                var id = date;

                $scope.clearTags();
                $scope.clearTags();
                var cat = $scope.cat==""?"uncategorized":$scope.cat;
                var tags = $scope.tags;
                blogsRef.child(""+id).set({
                    title: $scope.title,
                    content: content,
                    raw_content: raw_content,
                    date: date,
                    snippet: "",
                    cat: cat,
                    tags: tags,
                });
                $scope.title = "";
                $(editor.getElement('editor').body).html("")
				$($(editor.getElement('previewer').body).children()[0]).html("");
                BlogService.refreshData();
                $window.location.href = "#/p="+id
            }
	    };

        var page_name = "NEW";
        var site_name = OptionService.setSiteTitle(page_name);
        OptionService.setCurrentNav("");
    }
]);


CAControllers.controller('BlogEditCtrl', ['$scope', "OptionService", "BlogService", "$window", "$firebaseObject", "$sce", "$routeParams",
	function ($scope, OptionService, BlogService, $window, $firebaseObject, $sce, $routeParams){
        var blogRef = new Firebase("https://github-pages.firebaseio.com/users/"+CONFIG_UID+"/blogs/"+$routeParams.blogId);
        var blog =  $firebaseObject(blogRef);

        $scope.title = "";
        $scope.cat = "";
        $scope.tags = "";
        $scope.allCats = BlogService.getAllCats();
        $scope.allTags = BlogService.getAllTags();

        $scope.selectCat = function(catname) {
            $scope.cat = catname;
        }

        $scope.addTag = function(tagname) {
            $scope.tags += " "+tagname;
        }

        $scope.clearCat = function() {
            $scope.cat = $scope.cat.split(' ')[0].toUpperCase();
        }

        $scope.clearTags = function() {
            $scope.tags = $scope.tags==undefined?"":$.trim($scope.tags.toLowerCase());
        }

		blog.$loaded()
		  .then(function(data) {
	  		$scope.blog = data;
			$scope.title = $scope.blog.title;
			$scope.cat = $scope.blog.cat;
			$scope.tags = $scope.blog.tags;
	        $(editor.getElement('editor').body).html(data.raw_content);

		  })
		  .catch(function(error) {
		    console.error("Error:", error);
		  });

		$scope.editBlog = function() {
            var raw_content = $(editor.getElement('editor').body).html();
            editor.preview();
            var content = $($(editor.getElement('previewer').body).children()[0]).html();
            if( $scope.title != "" && raw_content != ""){
                var date = new Date().getTime();

                $scope.clearCat();
                $scope.clearTags();
                var cat = $scope.cat==""?"UNCATEGORIZED":$scope.cat;
                var tags = $scope.tags;
                blog.title = $scope.title;
                blog.content = content;
                blog.raw_content = raw_content;
                blog.date = date;
                blog.cat = cat;
                blog.tags = tags;
                blog.$save();
                $(editor.getElement('editor').body).html("");
                BlogService.refreshData();
                $window.location.href = "#/p="+blog.$id;
            }
	    };

        var page_name = "EDIT";
        var site_name = OptionService.setSiteTitle(page_name);
        OptionService.setCurrentNav("");
    }
]);


CAControllers.controller('CatAllCtrl', ['$scope', "BlogService", "OptionService",
	function ($scope, BlogService, OptionService){
        $scope.cats = BlogService.getAllCats();
//        $scope.catMax = BlogService.getCatMax();
        $scope.BlogService = BlogService;

        var page_name = "CATEGORIES";
        var site_name = OptionService.setSiteTitle(page_name);
        OptionService.setCurrentNav("cats");
    }
]);

CAControllers.controller('CatOneCtrl', ['$scope', "BlogService", "OptionService", "$routeParams",
	function ($scope, BlogService, OptionService, $routeParams){
        $scope.cats = BlogService.getAllByCat();
        $scope.catname = $routeParams.catname;

        $scope.years = {};

        var page_name = $routeParams.catname;
        var site_name = OptionService.setSiteTitle(page_name);
        OptionService.setCurrentNav("");
    }
]);

CAControllers.controller('TagAllCtrl', ['$scope', "BlogService", "OptionService",
	function ($scope, BlogService, OptionService){
        $scope.tags = BlogService.getAllTags();
//        $scope.tagMax = BlogService.getTagMax();
        $scope.BlogService = BlogService;

        var page_name = "TAGS";
        var site_name = OptionService.setSiteTitle(page_name);
        OptionService.setCurrentNav("tags");
    }
]);

CAControllers.controller('TagOneCtrl', ['$scope', "BlogService", "OptionService", "$routeParams",
	function ($scope, BlogService, OptionService, $routeParams){
        $scope.tags = BlogService.getAllByTag($routeParams.tagname);
        $scope.tagname = $routeParams.tagname;

        $scope.years = {};

        var page_name = $routeParams.tagname;
        var site_name = OptionService.setSiteTitle(page_name);
        OptionService.setCurrentNav("");
    }
]);

CAControllers.controller('ArchiveCtrl', ['$scope', "BlogService", "OptionService",
	function ($scope, BlogService, OptionService){
        $scope.blogs = BlogService.getAll();

        $scope.years = {};

        $scope.deleteBlog = function(blog) {
            $scope.blogs.$remove(blog);
        }

        var page_name = "ARCHIVES";
        var site_name = OptionService.setSiteTitle(page_name);
        OptionService.setCurrentNav("archives");
    }
]);

CAControllers.controller('ConfigCtrl', ['$scope', "$window", "AuthService", "OptionService", "$firebaseObject",
    function ($scope, $window, AuthService, OptionService, $firebaseObject){
        $scope.OptionService = OptionService;
        var basic = OptionService.basic();
        
        basic.$loaded().then(function(data){
            $scope.sitename = basic.sitename;
            $scope.username = basic.username;
            $scope.motto = basic.motto;
            $scope.navbar_text = basic.navbar_text;
            $scope.github = basic.github;
            $scope.facebook = basic.facebook;
            $scope.twitter = basic.twitter;
            $scope.weibo = basic.weibo;
            $scope.weibo_link = basic.weibo_link;
            $scope.language = basic.language;
        });

        $scope.AuthService = AuthService;

        $scope.editBasicOption = function() {

            basic.sitename = $scope.sitename;
            basic.username = $scope.username;
            basic.motto = $scope.motto;
            basic.navbar_text = $scope.navbar_text;
            basic.language = $scope.language=="zh"||$scope.language=="en"?$scope.language:"en";
            // basic.github = $scope.github;
            basic.facebook = $scope.facebook;
            basic.twitter = $scope.twitter;
            basic.weibo = $scope.weibo;
            basic.weibo_link = $scope.weibo_link;

            basic.$save().then(function(ref) {
                ref.key() === basic.$id; // true
                alert("Website Configs Updated!");
            }, function(error) {
              console.log("Error:", error);
            });
        }

        var page_name = "CONFIG";
        var site_name = OptionService.setSiteTitle(page_name);
        OptionService.setCurrentNav("config");
    }
]);

CAControllers.controller('LoginCtrl', ['$scope', "$window", "AuthService", "OptionService",
    function ($scope, $window, AuthService, OptionService){
        $scope.isLoggedIn = AuthService.isLoggedIn();
        $scope.AuthService = AuthService;

        if($scope.isLoggedIn){
            $window.location.href = "#/";
        }


        var page_name = "LOGIN";
        var site_name = OptionService.setSiteTitle(page_name);
        OptionService.setCurrentNav("");
    }
]);
