{#
+------------------------------------------------------------------------+
| PhalconEye CMS |
+------------------------------------------------------------------------+
| Copyright (c) 2013-2014 PhalconEye Team (http://phalconeye.com/) |
+------------------------------------------------------------------------+
| This source file is subject to the New BSD License that is bundled | |
with this package in the file LICENSE.txt. | | | | If you did not
receive a copy of the license and are unable to | | obtain it through
the world-wide-web, please send an email | | to license@phalconeye.com
so we can send you a copy immediately. |
+------------------------------------------------------------------------+
| Author: Ivan Vorontsov <ivan.vorontsov@phalconeye.com> |
+------------------------------------------------------------------------+
#}
{% extends "../../Core/View/layouts/admin.volt" %}

{% block title%}
	{{ 'Users'|i18n }}
{% endblock %}
{% block head %}
<script type="text/javascript">
        var deleteItem = function (id) {
            if (confirm('{{ "Are you really want to delete this user?" |i18n}}')) {
                window.location.href = '{{ url(['for':'admin-users-delete'])}}' + id;
            }
        }
</script>
{% endblock %} {% block header %}
<div id="top-navbar" class="navbar navbar-header">
	<div class="navbar-inner">{{ navigation.render() }}</div>
</div>
{% endblock %} {% block content %}
<div class="row">
	<div class="col-lg-12 col-sm-12 col-xs-12">
		<div class="well with-header">
			<div class="header bordered-blue">用户列表</div>
			<div id="table" class="" style="overflow-x: scroll;height:auto;"></div>
		</div>
	</div>
</div>
{#
<script type="text/javascript" src="/external/jquery/2.1.0/jquery-2.1.0.js"></script>
<link rel="stylesheet" type="text/css" href="/external/bootstrap/3.3.1/css/bootstrap.min.css" />
<script type="text/javascript" src="/external/bootstrap/3.3.1/js/bootstrap.min.js"></script>
<link rel="stylesheet" type="text/css" href="/external/handsontable/0.12.2/dist/handsontable.full.css" />
<script type="text/javascript" src="/external/handsontable/0.12.2/dist/handsontable.full.js"></script>


#}
<script>
  var data = [
    ["", "Kia", "Nissan", "Toyota", "Honda"],
    ["2008", 10, 11, 12, 13],
    ["2009", 20, 11, 14, 13],
    ["2010", 30, 15, 12, 13]
  ];

  var container = document.getElementById('table');
  var maxed = false
  , resizeTimeout
  , availableWidth
  , availableHeight;
  Handsontable.Dom.addEvent(window, 'resize', calculateSize);
  var calculateSize = function () {
	  if(maxed) {
	    var offset = Handsontable.Dom.offset(example);
	    availableWidth = Handsontable.Dom.innerWidth(document.body) - offset.left + window.scrollX;
	    availableHeight = Handsontable.Dom.innerHeight(document.body) - offset.top + window.scrollY;

	    container.style.width = availableWidth + 'px';
	    container.style.height = availableHeight + 'px';
	  }
  };

  var hot = new Handsontable(container,
    {
      data: data,
      minSpareRows: 1,
      colHeaders: true,
      stretchH: 'all',
      manualColumnResize:true,
      manualRowResize: true,
      contextMenu: false,
      renderAllRows: true,
      persistentState: true
    });
  var table = document.querySelector('table');
  Handsontable.Dom.addClass(table, 'table');
</script>
{# <h2>{{ 'Users' |i18n }} ({{ grid.getTotalCount() }})</h2> {{
grid.render() }} #} {% endblock %}
