$(function(){

	$(window).scroll(function() {
		if($(window).scrollTop() > 300){
			$('.fix_header').addClass('show');
		}else{
			$('.fix_header').removeClass('show');
		}
	});
	
	var btn_totop = $('.btn_totop');

	$(window).scroll(function(){
		if($(this).scrollTop()>200){
			btn_totop.fadeIn();
		}else{
			btn_totop.fadeOut();
		}
	});
  
	btn_totop.on('click', function() {
		$('body,html').animate({
		scrollTop: 0},200);
		return false;
	});

	var search_area = $('.search_area');
	search_area.on('click', function() {
		$('.wrap_search').fadeIn(200);
	});

	var btn_close_search = $('.btn_close_search');
	btn_close_search.on('click', function() {
		$('.wrap_search').fadeOut(200);
	});


	var nav_open = $('.nav_open');
	nav_open.on('click', function() {
		var disp_target = $('nav');
		disp_target.fadeIn(200);
	});
	
	var nav_close = $('.nav_close');
	nav_close.on('click', function() {
		var disp_target = $('nav');
		disp_target.fadeOut(200);
	});
	
	var nav_header = $('.nav_header');
	nav_header.on('click', function() {
		var disp_target = $('nav');
		disp_target.fadeOut(200);
	});
	
	var btn_sub_open = $('.btn_sub_open');
	btn_sub_open.on('click', function() {
		if($(this).hasClass('on')){
			$(this).removeClass('on');
		}else{
			$(this).addClass('on');
		}
		var disp_target = $(this).parent().find('.wrap_search_child');
		disp_target.slideToggle(200);
	});
	
	var bar_item_open = $('.bar_item_open');
	bar_item_open.on('click', function() {
		if($(this).hasClass('on')){
			$(this).removeClass('on');
		}else{
			$(this).addClass('on');
		}
		var disp_target = $(this).parent().find('.wrap_table');
		disp_target.slideToggle(200);
	});
	
	var btn_subnav_open = $('.btn_subnav_open');
	btn_subnav_open.on('click', function() {
		if($(this).hasClass('on')){
			$(this).removeClass('on');
		}else{
			$(this).addClass('on');
		}
		var disp_target = $(this).parent().parent().find('.sub_nav');
		disp_target.slideToggle(200);
	});


	var layer3abtn = $('article.layer3 .wrap_lead a.btn');
	layer3abtn.on('click', function() {
		if($(this).hasClass('on')){
			$(this).removeClass('on');
		}else{
			$(this).addClass('on');
		}
		var open_target = $(this).parent().parent().find('.search_parent');
		open_target.slideToggle(400);
	});
	
	var layer2abtn = $('article.layer2 .col_h2 a.btn');
	layer2abtn.on('click', function() {
		if($(this).hasClass('on')){
			$(this).removeClass('on');
		}else{
			$(this).addClass('on');
		}
		var open_target = $(this).parent().parent().find('.search_parent');
		open_target.slideToggle(400);
	});

	var table_target = $('.search .frame_item .wrap_items .wrap_table table');
	table_target.before('<div class="table_annotation">機能・製品名クリックで検索ページへリンク</div>');
	
	var part_all_table_allprd = $('.search.layer2.search_part .frame_item#all_prd .wrap_table table');
	part_all_table_allprd.after('<div class="table_anchor_btn"><a href="#all_prd" class="link_btn">「すべての機能・製品を見る」の先頭へ</a></div>');
	
	var part_allprd_bar_item_open = $('.search_part #all_prd .wrap_items .bar_item_open');
	part_allprd_bar_item_open.each(function(){
		var item_name = $(this).text();
		$(this).parent().attr('id',item_name);
	});
	
	var allprd_btn = [];
  $('.search_part #all_prd .wrap_items .bar_item_open').each(function() {
    allprd_btn.push($(this).text());
  });
  var listHtml = '<ul class="wrap_item_list page_anchor">';
  $.each(allprd_btn, function(index, text) {
	listHtml += '<li><a href="#' + text + '">' + text + '</a></li>';
  });
  listHtml += '</ul>';

  $('.search_part #all_prd h4').after(listHtml);
  
  var all_prd_bar = $('#all_prd .bar_item_open');
	all_prd_bar.addClass('on');

});

$(function() {
  // 保存内容を表示する関数
  function renderList() {
    var items = JSON.parse(localStorage.getItem("links") || "[]");
    var $section = $(".check_history");
    $section.empty();


    if (items.length === 0) return; // データがなければ何も表示しない

    // 見出しを追加
    $section.append($("<h4>").text("最近チェックした製品"));

    var latest5 = items.slice(-5); // 最新5件だけ取り出す

	var $ul = $("<ul>");
    $.each(latest5, function(index, item) {
	  var $li = $("<li>").html("<a href='" + item.value + "' target='_blank'>" + item.key + "</a>");
      $ul.append($li);
    });

    $section.append($ul);
  }

  // クリックイベント
  $(".save-link").on("click", function() {
    var key = $(this).text().trim();
    var value = $(this).attr("href");

    var items = JSON.parse(localStorage.getItem("links") || "[]");

    // 同じキーを削除
    items = $.grep(items, function(item) {
      return item.key !== key;
    });

    // 末尾に追加
    items.push({ key: key, value: value });

    // 最大10件に制限
    while (items.length > 10) {
      items.shift();
    }

    // 保存
    localStorage.setItem("links", JSON.stringify(items));

    // 表示更新
    renderList();
  });

  // ページ読み込み時に表示
  renderList();
});

$(function(){
	var history_body = $('.check_history');
	var history_btn = $('.check_history h4');
	history_btn.on('click', function() {
		if(history_body.hasClass('on')){
			history_body.removeClass('on');
		}else{
			history_body.addClass('on');
		}
	});

});

$(function(){
	var list_tile = $('.target_theme .list_title');
	list_tile.on('click', function() {
		if($(this).hasClass('opened')){
			$(this).removeClass('opened');
		}else{
			$(this).addClass('opened');
		}
		$target_id = $(this).attr('id');
		$(this).parent().find('.' + $target_id).slideToggle(200);
	});
});